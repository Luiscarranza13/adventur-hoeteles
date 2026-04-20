import { Header, Footer } from '@/components/Header';
import { ImagenSegura } from '@/components/ImagenSegura';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, ArrowLeft, BedDouble,
  Users, MessageCircle, ArrowRight, CheckCircle2
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaDetalleHotel({ params }: PageProps) {
  const { id } = await params;

  const hotel = await new ServicioHoteles(new AdaptadorSupabaseHotel()).buscarPorId(id);
  if (!hotel) notFound();

  const habitaciones = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorHotel(id);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative bg-[#001f3f] min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImagenSegura
            src={hotel.imagenesUrls[0] ?? ''}
            alt={hotel.nombre}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f] via-[#001f3f]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 pt-24 w-full">
          <Link href="/hoteles" className="inline-flex items-center gap-1.5 text-gray-400 text-sm hover:text-[#ffd600] transition-colors mb-5">
            <ArrowLeft size={14} /> Todos los hoteles
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-[#ffd600]" />
                <p className="text-[#ffd600] text-xs font-bold uppercase tracking-wider">
                  {hotel.ciudad} · {hotel.direccion}
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{hotel.nombre}</h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.estrellas }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#ffd600] fill-[#ffd600]" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{hotel.estrellas} estrellas</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-center">
              <p className="text-gray-300 text-xs mb-1 flex items-center justify-center gap-1">
                <BedDouble size={12} /> Habitaciones disponibles
              </p>
              <p className="text-3xl font-extrabold text-[#ffd600]">{habitaciones.length}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white">

        {/* Info */}
        <section className="max-w-7xl mx-auto px-6 py-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#001f3f] mb-3">Sobre el hotel</h2>
              <p className="text-gray-600 text-base leading-relaxed">{hotel.descripcion}</p>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-64">
              {[
                { Icon: MapPin,         label: 'Ciudad',        valor: hotel.ciudad },
                { Icon: Star,           label: 'Categoría',     valor: `${hotel.estrellas} estrellas` },
                { Icon: BedDouble,      label: 'Habitaciones',  valor: `${habitaciones.length} disponibles` },
                { Icon: MessageCircle,  label: 'Reserva',       valor: 'Por WhatsApp' },
              ].map(({ Icon, label, valor }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <Icon size={16} className="text-[#ffd600] mx-auto mb-1" />
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-xs font-bold text-[#001f3f] mt-0.5">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Habitaciones */}
        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">Alojamiento</span>
              <h2 className="text-2xl font-extrabold text-[#001f3f] mt-1">Habitaciones Disponibles</h2>
            </div>
            <span className="bg-[#001f3f] text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              {habitaciones.length} {habitaciones.length === 1 ? 'opción' : 'opciones'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitaciones.map(hab => (
              <article key={hab.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className="relative h-52 bg-[#001f3f] overflow-hidden flex-shrink-0">
                  <ImagenSegura
                    src={hab.imagenesUrls[0] ?? ''}
                    alt={hab.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#001f3f] mb-1">{hab.nombre}</h3>
                  {hab.descripcion && (
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3 flex-1">{hab.descripcion}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Users size={12} /> {hab.capacidadPersonas} personas</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Disponible</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-extrabold text-[#001f3f]">${hab.precioNoche}</span>
                      <span className="text-gray-400 text-xs"> /noche</span>
                    </div>
                    <Link
                      href={`/checkout/${hab.id}`}
                      className="flex items-center gap-1.5 bg-[#ffd600] text-[#001f3f] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all shadow-sm shadow-[#ffd600]/30"
                    >
                      <MessageCircle size={13} /> Reservar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            {habitaciones.length === 0 && (
              <div className="col-span-full text-center py-20">
                <BedDouble size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No hay habitaciones disponibles</p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
