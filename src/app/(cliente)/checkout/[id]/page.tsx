import { Header, Footer } from '@/components/Header';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { FormularioReservaWhatsApp } from '@/components/FormularioReservaWhatsApp';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield, Zap, BadgeDollarSign, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaCheckout({ params }: PageProps) {
  const { id } = await params;

  const habitacion = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorId(id);
  if (!habitacion) notFound();

  const hotel = await new ServicioHoteles(new AdaptadorSupabaseHotel()).buscarPorId(habitacion.hotelId);
  if (!hotel) notFound();

  return (
    <>
      <Header />

      {/* Banner */}
      <div className="bg-[#001f3f] py-14 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd600]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">Reserva</span>
          <h1 className="text-3xl font-extrabold text-white mt-1 mb-1">Solicitar por WhatsApp</h1>
          <p className="text-gray-400 text-sm">Completa el formulario y te redirigimos a recepción</p>
        </div>
      </div>

      <main className="bg-gray-50 py-12 px-6 min-h-screen">
        <div className="max-w-lg mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
            <Link href="/hoteles" className="hover:text-[#001f3f] transition-colors">Hoteles</Link>
            <ChevronRight size={12} />
            <Link href={`/hoteles/${hotel.id}`} className="hover:text-[#001f3f] transition-colors truncate max-w-[120px]">{hotel.nombre}</Link>
            <ChevronRight size={12} />
            <span className="text-[#001f3f] font-semibold">Reservar</span>
          </nav>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <FormularioReservaWhatsApp
              habitacion={{
                id: habitacion.id,
                nombre: habitacion.nombre,
                precioNoche: habitacion.precioNoche,
                hotelNombre: hotel.nombre,
              }}
            />
          </div>

          {/* Garantías */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { Icon: Shield,          label: 'Reserva segura' },
              { Icon: Zap,             label: 'Respuesta rápida' },
              { Icon: BadgeDollarSign, label: 'Sin comisiones' },
            ].map(({ Icon, label }) => (
              <div key={label} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                <Icon size={18} className="text-[#001f3f] mx-auto mb-1" />
                <p className="text-xs text-gray-500 font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
