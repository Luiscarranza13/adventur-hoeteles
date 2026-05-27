import { Header, Footer } from '@/components/layout/Header';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { FormularioReservaWhatsApp } from '@/components/cliente/FormularioReservaWhatsApp';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield, Zap, BadgeDollarSign, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
      <div className="bg-(--brand-navy) pt-24 sm:pt-32 pb-16 sm:pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] bg-size-[28px_28px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-(--brand-yellow)/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--brand-yellow)/20 to-transparent" />
        <div className="relative z-10 container-site">
          <p className="label-eyebrow mb-3">Paso Final</p>
          <h1 className="heading-hero !text-3xl sm:!text-5xl mb-3">Solicitar Reserva</h1>
          <div className="section-divider !mx-0" />
          <p className="text-gray-400 text-base sm:text-lg font-medium mt-4">
            Confirma tus datos y te redirigimos al WhatsApp del hotel
          </p>
        </div>
      </div>

      <main className="bg-(--bg-subtle) py-12 sm:py-20 px-4 sm:px-6 min-h-screen">
        <div className="max-w-xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 overflow-hidden flex-wrap">
            <Link href="/hoteles" className="hover:text-(--brand-navy) transition-colors shrink-0">Hoteles</Link>
            <ChevronRight size={12} className="text-gray-300 shrink-0" />
            <Link href={`/hoteles/${hotel.id}`} className="hover:text-(--brand-navy) transition-colors truncate max-w-35 shrink-0">{hotel.nombre}</Link>
            <ChevronRight size={12} className="text-gray-300 shrink-0" />
            <span className="text-(--brand-navy) shrink-0">Reservar</span>
          </nav>

          {/* Formulario */}
          <AnimarAlEntrar className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10">
            <div className="mb-8 pb-6 border-b border-gray-100">
              <p className="label-eyebrow mb-2 !text-left">Habitación seleccionada</p>
              <h2 className="text-xl sm:text-2xl font-black text-(--brand-navy) mb-1">{habitacion.nombre}</h2>
              <p className="text-sm text-gray-400 font-medium">Hotel {hotel.nombre} · {hotel.ciudad}</p>
            </div>

            <FormularioReservaWhatsApp
              habitacion={{
                id: habitacion.id,
                nombre: habitacion.nombre,
                precioNoche: habitacion.precioNoche,
                moneda: habitacion.moneda,
                hotelNombre: hotel.nombre,
                hotelEstrellas: hotel.estrellas,
              }}
            />
          </AnimarAlEntrar>

          {/* Garantías */}
          <AnimarAlEntrar delay={0.1} className="mt-6 grid grid-cols-3 gap-3">
            {[
              { Icon: Shield,          label: 'Reserva Segura',    desc: 'Sin intermediarios' },
              { Icon: Zap,             label: 'Respuesta Rápida',  desc: 'Menos de 5 min' },
              { Icon: BadgeDollarSign, label: 'Precio Directo',    desc: '0% comisión' },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-(--brand-yellow)/30 transition-all duration-300">
                <div className="w-10 h-10 bg-linear-to-br from-(--brand-navy) to-(--brand-navy-light) rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Icon size={17} className="text-(--brand-yellow)" />
                </div>
                <p className="text-[9px] font-black text-(--brand-navy) uppercase tracking-widest mb-0.5 leading-tight">{label}</p>
                <p className="text-[9px] text-gray-400 font-semibold">{desc}</p>
              </div>
            ))}
          </AnimarAlEntrar>
        </div>
      </main>
      <Footer />
    </>
  );
}
