import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Plus,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scanPrescription } from '../services/aiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ScannedDrug {
  drugName: string;
  dosage: string;
  instructions: string;
}

export const PrescriptionScanner: React.FC<{ onComplete: (drugs: ScannedDrug[]) => void, onClose: () => void }> = ({ onComplete, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScannedDrug[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    
    setIsScanning(true);
    setError(null);
    
    try {
      const base64Data = image.split(',')[1];
      const drugs = await scanPrescription(base64Data);
      setResults(drugs);
    } catch (err) {
      console.error('Scan error:', err);
      setError('No se pudo analizar la imagen. Asegúrate de que el texto sea legible.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    onComplete(results);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Escáner de Recetas</h2>
              <p className="text-xs text-slate-500">IA Vision de MotoDoctores</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700">Sube una foto de tu receta</p>
                <p className="text-xs text-slate-500">O de la caja de tu medicamento</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img src={image} alt="Prescription" className="w-full h-full object-contain" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {results.length === 0 && !isScanning && (
                <button 
                  onClick={handleScan}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  <Activity className="w-5 h-5" />
                  Analizar con IA
                </button>
              )}

              {isScanning && (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  <p className="text-sm font-medium text-slate-600">Extrayendo información médica...</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {results.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Medicamentos Detectados
                  </h3>
                  <div className="space-y-3">
                    {results.map((drug, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-medical-blue">{drug.drugName}</p>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Detectado</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-slate-500 mb-1">Dosis</p>
                            <p className="font-medium text-slate-700">{drug.dosage}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Instrucciones</p>
                            <p className="font-medium text-slate-700">{drug.instructions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button 
              onClick={() => { setImage(null); setResults([]); }}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-white transition-all"
            >
              Escanear Otra
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar Datos
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
