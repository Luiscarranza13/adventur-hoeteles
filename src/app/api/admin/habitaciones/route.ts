import { NextRequest, NextResponse } from 'next/server';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';

const servicio = () => new ServicioHabitaciones(new AdaptadorSupabaseHabitacion());

export async function GET() {
  try {
    return NextResponse.json(await servicio().listarTodas());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener habitaciones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const habitacion = await servicio().crear({
      hotelId: body.hotel_id,
      nombre: body.nombre,
      descripcion: body.descripcion,
      capacidadPersonas: body.capacidad_personas,
      precioNoche: body.precio_noche,
    });
    return NextResponse.json(habitacion, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al crear habitación' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const habitacion = await servicio().actualizar(body.id, {
      nombre: body.nombre,
      descripcion: body.descripcion,
      capacidadPersonas: body.capacidad_personas,
      precioNoche: body.precio_noche,
    });
    return NextResponse.json(habitacion);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar habitación' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    await servicio().eliminar(id);
    return NextResponse.json({ message: 'Habitación eliminada' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar habitación' }, { status: 500 });
  }
}
