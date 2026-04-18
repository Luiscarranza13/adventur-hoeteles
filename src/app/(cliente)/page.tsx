import { Header, Footer } from '@/components/Header';
import { Card } from '@/components/Card';
import { ImagenSegura } from '@/components/ImagenSegura';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles/infraestructura/adaptadores/AdaptadorSupabaseHotel';
import Link from 'next/link';

async function getHoteles() {
  try {
    return await new AdaptadorSupabaseHotel().listarActivos();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const hoteles = await getHoteles();
  const ciudades = [...new Set(hoteles.map(h => h.ciudad))];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[#001f3f] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Encuentra tu próximo destino
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Reserva directamente por WhatsApp con el hotel
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#001f3f] mb-8 text-center">Destinos Populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ciudades.map(ciudad => (
                <Link key={ciudad} href={`/hoteles?ciudad=${encodeURIComponent(ciudad)}`}>
                  <Card className="h-full text-center py-12">
                    <h3 className="text-2xl font-bold text-[#001f3f]">{ciudad}</h3>
                    <p className="text-gray-500 mt-2">
                      {hoteles.filter(h => h.ciudad === ciudad).length} hoteles disponibles
                    </p>
                  </Card>
                </Link>
              ))}
              {ciudades.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No hay destinos disponibles aún
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#001f3f] mb-8 text-center">Todos los Hoteles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hoteles.map(hotel => (
                <Link key={hotel.id} href={`/hoteles/${hotel.id}`}>
                  <Card className="h-full">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                      <ImagenSegura src={hotel.imagenesUrls[0] ?? ''} alt={hotel.nombre} fill className="object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-[#001f3f]">{hotel.nombre}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{hotel.descripcion}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">{hotel.ciudad}</span>
                      <div className="flex text-[#ffd600]">{'★'.repeat(hotel.estrellas)}</div>
                    </div>
                  </Card>
                </Link>
              ))}
              {hoteles.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No hay hoteles disponibles aún
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
