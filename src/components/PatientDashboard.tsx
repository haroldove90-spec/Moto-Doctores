import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User, 
  ChevronRight, 
  ShieldCheck, 
  Activity,
  Phone,
  MessageSquare,
  XCircle,
  CreditCard,
  History,
  Stethoscope,
  Camera,
  Heart,
  Zap,
  Thermometer,
  Dna,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import TrackingMap from './TrackingMap';
import { useDoctorTracking } from '@/src/hooks/useDoctorTracking';
import DoctorNotification from './DoctorNotification';
import Checkout from './Checkout';
import ConsultationHistory from './ConsultationHistory';
import { TriageChat } from './TriageChat';
import { PrescriptionScanner } from './PrescriptionScanner';

// Tipos simulados
interface Appointment {
  id: string;
  status: 'solicitado' | 'en_camino' | 'en_consulta' | 'finalizado';
  doctorName?: string;
  doctorId?: string;
  eta?: string;
  location?: string;
  price?: number;
}

export function PatientDashboard() {
  const [activeAppointment, setActiveAppointment] = React.useState<Appointment | null>({
    id: '1',
    status: 'en_camino',
    doctorName: 'Dr. Alejandro Ruiz',
    doctorId: 'doctor-123',
    eta: '8 min',
    location: 'Calle 10 #45-20, El Poblado',
    price: 45.00
  });

  const [isRequesting, setIsRequesting] = React.useState(false);
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [view, setView] = React.useState<'home' | 'history'>('home');
  const [showTriage, setShowTriage] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(false);
  
  const { location: doctorLocation } = useDoctorTracking(activeAppointment?.doctorId);
  const patientCoords = { lat: 6.2083, lng: -75.5678 };

  const handleRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setShowCheckout(true);
    }, 1500);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setActiveAppointment({
      id: '2',
      status: 'solicitado',
      location: 'Ubicación actual',
      price: 45.00
    });
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar la cita?')) {
      setActiveAppointment(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24 cyber-grid">
      <DoctorNotification onRequestAccept={(id) => console.log('Aceptada:', id)} />

      <AnimatePresence>
        {showCheckout && (
          <Checkout 
            amount={45.00} 
            onSuccess={handlePaymentSuccess} 
            onCancel={() => setShowCheckout(false)} 
          />
        )}
        {showTriage && (
          <TriageChat onClose={() => setShowTriage(false)} />
        )}
        {showScanner && (
          <PrescriptionScanner 
            onClose={() => setShowScanner(false)} 
            onComplete={(drugs) => console.log('Medicamentos escaneados:', drugs)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel px-6 py-4 flex justify-between items-center border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter glow-text">
            MOTO <span className="text-slate-400">DOCTORES</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-xs text-slate-500 uppercase tracking-widest">SISTEMA ACTIVO</p>
            <p className="text-sm font-mono text-cyan-400">V.2.0.4</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-inner">
            JD
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 pt-6 space-y-8 max-w-7xl mx-auto">
        {view === 'home' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Body Scan & Stats */}
            <div className="w-full lg:w-1/3 space-y-6 order-2 lg:order-1">
              <section className="glass-panel rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-500/70">BIOMETRÍA</h3>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></span>
                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>
                
                <div className="flex justify-center py-4 relative">
                  {/* Stylized Body Silhouette */}
                  <div className="relative w-48 h-64 opacity-40">
                    <svg viewBox="0 0 200 400" className="w-full h-full fill-cyan-500/20 stroke-cyan-500/40 stroke-1">
                      <path d="M100,20 C120,20 135,35 135,55 C135,75 120,90 100,90 C80,90 65,75 65,55 C65,35 80,20 100,20 M100,90 L100,150 M100,100 L150,140 M100,100 L50,140 M100,150 L130,300 M100,150 L70,300" />
                    </svg>
                    {/* Glowing Scan Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10"
                    />
                  </div>
                  
                  {/* Floating Data Points */}
                  <div className="absolute top-4 right-0 flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase">Ritmo</p>
                      <p className="text-lg font-mono font-bold text-cyan-400">72 <span className="text-[10px]">BPM</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase">Temp</p>
                      <p className="text-lg font-mono font-bold text-cyan-400">36.6 <span className="text-[10px]">°C</span></p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 flex flex-col items-start gap-4">
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 uppercase">O2</p>
                      <p className="text-lg font-mono font-bold text-cyan-400">98 <span className="text-[10px]">%</span></p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowTriage(true)}
                  className="cyber-button p-4 rounded-2xl flex flex-col items-center gap-3"
                >
                  <Stethoscope className="w-6 h-6 text-cyan-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">TRIAJE IA</span>
                </button>
                <button 
                  onClick={() => setShowScanner(true)}
                  className="cyber-button p-4 rounded-2xl flex flex-col items-center gap-3 border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400"
                >
                  <Camera className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SCANNER</span>
                </button>
              </div>
            </div>

            {/* Middle & Right Column: Map & Active Status */}
            <div className="lg:col-span-8 space-y-6">
              {/* Map Section */}
              <section className="glass-panel rounded-3xl overflow-hidden h-[400px] relative border border-cyan-500/20">
                <TrackingMap 
                  patientCoords={patientCoords}
                  doctorCoords={doctorLocation ? { lat: doctorLocation.latitude, lng: doctorLocation.longitude } : undefined}
                />
                <div className="absolute top-4 left-4 z-10">
                  <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border-cyan-500/30">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">GPS ACTIVE</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 z-10">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">UBICACIÓN ACTUAL</p>
                    <p className="text-sm font-medium truncate text-slate-200">
                      {activeAppointment?.location || 'Detectando ubicación...'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Active Appointment Status */}
              <AnimatePresence mode="wait">
                {activeAppointment ? (
                  <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-3xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <Zap className="w-6 h-6 text-cyan-400/20" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-cyan-500/30 mb-2">
                            {activeAppointment.status.replace('_', ' ')}
                          </span>
                          <h3 className="text-2xl font-bold glow-text">
                            {activeAppointment.doctorName || 'BUSCANDO DOCTOR'}
                          </h3>
                        </div>
                        
                        {activeAppointment.status === 'en_camino' && (
                          <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                              <p className="text-[10px] text-slate-500 uppercase mb-1">ARRIBO ESTIMADO</p>
                              <p className="text-2xl font-mono font-bold text-cyan-400">{activeAppointment.eta}</p>
                            </div>
                            <div className="flex gap-3">
                              <button className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform">
                                <Phone className="w-5 h-5" />
                              </button>
                              <button className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 text-slate-200 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <MessageSquare className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-end gap-3 md:w-48">
                        <button 
                          onClick={handleCancel}
                          className="w-full py-3 text-slate-500 hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> CANCELAR
                        </button>
                      </div>
                    </div>
                  </motion.section>
                ) : (
                  <button 
                    onClick={handleRequest}
                    disabled={isRequesting}
                    className="w-full h-24 cyber-button rounded-3xl flex items-center justify-center gap-4 group"
                  >
                    {isRequesting ? (
                      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
                          <Navigation className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-xl font-bold glow-text">SOLICITAR MOTO DOCTOR</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">RESPUESTA INMEDIATA • 24/7</p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </AnimatePresence>

              {/* Secondary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'CORAZÓN', value: '84%', icon: Heart, color: 'text-rose-400' },
                  { label: 'OXÍGENO', value: '99%', icon: Activity, color: 'text-cyan-400' },
                  { label: 'HIDRATACIÓN', value: '62%', icon: Zap, color: 'text-amber-400' },
                  { label: 'TEMP', value: '36.8°', icon: Thermometer, color: 'text-emerald-400' }
                ].map((stat, idx) => (
                  <div key={idx} className="glass-panel p-4 rounded-2xl border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                      <span className="text-[10px] font-mono text-slate-500">{stat.value}</span>
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{stat.label}</p>
                    <div className="w-full bg-slate-800 h-[2px] mt-2 rounded-full overflow-hidden">
                      <div className={cn("h-full bg-current", stat.color)} style={{ width: stat.value }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ConsultationHistory />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel h-16 rounded-full px-8 flex items-center gap-12 z-50 border-cyan-500/20">
        <button 
          onClick={() => setView('home')}
          className={cn("p-2 transition-all duration-300", view === 'home' ? "text-cyan-400 scale-125 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "text-slate-500 hover:text-slate-300")}
        >
          <Activity className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setView('history')}
          className={cn("p-2 transition-all duration-300", view === 'history' ? "text-cyan-400 scale-125 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "text-slate-500 hover:text-slate-300")}
        >
          <History className="w-6 h-6" />
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
          <User className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
