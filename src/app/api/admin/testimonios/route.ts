import { NextRequest, NextResponse } from 'next/server';
import { requerirAdmin } from '@/lib/admin-auth';
import { esquemaTestimonioAdmin, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const { data, error } = await auth.supabase
      .from('testimonios_home')
      .select('*')
      .order('orden', { ascending: true });

    if (error) throw new Error(error.message);

    const res = NextResponse.json(data ?? []);
    res.headers.set('Cache-Control', 'private, max-age=30');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener testimonios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const body = esquemaTestimonioAdmin.parse(await request.json());

    const { data, error } = await auth.supabase
      .from('testimonios_home')
      .insert({
        nombre: body.nombre,
        origen: body.origen,
        cargo: body.cargo,
        calificacion: body.calificacion,
        texto: body.texto,
        color: body.color,
        orden: body.orden,
        activo: body.activo,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidateTag('testimonios', { expire: 0 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Error al crear testimonio' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const body = esquemaTestimonioAdmin.extend({ id: z.string().min(1) }).parse(await request.json());

    const { data, error } = await auth.supabase
      .from('testimonios_home')
      .update({
        nombre: body.nombre,
        origen: body.origen,
        cargo: body.cargo,
        calificacion: body.calificacion,
        texto: body.texto,
        color: body.color,
        orden: body.orden,
        activo: body.activo,
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidateTag('testimonios', { expire: 0 });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar testimonio' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarContenido');
    if (!auth.autorizado) return auth.respuesta;

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await auth.supabase.from('testimonios_home').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidateTag('testimonios', { expire: 0 });
    return NextResponse.json({ message: 'Testimonio eliminado' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar testimonio' }, { status: 500 });
  }
}
