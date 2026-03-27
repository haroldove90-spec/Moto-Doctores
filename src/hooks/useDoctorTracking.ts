import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

interface Location {
  latitude: number;
  longitude: number;
  updated_at: string;
}

export function useDoctorTracking(doctorId: string | undefined) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;

    // 1. Obtener ubicación inicial
    const fetchInitialLocation = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('latitude, longitude, updated_at')
        .eq('profile_id', doctorId)
        .single();

      if (error) {
        console.error('Error fetching initial location:', error);
      } else if (data) {
        setLocation(data);
      }
      setLoading(false);
    };

    fetchInitialLocation();

    // 2. Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel(`doctor-location-${doctorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'locations',
          filter: `profile_id=eq.${doctorId}`,
        },
        (payload) => {
          console.log('Realtime update received:', payload.new);
          setLocation(payload.new as Location);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId]);

  return { location, error, loading };
}
