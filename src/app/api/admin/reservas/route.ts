import { NextRequest, NextResponse } from 'next/server';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { requerirAdmin } from '@/lib/admin-auth';
import { esquemaReservaAdmin, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { z } from 'zod';

const servicio = () => new ServicioReservasWhatsApp(
  new AdaptadorSupabaseReserva(),
  new AdaptadorSupabaseHabitacion(),
  new AdaptadorSupabaseHotel()
);

function escaparCsv(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function reservasCsv(rows: Record<string, unknown>[]) {
  const headers = [
    'id',
    'nombre_cliente',
    'telefono_contacto',
    'estado',
    'fecha_ingreso',
    'fecha_salida',
    'fecha_solicitud',
    'precio_total',
    'metodo_pago',
  ];
  return [
    headers.join(','),
    ...rows.map(row => headers.map(header => escaparCsv(row[header])).join(',')),
  ].join('\n');
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarReservas');
    if (!auth.autorizado) return auth.respuesta;
    const formato = new URL(request.url).searchParams.get('format');

    // Usar auth.supabase directamente para evitar instanciar adaptadores con browser client
    const { data, error } = await auth.supabase
      .from('reservas_whatsapp')
      .select('*')
      .order('fecha_solicitud', { ascending: false });

    if (error) throw new Error(error.message);
    if (formato === 'csv') {
      return new NextResponse(reservasCsv(data ?? []), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="reservas-adventur.csv"',
          'Cache-Control': 'private, max-age=15, stale-while-revalidate=30',
        },
      });
    }

    const res = NextResponse.json(data ?? []);
    res.headers.set('Cache-Control', 'private, max-age=15, stale-while-revalidate=30');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarReservas');
    if (!auth.autorizado) return auth.respuesta;
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const body = esquemaReservaAdmin.parse(await request.json());
    const reserva = await servicio().cambiarEstado(id, {
      estado: body.estado,
      notasCliente: body.notas_cliente,
      cantidadHuespedes: body.cantidad_huespedes,
      precioTotal: body.precio_total,
      fechaConfirmacion: body.fecha_confirmacion,
      metodoPago: body.metodo_pago,
    });
    return NextResponse.json(reserva);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
  }
}
