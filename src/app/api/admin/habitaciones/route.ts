import { NextRequest, NextResponse } from 'next/server';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { requerirAdmin } from '@/lib/admin-auth';
import { esquemaHabitacionAdmin, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { mapHabitacionDb } from '@/lib/mappers';

const servicio = () => new ServicioHabitaciones(new AdaptadorSupabaseHabitacion());

export async function GET() {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const { data, error } = await auth.supabase
      .from('habitaciones')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw new Error(error.message);

    const habitaciones = (data ?? []).map(mapHabitacionDb);

    const res = NextResponse.json(habitaciones);
    res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener habitaciones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;
    const body = esquemaHabitacionAdmin.parse(await request.json());

    const { data, error } = await auth.supabase
      .from('habitaciones')
      .insert({
        hotel_id: body.hotel_id,
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        numero_habitacion: body.numero_habitacion ?? null,
        tipo_habitacion: body.tipo_habitacion,
        tipo_cama: body.tipo_cama ?? null,
        regimen_alimentacion: body.regimen_alimentacion ?? null,
        capacidad_personas: body.capacidad_personas,
        cantidad_camas: body.cantidad_camas,
        precio_noche: body.precio_noche,
        moneda: body.moneda,
        amenidades: body.amenidades,
        imagenes_urls: body.imagenes_urls,
        esta_disponible: body.esta_disponible,
        estado_mantenimiento: body.estado_mantenimiento,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidateTag('habitaciones', { expire: 0 });
    revalidateTag('hoteles', { expire: 0 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Error al crear habitación' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;
    const body = esquemaHabitacionAdmin.extend({ id: z.string().min(1) }).parse(await request.json());
    if (!body.id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    // Usar el cliente autenticado del admin directamente para evitar problemas de RLS
    const { data, error } = await auth.supabase
      .from('habitaciones')
      .update({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        numero_habitacion: body.numero_habitacion ?? null,
        tipo_habitacion: body.tipo_habitacion,
        tipo_cama: body.tipo_cama ?? null,
        regimen_alimentacion: body.regimen_alimentacion ?? null,
        capacidad_personas: body.capacidad_personas,
        cantidad_camas: body.cantidad_camas,
        precio_noche: body.precio_noche,
        moneda: body.moneda,
        amenidades: body.amenidades,
        imagenes_urls: body.imagenes_urls,
        esta_disponible: body.esta_disponible,
        estado_mantenimiento: body.estado_mantenimiento,
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidateTag('habitaciones', { expire: 0 });
    revalidateTag('hoteles', { expire: 0 });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar habitación' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    await servicio().eliminar(id);
    revalidateTag('habitaciones', { expire: 0 });
    revalidateTag('hoteles', { expire: 0 });
    return NextResponse.json({ message: 'Habitación eliminada' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar habitación' }, { status: 500 });
  }
}
