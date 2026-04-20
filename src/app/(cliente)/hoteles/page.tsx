import { Header, Footer } from '@/components/Header';
import { ImagenSegura } from '@/components/ImagenSegura';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Hotel, SlidersHorizontal } from 'lucide-react';

async function obtenerHoteles(ciudad?: string) {
  try {
    const servicio = new ServicioHoteles(new AdaptadorSupabaseHotel());
    if (ciudad) return await servicio.buscarPorCiudad(ciudad);
    return await servicio.listarActivos();
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ ciudad?: string }>;
}

export default async function PaginaHoteles({ searchParams }: PageProps) {
  const { ciudad } = await searchParams;
  const hoteles = await obtenerHoteles(ciudad);

  return (
    <>
      <Header />

      {/* Banner */}
      <div className="bg-[#001f3f] py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd600]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">Alojamientos</span>
              <h1 className="text-4xl font-extrabold text-white mt-1">
                {ciudad ? (
                  <span className="flex items-center gap-2">
                    <MapPin size={28} className="text-[#ffd600]" />
                    Hoteles en {ciudad}
                  </span>
                ) : 'Todos los Hoteles'}
              </h1>
              <p className="text-gray-400 text-sm mt-2 flex items-center gap-1.5">
                <SlidersHorizontal size={13} />
                {hoteles.length} {hoteles.length === 1 ? 'hotel disponible' : 'hoteles disponibles'}
              </p>
            </div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-[#ffd600] text-sm font-medium hover:underline self-start md:self-auto">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hoteles.map(hotel => (
              <Link key={hotel.id} href={`/hoteles/${hotel.id}`}>
                <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col cursor-pointer">
                  <div className="relative h-52 bg-[#001f3f] overflow-hidden flex-shrink-0">
                    <ImagenSegura
                      src={hotel.imagenesUrls[0] ?? ''}
                      alt={hotel.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#001f3f]/80 backdrop-blur-sm text-[#ffd600] text-xs font-bold px-2.5 py-1 rounded-lg">
                      <Star size={10} className="fill-[#ffd600]" />
                      {hotel.estrellas}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#ffd600] text-[#001f3f] text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                      Ver <ArrowRight size={10} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-1.5">
                      <MapPin size={11} className="text-[#ffd600] flex-shrink-0" />
                      <p className="text-[#ffd600] text-xs font-bold uppercase tracking-wider">{hotel.ciudad}</p>
                    </div>
                    <h3 className="text-lg font-bold text-[#001f3f] mb-2 group-hover:text-[#ffd600] transition-colors">{hotel.nombre}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">{hotel.descripcion}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate max-w-[60%]">{hotel.direccion}</span>
                      <span className="text-xs font-bold text-[#001f3f] group-hover:text-[#ffd600] transition-colors whitespace-nowrap flex items-center gap-0.5">
                        Ver habitaciones <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
            {hoteles.length === 0 && (
              <div className="col-span-full text-center py-24">
                <Hotel size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">No se encontraron hoteles</p>
                {ciudad && <p className="text-gray-400 text-sm mt-1">en {ciudad}</p>}
                <Link href="/hoteles" className="inline-flex items-center gap-1 mt-4 text-[#ffd600] font-semibold hover:underline text-sm">
                  Ver todos los hoteles <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
