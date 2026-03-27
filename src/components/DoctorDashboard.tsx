import React, { useState } from 'react';
import { 
  Bike, 
  Stethoscope, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  ChevronRight,
  MessageSquare,
  Navigation,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

// --- Mock Data ---
const MOCK_ACTIVE_CONSULTATION = {
  id: '1',
  patient: 'Juan Pérez',
  age: 42,
  symptoms: 'Dolor opresivo en el pecho y sudoración fría',
  severity: 'Rojo',
  location: 'Av. Reforma 222, CDMX',
  distance: '0.8 km',
  timeRemaining: '4 min',
  triageIA: 'Posible evento coronario. Se recomienda oxigenoterapia y monitoreo constante.'
};

const MOCK_HISTORY = [
  { id: '2', patient: 'María García', date: 'Hoy, 10:30 AM', diagnosis: 'Infección estomacal', status: 'finalizado' },
  { id: '3', patient: 'Carlos Slim', date: 'Ayer, 4:15 PM', diagnosis: 'Migraña tensional', status: 'finalizado' },
];

export function DoctorDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeConsultation, setActiveConsultation] = useState(MOCK_ACTIVE_CONSULTATION);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-10 cyber-grid">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bike className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/70">UNIDAD DE RESPUESTA RÁPIDA</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter glow-text uppercase">
            MOTO <span className="text-slate-400">DOCTORES</span> <span className="text-emerald-500/30 ml-2">MÉDICO</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl border-emerald-500/20">
            <div className={cn(
              "w-3 h-3 rounded-full animate-pulse",
              isOnline ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-600"
            )}></div>
            <span className="text-xs font-bold uppercase tracking-widest">{isOnline ? 'EN LÍNEA' : 'FUERA DE SERVICIO'}</span>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className="ml-4 text-[10px] font-bold text-slate-500 hover:text-white transition-colors underline underline-offset-4"
            >
              CAMBIAR
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Consultation Card */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {activeConsultation && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 md:p-8 rounded-[2.5rem] border-emerald-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shrink-0">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CONSULTA ACTIVA</p>
                      <h2 className="text-xl md:text-2xl font-bold leading-tight">
                        {activeConsultation.patient} 
                        <span className="text-slate-500 text-sm md:text-lg font-medium ml-2 block sm:inline">{activeConsultation.age} años</span>
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 md:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                      CÓDIGO ROJO
                    </span>
                    <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 md:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {activeConsultation.distance}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 relative z-10">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        SÍNTOMAS REPORTADOS
                      </h3>
                      <p className="text-sm md:text-base text-slate-300 italic leading-relaxed">"{activeConsultation.symptoms}"</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        DIRECCIÓN DE ARRIBO
                      </h3>
                      <p className="text-sm md:text-base text-slate-300">{activeConsultation.location}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                    <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      ANÁLISIS TRIAJE IA
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                      {activeConsultation.triageIA}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <button className="flex-1 cyber-button py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/50 min-h-[56px]">
                    <Navigation className="w-5 h-5" />
                    INICIAR NAVEGACIÓN
                  </button>
                  <button className="flex-1 bg-white text-black py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors min-h-[56px]">
                    <CheckCircle2 className="w-5 h-5" />
                    FINALIZAR CONSULTA
                  </button>
                  <button className="sm:w-14 sm:h-14 rounded-2xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center min-h-[56px]">
                    <MessageSquare className="w-6 h-6" />
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Consultas Hoy', value: '8', icon: Activity, color: 'text-cyan-400' },
              { label: 'Ganancias Hoy', value: '$2,400', icon: Zap, color: 'text-amber-400' },
              { label: 'Tiempo Promedio', value: '14 min', icon: Clock, color: 'text-indigo-400' },
            ].map((stat, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-3xl border-white/5">
                <div className={cn("p-3 rounded-2xl bg-slate-800 border border-white/5 w-fit mb-4", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-xl font-bold font-mono">{stat.value}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: History & Alerts */}
        <div className="space-y-8">
          <section className="glass-panel p-6 rounded-3xl border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              HISTORIAL RECIENTE
            </h3>
            <div className="space-y-4">
              {MOCK_HISTORY.map((item) => (
                <div key={item.id} className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold">{item.patient}</p>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase mb-2">{item.date}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    {item.diagnosis}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6 rounded-3xl border-white/5 bg-rose-500/5 border-rose-500/20">
            <h3 className="text-sm font-bold uppercase tracking-tight mb-4 flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              ZONAS DE ALTA DEMANDA
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Se detecta un incremento de solicitudes en **Roma Norte** y **Condesa**. Dirígete a la zona para reducir tiempos de espera.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all">
              VER MAPA DE CALOR
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
