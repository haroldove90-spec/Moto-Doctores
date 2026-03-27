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
    patient: <User className="w-3.5 h-3.5 text-motodoctores-accent" />,
    doctor: <Bike className="w-3.5 h-3.5 text-emerald-400" />,
    admin: <Shield className="w-3.5 h-3.5 text-motodoctores-alert" />
  };

  const roleColors = {
    patient: 'text-motodoctores-accent',
    doctor: 'text-emerald-400',
    admin: 'text-motodoctores-alert'
  };

  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[10001] px-6 py-2 bg-motodoctores-background/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between shadow-2xl"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-motodoctores-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-motodoctores-accent/70">DEBUG MODE</span>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10"></div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-motodoctores-background border border-white/5 flex items-center justify-center">
            {roleIcons[user.role as keyof typeof roleIcons]}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-motodoctores-text">{user.name}</p>
            <p className={cn("text-[8px] font-black uppercase tracking-widest", roleColors[user.role as keyof typeof roleColors])}>
              {user.role}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-motodoctores-text/40 hover:text-motodoctores-text transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-motodoctores-accent/10 text-motodoctores-accent border border-motodoctores-accent/30 text-[10px] font-black uppercase tracking-widest hover:bg-motodoctores-accent/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>
    </motion.div>
  );
}
