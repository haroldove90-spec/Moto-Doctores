import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Map as MapIcon, 
  ShieldCheck, 
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  AlertTriangle,
  Bell,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

// --- Commission Logic ---
const PLATFORM_COMMISSION_RATE = 0.20;
const DOCTOR_SHARE_RATE = 0.80;

// --- Mock Data ---
const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Alejandro Ruiz', specialty: 'General', status: 'active', license: '1234567', validated: true, rating: 4.9, totalEarnings: 12500, commission: 80 },
  { id: '2', name: 'Dra. Sofía Méndez', specialty: 'Pediatría', status: 'inactive', license: '7654321', validated: false, rating: 4.8, totalEarnings: 8400, commission: 80 },
  { id: '3', name: 'Dr. Carlos Ortega', specialty: 'Urgencias', status: 'active', license: '9876543', validated: true, rating: 4.7, totalEarnings: 15200, commission: 80 },
  { id: '4', name: 'Dra. Elena Gómez', specialty: 'General', status: 'active', license: '4567890', validated: true, rating: 4.9, totalEarnings: 9800, commission: 80 },
];

const MOCK_CRITICAL_ALERTS = [
  { id: '1', patient: 'Juan Pérez', symptoms: 'Dolor opresivo en el pecho y sudoración fría', severity: 'Rojo', time: 'Hace 2 min', location: 'Roma Norte' },
  { id: '2', patient: 'María García', symptoms: 'Dificultad respiratoria súbita', severity: 'Rojo', time: 'Hace 5 min', location: 'Polanco' },
];

const MOCK_HEATMAP_POINTS: [number, number, number][] = [
  [19.4326, -99.1332, 0.8],
  [19.4284, -99.1276, 0.5],
  [19.4400, -99.1450, 0.9],
  [19.4100, -99.1600, 0.7],
  [19.3900, -99.1700, 0.6],
  [19.3500, -99.1800, 0.4],
];

// --- Heatmap Component ---
const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    // @ts-ignore
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red' }
    }).addTo(map);
    return () => { map.removeLayer(heatLayer); };
  }, [map, points]);
  return null;
};

export function AdminDashboard() {
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState(MOCK_CRITICAL_ALERTS);

  const stats = useMemo(() => ({
    consultationsToday: { total: 48, completed: 32 },
    grossRevenue: 15420,
    avgArrivalTime: 12.5,
    activeDoctors: doctors.filter(d => d.status === 'active').length
  }), [doctors]);

  const handleValidateLicense = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, validated: true } : d));
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-10 cyber-grid">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500/70">CENTRO DE COMANDO</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter glow-text uppercase">
            MOTO <span className="text-slate-400">DOCTORES</span> <span className="text-cyan-500/30 ml-2">ADMIN</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white border-2 border-[#020617] animate-pulse">
                {alerts.length}
              </span>
            )}
          </div>
          <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
          <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-cyan-500/20">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              HO
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold">Harold Ove</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Director General</p>
            </div>
          </div>
        </div>
      </header>

      {/* Critical Alerts Section */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />
              <h2 className="text-xl font-bold tracking-tight uppercase">ALERTAS CRÍTICAS (IA TRIAGE)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-6 rounded-3xl border-l-4 border-l-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{alert.time}</p>
                      <h3 className="text-lg font-bold">{alert.patient}</h3>
                    </div>
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      CÓDIGO ROJO
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 italic">"{alert.symptoms}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapIcon className="w-4 h-4" />
                      {alert.location}
                    </div>
                    <button 
                      onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                      className="cyber-button px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border-rose-500/50 text-rose-400"
                    >
                      ASIGNAR MOTO PRIORITARIA
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[
          { label: 'Consultas Hoy', value: `${stats.consultationsToday.completed}/${stats.consultationsToday.total}`, sub: '12% incremento', icon: Activity, color: 'text-cyan-400' },
          { label: 'Ingresos Brutos', value: `$${stats.grossRevenue.toLocaleString()}`, sub: 'Comisión: $3,084.00', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Tiempo Arribo', value: `${stats.avgArrivalTime} min`, sub: '-2 min vs ayer', icon: Clock, color: 'text-amber-400' },
          { label: 'Médicos Activos', value: stats.activeDoctors, sub: '4 en espera', icon: Users, color: 'text-indigo-400' },
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-3xl border-white/5 group hover:border-cyan-500/30 transition-colors min-h-[160px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-slate-800 border border-white/5", kpi.color)}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-xl md:text-2xl font-mono font-bold glow-text">{kpi.value}</h3>
            <p className="text-[10px] text-slate-500 mt-2">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Heatmap Section */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-4 md:p-6 border-white/5 order-2 lg:order-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-base md:text-lg font-bold flex items-center gap-2 uppercase tracking-tight">
              <MapIcon className="w-5 h-5 text-cyan-400" />
              MAPA DE CALOR (DEMANDA)
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 text-[10px] font-bold uppercase border border-white/10 min-h-[40px]">Hoy</button>
              <button className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase border border-cyan-500/30 min-h-[40px]">Semana</button>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full relative z-0 rounded-2xl overflow-hidden border border-white/5">
            <MapContainer 
              center={[19.4326, -99.1332]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer points={MOCK_HEATMAP_POINTS} />
            </MapContainer>
          </div>
        </div>

        {/* Commission Summary */}
        <div className="glass-panel rounded-3xl p-6 border-white/5">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            DISTRIBUCIÓN DE INGRESOS
          </h2>
          <div className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Plataforma (20%)</span>
                <span className="text-cyan-400 font-mono font-bold">${(stats.grossRevenue * 0.2).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[20%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Médicos (80%)</span>
                <span className="text-white font-mono font-bold">${(stats.grossRevenue * 0.8).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[80%]"></div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.2em]">TOP MÉDICOS (GANANCIAS)</h3>
              <div className="space-y-4">
                {doctors.sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 3).map((doc, idx) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{doc.specialty}</p>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">${doc.totalEarnings.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Management Table */}
      <section className="glass-panel rounded-3xl overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold uppercase tracking-tight">GESTIÓN DE MÉDICOS</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar médico..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <button className="p-2 bg-slate-800 border border-white/10 rounded-xl text-slate-400 hover:text-cyan-400">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Médico</th>
                <th className="px-6 py-4">Especialidad</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Validación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {doc.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-cyan-500">
                          <CheckCircle2 className="w-3 h-3" />
                          {doc.rating} Rating
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{doc.specialty}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                      doc.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
                    )}>
                      {doc.status === 'active' ? 'En Ruta' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">{doc.license}</code>
                  </td>
                  <td className="px-6 py-4">
                    {doc.validated ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        Verificada
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleValidateLicense(doc.id)}
                        className="cyber-button px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border-cyan-500/50 text-cyan-400"
                      >
                        Validar Cédula
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
