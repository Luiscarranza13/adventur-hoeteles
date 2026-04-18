import { Header, Footer } from '@/components/Header';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones/infraestructura/adaptadores/AdaptadorSupabaseHabitacion';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles/infraestructura/adaptadores/AdaptadorSupabaseHotel';
import { FormularioReservaWhatsApp } from '@/components/FormularioReservaWhatsApp';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { id } = await params;

  const habitacion = await new AdaptadorSupabaseHabitacion().buscarPorId(id);
  if (!habitacion) notFound();

  const hotel = await new AdaptadorSupabaseHotel().buscarPorId(habitacion.hotelId);
  if (!hotel) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#001f3f] mb-2 text-center">
            Solicitar Reserva por WhatsApp
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Completa el formulario y serás redirigido a WhatsApp para confirmar con el hotel
          </p>

          <FormularioReservaWhatsApp
            habitacion={{
              id: habitacion.id,
              nombre: habitacion.nombre,
              precioNoche: habitacion.precioNoche,
              hotelNombre: hotel.nombre,
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
