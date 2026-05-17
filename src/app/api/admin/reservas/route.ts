import { NextRequest, NextResponse } from 'next/server';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { requerirAdmin } from '@/lib/admin-auth';

const servicio = () => new ServicioReservasWhatsApp(
  new AdaptadorSupabaseReserva(),
  new AdaptadorSupabaseHabitacion(),
  new AdaptadorSupabaseHotel()
);

export async function GET() {
  try {
    const auth = await requerirAdmin();
    if (!auth.autorizado) return auth.respuesta;

    // Usar auth.supabase directamente para evitar instanciar adaptadores con browser client
    const { data, error } = await auth.supabase
      .from('reservas_whatsapp')
      .select('*')
      .order('fecha_solicitud', { ascending: false });

    if (error) throw new Error(error.message);
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
    const auth = await requerirAdmin();
    if (!auth.autorizado) return auth.respuesta;
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const body = await request.json();
    const reserva = await servicio().cambiarEstado(id, {
      estado: body.estado,
      notasCliente: body.notas_cliente,
      cantidadHuespedes: body.cantidad_huespedes,
      precioTotal: body.precio_total,
      fechaConfirmacion: body.fecha_confirmacion ? new Date(body.fecha_confirmacion) : undefined,
      metodoPago: body.metodo_pago,
    });
    return NextResponse.json(reserva);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
  }
}
