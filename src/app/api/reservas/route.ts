import { NextRequest, NextResponse } from 'next/server';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { esquemaReservaPublica, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = esquemaReservaPublica.parse(await request.json());

    const servicio = new ServicioReservasWhatsApp(
      new AdaptadorSupabaseReserva(),
      new AdaptadorSupabaseHabitacion(),
      new AdaptadorSupabaseHotel()
    );

    const resultado = await servicio.procesarSolicitud({
      habitacionId: body.habitacionId,
      nombreCliente: body.nombreCliente,
      telefonoContacto: body.telefonoContacto,
      fechaIngreso: body.fechaIngreso,
      fechaSalida: body.fechaSalida,
    });

    return NextResponse.json({ reserva: resultado.reserva, urlWhatsApp: resultado.urlWhatsApp });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
