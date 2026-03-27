import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, MapPin, Check, X, User } from 'lucide-react';

interface NewRequest {
  id: string;
  patientName: string;
  distance: string;
  address: string;
}

export default function DoctorNotification({ onRequestAccept }: { onRequestAccept: (id: string) => void }) {
  const [request, setRequest] = React.useState<NewRequest | null>(null);

  // Simulación de recepción de solicitud (en producción vendría de Supabase Realtime)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRequest({
        id: 'req-123',
        patientName: 'María García',
        distance: '1.2 km',
        address: 'Carrera 43A #1-50'
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!request) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-6 left-6 right-6 z-[100] max-w-md mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-5 flex flex-col gap-4 overflow-hidden relative">
          {/* Barra de progreso de tiempo de respuesta */}
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 15, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-blue-500"
          />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-lg">¡Nueva Solicitud!</h4>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" /> A {request.distance} de tu zona
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-slate-700">{request.patientName}</p>
              <p className="text-xs text-slate-400 truncate">{request.address}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setRequest(null)}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Ignorar
            </button>
            <button 
              onClick={() => {
                onRequestAccept(request.id);
                setRequest(null);
              }}
              className="flex-[2] py-3 px-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Aceptar Servicio
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
