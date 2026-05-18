import { NextRequest, NextResponse } from 'next/server';
import { requerirAdmin } from '@/lib/admin-auth';
import { esquemaHotelAdmin, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { mapHotelDb } from '@/lib/mappers';

export async function GET() {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const { data, error } = await auth.supabase
      .from('hoteles')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw new Error(error.message);

    const hoteles = (data ?? []).map(mapHotelDb);

    const res = NextResponse.json(hoteles);
    res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener hoteles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;
    const body = esquemaHotelAdmin.parse(await request.json());

    const { data, error } = await auth.supabase
      .from('hoteles')
      .insert({
        nombre: body.nombre,
        descripcion: body.descripcion,
        ciudad: body.ciudad,
        direccion: body.direccion,
        telefono_whatsapp: body.telefono_whatsapp,
        email_contacto: body.email_contacto ?? null,
        estrellas: body.estrellas,
        tipo_alojamiento: body.tipo_alojamiento,
        imagenes_urls: body.imagenes_urls,
        latitud: body.latitud ?? null,
        longitud: body.longitud ?? null,
        horario_apertura: body.horario_apertura ?? null,
        horario_cierre: body.horario_cierre ?? null,
        activo: body.activo,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidateTag('hoteles', { expire: 0 });
    revalidateTag('destinos', { expire: 0 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Error al crear hotel' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;
    const body = esquemaHotelAdmin.extend({ id: z.string().min(1) }).parse(await request.json());
    if (!body.id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { data, error } = await auth.supabase
      .from('hoteles')
      .update({
        nombre: body.nombre,
        descripcion: body.descripcion,
        ciudad: body.ciudad,
        direccion: body.direccion,
        telefono_whatsapp: body.telefono_whatsapp,
        email_contacto: body.email_contacto ?? null,
        estrellas: body.estrellas,
        tipo_alojamiento: body.tipo_alojamiento,
        imagenes_urls: body.imagenes_urls,
        latitud: body.latitud ?? null,
        longitud: body.longitud ?? null,
        horario_apertura: body.horario_apertura ?? null,
        horario_cierre: body.horario_cierre ?? null,
        activo: body.activo,
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidateTag('hoteles', { expire: 0 });
    revalidateTag('destinos', { expire: 0 });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar hotel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await auth.supabase.from('hoteles').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidateTag('hoteles', { expire: 0 });
    revalidateTag('habitaciones', { expire: 0 });
    revalidateTag('destinos', { expire: 0 });
    return NextResponse.json({ message: 'Hotel eliminado' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar hotel' }, { status: 500 });
  }
}
