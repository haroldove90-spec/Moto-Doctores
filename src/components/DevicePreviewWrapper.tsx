import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, X, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

type DeviceType = 'iphone' | 'ipad' | 'desktop';

interface DevicePreviewWrapperProps {
  children: React.ReactNode;
}

export function DevicePreviewWrapper({ children }: DevicePreviewWrapperProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [showControls, setShowControls] = useState(false);

  const devices = {
    iphone: { width: '393px', height: '852px', label: 'iPhone 15', icon: Smartphone },
    ipad: { width: '820px', height: '1180px', label: 'iPad Air', icon: Tablet },
    desktop: { width: '100%', height: '100%', label: 'Desktop', icon: Monitor },
  };

  const ActiveIcon = devices[device].icon;

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden flex flex-col">
      {/* Control Toggle */}
      <div className="fixed top-20 right-4 z-[10002]">
        <button 
          onClick={() => setShowControls(!showControls)}
          className="glass-panel text-white p-3 rounded-full border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-2xl group"
        >
          <Zap className={cn("w-5 h-5 text-cyan-400", showControls && "animate-pulse")} />
        </button>
      </div>

      {/* Device Controls Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-36 right-4 z-[10002] w-64 glass-panel p-6 rounded-3xl border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/70">AUDITORÍA RESPONSIVA</h3>
              <button onClick={() => setShowControls(false)} className="btn-reset text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(Object.keys(devices) as DeviceType[]).map((key) => {
                const d = devices[key];
                const Icon = d.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setDevice(key)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group",
                      device === key 
                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" 
                        : "bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">{d.label}</span>
                    </div>
                    {device === key && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[8px] text-slate-600 uppercase tracking-widest leading-relaxed">
                Usa este panel para verificar que MotoDoctores se adapta correctamente a todos los tamaños de pantalla.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10 overflow-auto">
        <motion.div
          animate={{ 
            width: devices[device].width, 
            height: devices[device].height,
            borderRadius: device === 'desktop' ? '0px' : '48px'
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className={cn(
            "bg-[#020617] relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden border-white/10",
            device !== 'desktop' && "border-8"
          )}
        >
          {/* Device Notch for Mobile */}
          {device === 'iphone' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-[10003]"></div>
          )}

          <div className="w-full h-full overflow-auto scrollbar-hide">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
