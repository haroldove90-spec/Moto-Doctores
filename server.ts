import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import twilio from "twilio";
import webpush from "web-push";
import { calculateDistance } from "./src/lib/geoUtils.ts";

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization helpers
let stripeClient: Stripe | null = null;
const getStripe = () => {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");
  }
  return stripeClient;
};

let twilioClient: any = null;
const getTwilio = () => {
  if (!twilioClient) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID || "AC_mock",
      process.env.TWILIO_AUTH_TOKEN || "token_mock"
    );
  }
  return twilioClient;
};

let vapidConfigured = false;
const configureVapid = () => {
  if (!vapidConfigured) {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (publicKey && privateKey) {
      try {
        webpush.setVapidDetails(
          "mailto:support@motodoctores.com",
          publicKey,
          privateKey
        );
        vapidConfigured = true;
      } catch (error) {
        console.error("Failed to set VAPID details:", error);
      }
    } else {
      console.warn("VAPID keys missing. Push notifications will be disabled.");
    }
  }
  return vapidConfigured;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- 1. Middleware: Route Security (Role Protection) ---
  // Note: In a real app, this would verify the Supabase JWT.
  // For this demo, we'll check a custom header or mock it.
  const authMiddleware = (roles: string[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userRole = req.headers["x-user-role"] as string; // Simulation
    
    if (!userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };

  // --- 2. Webhooks: Supabase Appointment Hook ---
  // Triggered on 'appointments' insert
  app.post("/api/webhooks/appointments", async (req, res) => {
    const { record } = req.body; // Supabase payload
    
    if (!record) return res.status(400).send("No record found");

    try {
      // A. Push Notification to Doctor
      // In real app, we'd fetch the doctor's push subscription from DB
      const doctorSubscription = record.doctor_subscription; 
      if (doctorSubscription && configureVapid()) {
        await webpush.sendNotification(
          doctorSubscription,
          JSON.stringify({
            title: "Nueva Cita Asignada",
            body: `Paciente: ${record.patient_name}. Ubicación: ${record.address}`,
            icon: "/icon-192x192.png"
          })
        );
      }

      // B. WhatsApp to Patient (Twilio)
      await getTwilio().messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || "+14155238886"}`,
        to: `whatsapp:${record.patient_phone}`,
        body: `¡Hola ${record.patient_name}! Tu MotoDoctor va en camino. Estado: ${record.status}.`
      });

      res.status(200).json({ status: "Notifications sent" });
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(500).json({ error: "Failed to process notifications" });
    }
  });

  // --- 3. Calculation: Find Nearest Doctor (API) ---
  app.post("/api/match-doctor", async (req, res) => {
    const { patientLat, patientLon, doctors } = req.body;
    
    const MAX_RADIUS_KM = 10;
    let nearest = null;
    let minDistance = Infinity;

    doctors.forEach((doc: any) => {
      const dist = calculateDistance(patientLat, patientLon, doc.lat, doc.lon);
      if (dist <= MAX_RADIUS_KM && dist < minDistance) {
        minDistance = dist;
        nearest = { ...doc, distance: dist };
      }
    });

    res.json({ nearest });
  });

  // --- 4. Billing: Finish Consultation ---
  app.post("/api/consultations/finish", authMiddleware(["doctor", "admin"]), async (req, res) => {
    const { appointmentId, basePrice, extraSupplies, patientStripeId } = req.body;

    const total = basePrice + extraSupplies;

    try {
      // A. Charge via Stripe
      const paymentIntent = await getStripe().paymentIntents.create({
        amount: total * 100, // in cents
        currency: "mxn",
        customer: patientStripeId,
        payment_method_types: ["card"],
        confirm: true,
        off_session: true, // Automatic charge
      });

      // B. Generate Electronic Invoice (Mock)
      // In real app, call SAT API or similar
      const invoiceId = `FAC-${Date.now()}`;

      res.status(200).json({
        status: "Consultation finished and charged",
        total,
        invoiceId,
        paymentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Billing Error:", error);
      res.status(500).json({ error: "Payment failed" });
    }
  });

  // Vite middleware for development
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
