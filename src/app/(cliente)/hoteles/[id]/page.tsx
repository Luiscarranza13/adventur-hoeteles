import { Header, Footer } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ImagenSegura } from '@/components/ImagenSegura';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles/infraestructura/adaptadores/AdaptadorSupabaseHotel';
import { AdaptadorSupabaseHabitacion } from '@/modules/habitaciones/infraestructura/adaptadores/AdaptadorSupabaseHabitacion';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HotelDetallePage({ params }: PageProps) {
  const { id } = await params;

  const hotel = await new AdaptadorSupabaseHotel().buscarPorId(id);
  if (!hotel) notFound();

  const habitaciones = await new AdaptadorSupabaseHabitacion().buscarPorHotelId(id);

  return (
    <>
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/hoteles" className="text-[#001f3f] hover:underline">← Volver a hoteles</Link>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200">
              <ImagenSegura src={hotel.imagenesUrls[0] ?? ''} alt={hotel.nombre} fill className="object-cover" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-[#001f3f]">{hotel.nombre}</h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-[#ffd600]">{'★'.repeat(hotel.estrellas)}</div>
                <span className="text-gray-500">({hotel.estrellas} estrellas)</span>
              </div>
              <p className="text-gray-600 mt-4">{hotel.descripcion}</p>
              <p className="flex items-center gap-2 text-gray-600 mt-6">
                <span className="font-semibold">📍</span>
                {hotel.direccion}, {hotel.ciudad}
              </p>
            </div>
          </div>

          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[#001f3f] mb-6">Habitaciones Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habitaciones.map(habitacion => (
                <Card key={habitacion.id}>
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gray-200">
                    <ImagenSegura src={habitacion.imagenesUrls[0] ?? ''} alt={habitacion.nombre} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-[#001f3f]">{habitacion.nombre}</h3>
                  {habitacion.descripcion && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{habitacion.descripcion}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-[#001f3f]">${habitacion.precioNoche}</span>
                      <span className="text-gray-500 text-sm">/noche</span>
                    </div>
                    <span className="text-sm text-gray-500">{habitacion.capacidadPersonas} personas</span>
                  </div>
                  <Link href={`/checkout/${habitacion.id}`} className="block mt-4">
                    <Button className="w-full">Solicitar Reserva</Button>
                  </Link>
                </Card>
              ))}
              {habitaciones.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No hay habitaciones disponibles
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
