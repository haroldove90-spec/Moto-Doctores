import React from 'react';
import { LogOut, User, Shield, Bike, Zap, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '../hooks/useMockAuth';

interface DebugBarProps {
  user: { name: string; role: UserRole } | null;
  onLogout: () => void;
}

export function DebugBar({ user, onLogout }: DebugBarProps) {
  if (!user) return null;

  const roleIcons = {
    patient: <User className="w-3.5 h-3.5 text-cyan-400" />,
    doctor: <Bike className="w-3.5 h-3.5 text-emerald-400" />,
    admin: <Shield className="w-3.5 h-3.5 text-amber-400" />
  };

  const roleColors = {
    patient: 'text-cyan-400',
    doctor: 'text-emerald-400',
    admin: 'text-amber-400'
  };

  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[10001] px-6 py-2 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between shadow-2xl"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/70">DEBUG MODE</span>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10"></div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
            {roleIcons[user.role as keyof typeof roleIcons]}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-white">{user.name}</p>
            <p className={cn("text-[8px] font-black uppercase tracking-widest", roleColors[user.role as keyof typeof roleColors])}>
              {user.role}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>
    </motion.div>
  );
}
