import React from 'react';
import { motion } from 'motion/react';
import { Calendar, FileText, Download, ChevronRight, MapPin, User, Activity } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Consultation {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  status: 'finalizado' | 'cancelado';
  prescriptionUrl?: string;
  address: string;
}

const historyData: Consultation[] = [
  {
    id: 'h1',
    date: '24 Mar 2026',
    doctorName: 'Dr. Alejandro Ruiz',
    diagnosis: 'Gripe estacional con fiebre leve',
    status: 'finalizado',
    prescriptionUrl: '#',
    address: 'Calle 10 #45-20, El Poblado'
  },
  {
    id: 'h2',
    date: '15 Mar 2026',
    doctorName: 'Dra. Sofía Méndez',
    diagnosis: 'Control de presión arterial',
    status: 'finalizado',
    prescriptionUrl: '#',
    address: 'Calle 10 #45-20, El Poblado'
  },
  {
    id: 'h3',
    date: '02 Mar 2026',
    doctorName: 'Dr. Carlos Vaca',
    diagnosis: 'Dolor abdominal agudo',
    status: 'cancelado',
    address: 'Calle 10 #45-20, El Poblado'
  }
];

export default function ConsultationHistory() {
  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-slate-800">Historial Médico</h3>
        <button className="text-sm font-bold text-blue-600 flex items-center gap-1">
          Ver todo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-slate-200 before:to-transparent">
        {historyData.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start group"
          >
            {/* Timeline dot */}
            <div className={cn(
              "absolute left-0 mt-1.5 h-10 w-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 transition-colors",
              item.status === 'finalizado' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
            )}>
              {item.status === 'finalizado' ? <Activity className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="ml-14 flex-1">
              <div className="glass-card p-5 rounded-3xl space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.date}</p>
                    <h4 className="font-bold text-slate-800">{item.doctorName}</h4>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                    item.status === 'finalizado' ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-700">Diagnóstico:</span> {item.diagnosis}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" /> {item.address}
                  </div>
                </div>

                {item.prescriptionUrl && (
                  <div className="pt-2 flex gap-3">
                    <button className="flex-1 py-2.5 px-4 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                      <Download className="w-4 h-4" /> Descargar Receta
                    </button>
                    <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
