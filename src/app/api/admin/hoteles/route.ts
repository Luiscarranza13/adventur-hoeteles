import { NextRequest, NextResponse } from 'next/server';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';

const servicio = () => new ServicioHoteles(new AdaptadorSupabaseHotel());

export async function GET() {
  try {
    return NextResponse.json(await servicio().listarTodos());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener hoteles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hotel = await servicio().crear({
      nombre: body.nombre,
      descripcion: body.descripcion,
      ciudad: body.ciudad,
      direccion: body.direccion,
      telefonoWhatsapp: body.telefono_whatsapp,
      estrellas: body.estrellas || 3,
    });
    return NextResponse.json(hotel, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al crear hotel' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const hotel = await servicio().actualizar(body.id, {
      nombre: body.nombre,
      descripcion: body.descripcion,
      ciudad: body.ciudad,
      direccion: body.direccion,
      telefonoWhatsapp: body.telefono_whatsapp,
      estrellas: body.estrellas,
    });
    return NextResponse.json(hotel);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar hotel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    await servicio().eliminar(id);
    return NextResponse.json({ message: 'Hotel eliminado' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar hotel' }, { status: 500 });
  }
}
