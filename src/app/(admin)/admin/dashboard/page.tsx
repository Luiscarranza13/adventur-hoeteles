import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { ServicioReservasWhatsApp, AdaptadorSupabaseReserva } from '@/modules/reservas_whatsapp';
import { Card } from '@/components/Card';

async function getResumen() {
  try {
    const servicioHoteles = new ServicioHoteles(new AdaptadorSupabaseHotel());
    const servicioHabitaciones = new ServicioHabitaciones(new AdaptadorSupabaseHabitacion());
    const servicioReservas = new ServicioReservasWhatsApp(
      new AdaptadorSupabaseReserva(),
      new AdaptadorSupabaseHabitacion(),
      new AdaptadorSupabaseHotel()
    );

    const [hoteles, habitaciones, reservas] = await Promise.all([
      servicioHoteles.listarTodos(),
      servicioHabitaciones.listarTodas(),
      servicioReservas.listar(),
    ]);

    return {
      totalHoteles: hoteles.length,
      totalHabitaciones: habitaciones.length,
      totalReservas: reservas.length,
      reservasPendientes: reservas.filter(r => r.estado === 'contacto_whatsapp').length,
      reservasConfirmadas: reservas.filter(r => r.estado === 'confirmada').length,
    };
  } catch {
    return { totalHoteles: 0, totalHabitaciones: 0, totalReservas: 0, reservasPendientes: 0, reservasConfirmadas: 0 };
  }
}

export default async function DashboardPage() {
  const resumen = await getResumen();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#001f3f] mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card><p className="text-sm text-gray-500">Hoteles</p><p className="text-3xl font-bold text-[#001f3f]">{resumen.totalHoteles}</p></Card>
        <Card><p className="text-sm text-gray-500">Habitaciones</p><p className="text-3xl font-bold text-[#001f3f]">{resumen.totalHabitaciones}</p></Card>
        <Card><p className="text-sm text-gray-500">Total Reservas</p><p className="text-3xl font-bold text-[#001f3f]">{resumen.totalReservas}</p></Card>
        <Card><p className="text-sm text-gray-500">Pendientes</p><p className="text-3xl font-bold text-yellow-500">{resumen.reservasPendientes}</p></Card>
        <Card><p className="text-sm text-gray-500">Confirmadas</p><p className="text-3xl font-bold text-green-600">{resumen.reservasConfirmadas}</p></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-[#001f3f] mb-2">Gestionar Hoteles</h3>
          <p className="text-gray-500 text-sm mb-4">Configura hoteles y números de WhatsApp</p>
          <a href="/admin/hoteles" className="bg-[#ffd600] text-[#001f3f] font-semibold px-6 py-3 rounded-lg inline-block hover:opacity-90">Ver Hoteles</a>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-[#001f3f] mb-2">Leads / Reservas</h3>
          <p className="text-gray-500 text-sm mb-4">Solicitudes recibidas por WhatsApp</p>
          <a href="/admin/reservas" className="bg-[#ffd600] text-[#001f3f] font-semibold px-6 py-3 rounded-lg inline-block hover:opacity-90">Ver Reservas</a>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-[#001f3f] mb-2">Habitaciones</h3>
          <p className="text-gray-500 text-sm mb-4">Administra el catálogo de habitaciones</p>
          <a href="/admin/habitaciones" className="bg-[#ffd600] text-[#001f3f] font-semibold px-6 py-3 rounded-lg inline-block hover:opacity-90">Ver Habitaciones</a>
        </Card>
      </div>
    </div>
  );
}
