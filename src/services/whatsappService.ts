import { Phone } from 'lucide-react';

export interface WhatsAppMessage {
  to: string;
  message: string;
  mediaUrl?: string;
  doctorName?: string;
  bikeModel?: string;
}

export const sendWhatsAppNotification = async (payload: WhatsAppMessage) => {
  // Simulación de integración con WhatsApp Business API
  console.log('--- ENVIANDO NOTIFICACIÓN WHATSAPP ---');
  console.log(`Para: ${payload.to}`);
  console.log(`Mensaje: ${payload.message}`);
  if (payload.mediaUrl) console.log(`Foto del Médico: ${payload.mediaUrl}`);
  if (payload.doctorName) console.log(`Médico: ${payload.doctorName}`);
  if (payload.bikeModel) console.log(`Moto: ${payload.bikeModel}`);
  console.log('--------------------------------------');

  // En un entorno real, aquí se llamaría a la API de WhatsApp (ej. Meta for Developers)
  return { success: true, messageId: `wa_${Date.now()}` };
};

export const notifyDoctorArrival = async (patientPhone: string, doctor: { name: string, photo: string, bike: string }) => {
  const message = `¡Hola! Tu MotoDoctor ${doctor.name} está a 5 minutos de llegar en una ${doctor.bike}. Por tu seguridad, verifica la foto adjunta.`;
  
  return await sendWhatsAppNotification({
    to: patientPhone,
    message,
    mediaUrl: doctor.photo,
    doctorName: doctor.name,
    bikeModel: doctor.bike
  });
};
