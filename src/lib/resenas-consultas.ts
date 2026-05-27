import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_cache } from 'next/cache';

export interface Resena {
  id: string;
  hotel_id: string;
  nombre_revisor: string;
  origen: string | null;
  calificacion: number;
  comentario: string;
  fecha: string;
  fuente: string;
  avatar_url: string | null;
}

export const obtenerResenasPorHotel = unstable_cache(
  async (hotelId: string): Promise<Resena[]> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('resenas')
        .select('id,hotel_id,nombre_revisor,origen,calificacion,comentario,fecha,fuente,avatar_url')
        .eq('hotel_id', hotelId)
        .eq('verificada', true)
        .order('fecha', { ascending: false })
        .limit(20);

      if (error || !data) return [];
      return data as Resena[];
    } catch (err) {
      console.error('[supabase] obtenerResenasPorHotel falló:', err);
      return [];
    }
  },
  ['resenas-por-hotel'],
  { revalidate: 3600, tags: ['resenas'] }
);

export function promedioCalificacion(resenas: Resena[]): number {
  if (!resenas.length) return 0;
  return resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length;
}
