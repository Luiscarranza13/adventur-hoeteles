import { Header, Footer } from '@/components/layout/Header';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { FormularioReservaWhatsApp } from '@/components/cliente/FormularioReservaWhatsApp';
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
      <div className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-16 sm:pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-yellow)]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none blur-3xl" />
        <div className="relative z-10 container-site text-center lg:text-left">
          <p className="label-eyebrow mb-2">Paso Final</p>
          <h1 className="heading-hero !text-left !text-3xl sm:!text-5xl mb-2">Solicitar Reserva</h1>
          <p className="text-gray-400 text-base sm:text-lg font-medium">Confirma tus datos y te redirigimos al WhatsApp del hotel</p>
        </div>
      </div>

      <main className="bg-[var(--bg-subtle)] py-12 sm:py-20 px-6 min-h-screen">
        <div className="max-w-xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 overflow-hidden">
            <Link href="/hoteles" className="hover:text-[var(--brand-navy)] transition-colors shrink-0">Hoteles</Link>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <Link href={`/hoteles/${hotel.id}`} className="hover:text-[var(--brand-navy)] transition-colors truncate max-w-[150px] shrink-0">{hotel.nombre}</Link>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <span className="text-[var(--brand-navy)] shrink-0">Reservar</span>
          </nav>

          {/* Formulario */}
          <div className="card-premium !p-8 sm:!p-12 animate-fade-up">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="heading-card !text-2xl mb-2">{habitacion.nombre}</h2>
              <p className="body-text !text-sm">Hotel {hotel.nombre} · {hotel.ciudad}</p>
            </div>

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
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {[
              { Icon: Shield,          label: 'Reserva 100% Segura', desc: 'Sin intermediarios' },
              { Icon: Zap,             label: 'Respuesta Inmediata', desc: 'Atención directa' },
              { Icon: BadgeDollarSign, label: 'Mejor Precio',        desc: 'Sin comisiones' },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[var(--brand-navy)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={18} className="text-[var(--brand-yellow)]" />
                </div>
                <p className="text-[10px] font-black text-[var(--brand-navy)] uppercase tracking-widest mb-1 leading-tight">{label}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
