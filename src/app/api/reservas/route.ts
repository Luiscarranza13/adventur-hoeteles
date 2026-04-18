import { NextRequest, NextResponse } from 'next/server';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { habitacionId, nombreCliente, telefonoContacto, fechaIngreso, fechaSalida } = body;

    if (!habitacionId || !nombreCliente || !telefonoContacto || !fechaIngreso || !fechaSalida) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const servicio = new ServicioReservasWhatsApp(
      new AdaptadorSupabaseReserva(),
      new AdaptadorSupabaseHabitacion(),
      new AdaptadorSupabaseHotel()
    );

    const resultado = await servicio.procesarSolicitud({
      habitacionId,
      nombreCliente,
      telefonoContacto,
      fechaIngreso: new Date(fechaIngreso),
      fechaSalida: new Date(fechaSalida),
    });

    return NextResponse.json({ reserva: resultado.reserva, urlWhatsApp: resultado.urlWhatsApp });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
