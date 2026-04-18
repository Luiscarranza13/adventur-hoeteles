import { NextRequest, NextResponse } from 'next/server';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles';

const servicio = () => new ServicioReservasWhatsApp(
  new AdaptadorSupabaseReserva(),
  new AdaptadorSupabaseHabitacion(),
  new AdaptadorSupabaseHotel()
);

export async function GET() {
  try {
    return NextResponse.json(await servicio().listar());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const body = await request.json();
    const reserva = await servicio().cambiarEstado(id, { estado: body.estado });
    return NextResponse.json(reserva);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
  }
}
