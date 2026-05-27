import { NextRequest, NextResponse } from 'next/server';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { esquemaReservaPublica, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { CONFIGURACION_DEFAULT, normalizarConfiguracion } from '@/lib/configuracion';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

async function obtenerNumeroWhatsAppReservas() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('configuracion')
      .select('whatsapp_numero')
      .eq('id', 'global')
      .maybeSingle();

    if (error) {
      console.error('[reservas:configuracion]', error);
      return CONFIGURACION_DEFAULT.whatsapp_numero;
    }

    return normalizarConfiguracion(data).whatsapp_numero;
  } catch (error) {
    console.error('[reservas:configuracion]', error);
    return CONFIGURACION_DEFAULT.whatsapp_numero;
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const { allowed, remaining, resetAt } = checkRateLimit(
    `reservas:${ip}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  );

  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  try {
    const body = esquemaReservaPublica.parse(await request.json());
    const numeroWhatsAppReservas = await obtenerNumeroWhatsAppReservas();

    const servicio = new ServicioReservasWhatsApp(
      new AdaptadorSupabaseReserva(),
      new AdaptadorSupabaseHabitacion(),
      new AdaptadorSupabaseHotel(),
      { numeroWhatsAppReservas }
    );

    const resultado = await servicio.procesarSolicitud({
      habitacionId: body.habitacionId,
      nombreCliente: body.nombreCliente,
      telefonoContacto: body.telefonoContacto,
      fechaIngreso: body.fechaIngreso,
      fechaSalida: body.fechaSalida,
    });

    return NextResponse.json(
      { reserva: resultado.reserva, urlWhatsApp: resultado.urlWhatsApp },
      {
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(remaining),
        },
      },
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
