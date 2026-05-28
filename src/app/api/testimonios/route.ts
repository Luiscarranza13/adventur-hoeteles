import { NextResponse } from 'next/server';
import { createReadonlyClient } from '@/lib/supabase/readonly';
import { unstable_cache } from 'next/cache';

const obtenerTestimonios = unstable_cache(
  async () => {
    try {
      const supabase = createReadonlyClient();
      const { data, error } = await supabase
        .from('testimonios_home')
        .select('id,nombre,origen,cargo,calificacion,texto,color,orden')
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },
  ['testimonios-home'],
  { revalidate: 300, tags: ['testimonios'] }
);

export async function GET() {
  const data = await obtenerTestimonios();
  const res = NextResponse.json(data);
  res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  return res;
}
