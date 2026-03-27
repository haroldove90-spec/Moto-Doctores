import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Stethoscope,
  Info,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeSymptoms, TriageResult } from '../services/aiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  triage?: TriageResult;
}

export const TriageChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Hola, soy tu asistente de triaje de MotoDoctores. ¿Cómo te sientes hoy? Por favor, describe tus síntomas con el mayor detalle posible.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.concat(userMsg).map(m => ({ role: m.role, text: m.text }));
      const result = await analyzeSymptoms(history);
      
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: result.summary,
        triage: result
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Triage error:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo o contacta a emergencias si es necesario.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-20 right-4 left-4 md:left-auto md:right-8 md:w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-100"
    >
      {/* Header */}
      <div className="bg-medical-blue p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Triaje Inteligente</h3>
            <p className="text-[10px] text-blue-100">IA de MotoDoctores</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
              msg.role === 'user' 
                ? "bg-medical-blue text-white rounded-tr-none" 
                : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
            )}>
              {msg.text}
            </div>
            
            {msg.triage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-3 p-4 rounded-2xl border w-full",
                  msg.triage.severity === 'Rojo' ? "bg-rose-50 border-rose-200" :
                  msg.triage.severity === 'Amarillo' ? "bg-amber-50 border-amber-200" :
                  "bg-emerald-50 border-emerald-200"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={cn(
                    "w-4 h-4",
                    msg.triage.severity === 'Rojo' ? "text-rose-600" :
                    msg.triage.severity === 'Amarillo' ? "text-amber-600" :
                    "text-emerald-600"
                  )} />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Gravedad: {msg.triage.severity}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600">Prepara estos datos para el médico:</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {msg.triage.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-center gap-1 text-[10px] bg-white/50 p-1.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-3 h-3 text-medical-blue" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {msg.triage.severity === 'Rojo' && (
                  <div className="mt-3 p-2 bg-rose-600 text-white rounded-xl flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Código Rojo: Prioridad Máxima</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            MotoDoctor IA está analizando...
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[9px] text-amber-700 leading-tight">
          <strong>DISCLAIMER:</strong> Este chat es un asistente automatizado de triaje. No sustituye la valoración de un médico profesional. En caso de emergencia vital, llame inmediatamente a los servicios locales de urgencias.
        </p>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe tus síntomas..."
          className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-medical-blue outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 bg-medical-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
