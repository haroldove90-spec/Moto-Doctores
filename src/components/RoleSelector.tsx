import React from 'react';
import { User, Shield, Bike, Stethoscope, ChevronRight, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '../hooks/useMockAuth';

interface RoleSelectorProps {
  onSelect: (role: UserRole) => void;
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'patient' as UserRole,
      title: 'PACIENTE',
      description: 'Solicitar Médico ahora',
      icon: User,
      color: 'text-motodoctores-accent',
      bg: 'bg-motodoctores-accent/10',
      border: 'border-motodoctores-accent/30',
      hover: 'hover:border-motodoctores-accent/60',
      shadow: 'shadow-motodoctores-accent/20'
    },
    {
      id: 'doctor' as UserRole,
      title: 'MÉDICO',
      description: 'Panel de Consultas Activas',
      icon: Bike,
      icon2: Stethoscope,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      hover: 'hover:border-emerald-400/60',
      shadow: 'shadow-emerald-500/20'
    },
    {
      id: 'admin' as UserRole,
      title: 'ADMINISTRADOR',
      description: 'Gestión de Flota y Ganancias',
      icon: Shield,
      color: 'text-motodoctores-alert',
      bg: 'bg-motodoctores-alert/10',
      border: 'border-motodoctores-alert/30',
      hover: 'hover:border-motodoctores-alert/60',
      shadow: 'shadow-motodoctores-alert/20'
    }
  ];

  return (
    <div className="min-h-screen bg-motodoctores-background flex flex-col items-center justify-center p-6 cyber-grid overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-motodoctores-accent/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-motodoctores-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-motodoctores-accent/70">MODO DEMO ACTIVO</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter glow-text uppercase mb-4">
          MOTO <span className="text-motodoctores-text/40">DOCTORES</span>
        </h1>
        <p className="text-motodoctores-text/40 font-medium tracking-widest text-sm uppercase">Selecciona tu rol para comenzar la simulación</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
        {roles.map((role, idx) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(role.id)}
            className={cn(
              "glass-panel p-8 rounded-[2.5rem] border-2 text-left transition-all duration-300 group relative overflow-hidden",
              role.bg,
              role.border,
              role.hover,
              "shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
            )}
          >
            {/* Hover Glow */}
            <div className={cn(
              "absolute -top-24 -right-24 w-48 h-48 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity",
              role.bg.replace('/10', '/40')
            )}></div>

            <div className="flex justify-between items-start mb-10">
              <div className={cn("p-5 rounded-3xl bg-motodoctores-background/80 border border-white/5 relative", role.color)}>
                <role.icon className="w-10 h-10" />
                {role.icon2 && (
                  <role.icon2 className="w-6 h-6 absolute -bottom-1 -right-1 bg-motodoctores-background rounded-lg p-1 border border-white/5" />
                )}
              </div>
              <Activity className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </div>

            <div>
              <h3 className={cn("text-2xl font-black tracking-tight mb-2", role.color)}>{role.title}</h3>
              <p className="text-motodoctores-text/40 text-sm font-medium leading-relaxed pr-8">{role.description}</p>
            </div>

            <div className="mt-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-motodoctores-text/40 group-hover:text-motodoctores-text transition-colors">
              ENTRAR AHORA
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>

      <footer className="mt-20 text-motodoctores-text/20 text-[10px] font-bold uppercase tracking-[0.3em] relative z-10">
        MotoDoctores v1.0.0-beta • Harold Ove (CTO)
      </footer>
    </div>
  );
}
