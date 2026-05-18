/**
 * Endpoint combinado que devuelve hoteles + habitaciones en una sola request,
 * con datos mapeados a camelCase para que el frontend los consuma directamente.
 */
import { NextResponse } from 'next/server';
import { requerirAdmin } from '@/lib/admin-auth';
import { mapHabitacionDb, mapHotelDb } from '@/lib/mappers';

export async function GET() {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const [hotelesRes, habitacionesRes] = await Promise.all([
      auth.supabase.from('hoteles').select('*').order('fecha_creacion', { ascending: false }),
      auth.supabase.from('habitaciones').select('*').order('fecha_creacion', { ascending: false }),
    ]);

    if (hotelesRes.error) throw hotelesRes.error;
    if (habitacionesRes.error) throw habitacionesRes.error;

    const res = NextResponse.json({
      hoteles: (hotelesRes.data ?? []).map(mapHotelDb),
      habitaciones: (habitacionesRes.data ?? []).map(mapHabitacionDb),
    });
    res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
