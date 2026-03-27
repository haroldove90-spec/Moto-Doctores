import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TriageResult {
  severity: 'Verde' | 'Amarillo' | 'Rojo';
  recommendations: string[];
  summary: string;
  isEmergency: boolean;
}

export const analyzeSymptoms = async (messages: { role: 'user' | 'model', text: string }[]): Promise<TriageResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Eres un asistente de triaje médico para la plataforma MotoDoctores. 
  Tu objetivo es analizar los síntomas del paciente y determinar la gravedad.
  
  ESCALA DE TRIAJE:
  - Verde: Casos no urgentes (ej. resfriado común, dolor leve).
  - Amarillo: Urgencia relativa (ej. fiebre alta persistente, dolor moderado).
  - Rojo: Urgencia vital (ej. dificultad para respirar, dolor opresivo en el pecho, pérdida de conciencia).
  
  INSTRUCCIONES:
  1. Analiza la gravedad.
  2. Recomienda datos que el paciente debe tener listos para el médico (ej. temperatura, presión arterial, oxigenación).
  3. Si es Rojo, indica claramente que es una emergencia.
  4. Mantén un tono profesional, empático y calmado.
  
  RESPUESTA: Debes responder SIEMPRE en formato JSON válido.`;

  const response = await ai.models.generateContent({
    model,
    contents: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, enum: ['Verde', 'Amarillo', 'Rojo'] },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          isEmergency: { type: Type.BOOLEAN }
        },
        required: ['severity', 'recommendations', 'summary', 'isEmergency']
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const scanPrescription = async (base64Image: string): Promise<{ drugName: string, dosage: string, instructions: string }[]> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = "Analiza esta imagen de una receta médica o caja de medicina. Extrae el nombre del fármaco, la dosis y las instrucciones de uso. Responde en formato JSON.";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            drugName: { type: Type.STRING },
            dosage: { type: Type.STRING },
            instructions: { type: Type.STRING }
          },
          required: ['drugName', 'dosage', 'instructions']
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};
