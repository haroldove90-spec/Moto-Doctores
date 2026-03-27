import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ShieldCheck, X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DISMISS_KEY = 'pwa_install_dismissed_at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export function PWAInstallPopup() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if installable, not already installed, and not recently dismissed
    if (isInstallable && !isInstalled) {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      const now = Date.now();

      if (!dismissedAt || now - parseInt(dismissedAt) > DISMISS_DURATION) {
        // Delay showing to not overwhelm the user immediately
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleInstall = async () => {
    await installApp();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[10000] md:left-auto md:right-8 md:w-96"
        >
          <div className="glass-panel p-5 rounded-3xl border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
            
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="pr-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-sm font-bold uppercase tracking-tight">Moto Doctores</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ¡Lleva a tu médico en el bolsillo! Instala la App para agendar en 1 clic y recibir alertas en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 cyber-button py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                Instalar App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
              >
                Después
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
