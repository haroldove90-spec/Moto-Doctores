import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Servicio para insertar datos de prueba dinámicamente
 */
export const seedService = {
  /**
   * Simula una nueva transacción exitosa para las gráficas
   */
  async simulateTransaction(amount: number = 1500) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: 'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31',
          status: 'finalizado',
          total_price: amount,
          diagnosis: 'Consulta de seguimiento (Simulada)',
          address: 'Ubicación de Prueba',
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) console.error('Error al simular transacción:', error);
    return data;
  },

  /**
   * Actualiza la posición de un médico para probar el Realtime
   */
  async updateDoctorLocation(doctorId: string, lat: number, lng: number) {
    const { error } = await supabase
      .from('locations')
      .update({ latitude: lat, longitude: lng, updated_at: new Date().toISOString() })
      .eq('profile_id', doctorId);
    
    if (error) console.error('Error al actualizar ubicación:', error);
  }
};
