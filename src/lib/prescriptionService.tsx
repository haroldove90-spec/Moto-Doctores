import { pdf } from '@react-pdf/renderer';
import { supabase } from './supabase';
import { PrescriptionPDF } from '../components/PrescriptionPDF';
import React from 'react';

interface PrescriptionData {
  patientName: string;
  patientAge: string;
  diagnosis: string;
  treatment: string;
  doctorName: string;
  doctorLicense: string;
  date: string;
  qrCodeUrl?: string;
}

export async function generateAndUploadPrescription(
  appointmentId: string,
  data: PrescriptionData
) {
  try {
    // 1. Generar el PDF como Blob
    const blob = await pdf(<PrescriptionPDF data={data} />).toBlob();
    
    // 2. Definir el nombre del archivo
    const fileName = `prescriptions/${appointmentId}_${Date.now()}.pdf`;
    
    // 3. Subir a Supabase Storage (Bucket 'prescriptions')
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('prescriptions')
      .upload(fileName, blob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 4. Obtener la URL pública (o firmada si es privado)
    const { data: { publicUrl } } = supabase
      .storage
      .from('prescriptions')
      .getPublicUrl(fileName);

    // 5. Actualizar la tabla appointments con la URL de la receta
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ prescription_url: publicUrl })
      .eq('id', appointmentId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error in generateAndUploadPrescription:', error);
    throw error;
  }
}
