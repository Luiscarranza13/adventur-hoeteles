import { Header, Footer } from '@/components/Header';
import { Card } from '@/components/Card';
import { ImagenSegura } from '@/components/ImagenSegura';
import { AdaptadorSupabaseHotel } from '@/modules/hoteles/infraestructura/adaptadores/AdaptadorSupabaseHotel';
import Link from 'next/link';

async function getHoteles(ciudad?: string) {
  try {
    const repositorio = new AdaptadorSupabaseHotel();
    if (ciudad) return await repositorio.buscarPorCiudad(ciudad);
    return await repositorio.listarActivos();
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ ciudad?: string }>;
}

export default async function HotelesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hoteles = await getHoteles(params.ciudad);

  return (
    <>
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-[#001f3f] hover:underline">← Volver al inicio</Link>
            <h1 className="text-3xl font-bold text-[#001f3f] mt-4">
              {params.ciudad ? `Hoteles en ${params.ciudad}` : 'Todos los Hoteles'}
            </h1>
          </div>

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
              <p className="col-span-full text-center text-gray-500 py-8">No se encontraron hoteles</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
