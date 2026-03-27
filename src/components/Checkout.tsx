import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ShieldCheck, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';

interface CheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export default function Checkout({ amount, onSuccess, onCancel }: CheckoutProps) {
  const [status, setStatus] = React.useState<PaymentStatus>('idle');

  const handlePayment = async () => {
    setStatus('processing');
    // Simulación de procesamiento de pago
    setTimeout(() => {
      // 90% de éxito para la demo
      if (Math.random() > 0.1) {
        setStatus('success');
        setTimeout(onSuccess, 2000);
      } else {
        setStatus('error');
      }
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-motodoctores-background/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="w-full max-w-md bg-motodoctores-background rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-motodoctores-text">Finalizar Pago</h3>
            <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-motodoctores-text/40" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-motodoctores-accent/10 p-6 rounded-3xl border border-motodoctores-accent/20 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-motodoctores-accent/60 font-medium">Total a pagar</p>
                    <p className="text-3xl font-bold text-motodoctores-accent">${amount.toFixed(2)}</p>
                  </div>
                  <CreditCard className="w-10 h-10 text-motodoctores-accent/20" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 bg-motodoctores-background rounded-xl flex items-center justify-center border border-white/10">
                      <CreditCard className="w-5 h-5 text-motodoctores-text/40" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-motodoctores-text/80">•••• •••• •••• 4242</p>
                      <p className="text-xs text-motodoctores-text/40">Visa - Expira 12/26</p>
                    </div>
                    <button className="text-xs font-bold text-motodoctores-accent">Cambiar</button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-motodoctores-text/40 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pago seguro encriptado por MotoDoctores</span>
                </div>

                <button 
                  onClick={handlePayment}
                  className="w-full cyber-button h-16 text-lg flex items-center justify-center gap-2 rounded-2xl"
                >
                  Pagar Ahora
                </button>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center space-y-4"
              >
                <Loader2 className="w-12 h-12 text-motodoctores-accent animate-spin" />
                <p className="text-lg font-bold text-motodoctores-text">Procesando pago...</p>
                <p className="text-sm text-motodoctores-text/40">No cierres esta ventana</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                <h4 className="text-2xl font-bold text-motodoctores-text">¡Pago Exitoso!</h4>
                <p className="text-motodoctores-text/60">Tu MotoDoctor ha sido confirmado y está en camino.</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
              >
                <div className="w-20 h-20 bg-motodoctores-alert/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-motodoctores-alert" />
                </div>
                <h4 className="text-2xl font-bold text-motodoctores-text">Error en el Pago</h4>
                <p className="text-motodoctores-text/60">Hubo un problema con tu tarjeta. Por favor intenta de nuevo.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-2 bg-white/5 text-motodoctores-text font-bold rounded-xl border border-white/10"
                >
                  Reintentar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
