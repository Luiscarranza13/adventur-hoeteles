import { Header, Footer } from '@/components/layout/Header';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { GaleriaHotel } from '@/components/cliente/GaleriaHotel';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, ArrowLeft, BedDouble,
  Users, MessageCircle, CheckCircle2,
  Wifi, Tv, Wind, Coffee, Waves, TreePine
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

const iconosAmenidades: Record<string, React.ReactNode> = {
  'WiFi': <Wifi size={13} />,
  'TV': <Tv size={13} />,
  'Aire Acondicionado': <Wind size={13} />,
  'Minibar': <Coffee size={13} />,
  'Jacuzzi': <Waves size={13} />,
  'Balcón': <TreePine size={13} />,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const hotel = await new ServicioHoteles(new AdaptadorSupabaseHotel()).buscarPorId(id);
    if (!hotel) return { title: 'Hotel no encontrado' };

    const habitaciones = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorHotel(id);
    const precioMinimo = habitaciones.length ? Math.min(...habitaciones.map(h => h.precioNoche)) : null;

    const title = `${hotel.nombre} — Hotel ${hotel.estrellas} estrellas en ${hotel.ciudad}`;
    const description = `${hotel.descripcion} Ubicado en ${hotel.ciudad}, ${hotel.direccion}. ${habitaciones.length} habitaciones disponibles${precioMinimo ? ` desde S/${precioMinimo}` : ''}. Reserva directa por WhatsApp.`;

    return {
      title,
      description,
      keywords: [
        `hotel ${hotel.nombre}`,
        `hotel ${hotel.ciudad}`,
        `${hotel.nombre} ${hotel.ciudad}`,
        `hotel ${hotel.estrellas} estrellas ${hotel.ciudad}`,
        'reserva hotel WhatsApp',
      ],
      openGraph: {
        title,
        description,
        type: 'website',
        images: hotel.imagenesUrls.length > 0 ? [
          {
            url: hotel.imagenesUrls[0],
            width: 1200,
            height: 630,
            alt: `Hotel ${hotel.nombre} en ${hotel.ciudad}`,
          }
        ] : undefined,
      },
    };
  } catch {
    return { title: 'Hotel no encontrado' };
  }
}

export default async function PaginaDetalleHotel({ params }: PageProps) {
  const { id } = await params;

  const hotel = await new ServicioHoteles(new AdaptadorSupabaseHotel()).buscarPorId(id);
  if (!hotel) notFound();

  const habitaciones = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorHotel(id);
  const precioMinimo = habitaciones.length ? Math.min(...habitaciones.map(h => h.precioNoche)) : null;
  const monedaMinimo = habitaciones.find(h => h.precioNoche === precioMinimo)?.moneda ?? 'USD';
  const simboloMinimo = monedaMinimo === 'PEN' ? 'S/' : '$';

  return (
    <>
      <Header />

      <section className="relative bg-[var(--brand-navy)] pt-16 sm:pt-24 pb-10 sm:pb-14 flex items-end overflow-hidden">
        {/* Patrón elegante en lugar de una imagen estirada */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-yellow)]/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px] pointer-events-none" />

        <div className="relative z-10 container-site max-w-6xl w-full animate-fade-in">
          <Link 
            href="/hoteles" 
            className="inline-flex items-center gap-2 text-white/60 text-[10px] sm:text-xs font-bold hover:text-[var(--brand-yellow)] transition-colors mb-5 group uppercase tracking-widest"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" /> Volver a hoteles
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 sm:gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-[var(--brand-yellow)]/10 border border-[var(--brand-yellow)]/20 flex items-center justify-center shrink-0">
                  <MapPin size={12} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                </div>
                <p className="text-[var(--brand-yellow)] text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] leading-relaxed">
                  {hotel.ciudad} · {hotel.direccion}
                </p>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                {hotel.nombre}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  {Array.from({ length: hotel.estrellas }).map((_, i) => (
                    <Star key={i} size={12} className="text-[var(--brand-yellow)] fill-[var(--brand-yellow)]" aria-hidden="true" />
                  ))}
                  <span className="text-white text-[10px] font-black uppercase tracking-widest ml-2">{hotel.estrellas} estrellas</span>
                </div>
                
                {precioMinimo && (
                  <span className="bg-[var(--brand-yellow)] text-[#001f3f] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-[var(--brand-yellow)]/10">
                    Desde {simboloMinimo}{precioMinimo} por noche
                  </span>
                )}
              </div>
            </div>
            
            <div className="shrink-0 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-4 rounded-xl text-center animate-fade-up min-w-40" style={{ animationDelay: '0.2s' }}>
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.18em] mb-2 flex items-center justify-center gap-2">
                <BedDouble size={13} className="text-[var(--brand-yellow)]" aria-hidden="true" /> Disponibilidad
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white leading-none mb-1">
                {habitaciones.length}
              </p>
              <p className="text-[10px] font-bold text-[var(--brand-yellow)] uppercase tracking-widest">
                {habitaciones.length === 1 ? 'Habitación' : 'Habitaciones'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white">

        {hotel.imagenesUrls.length > 1 && (
          <section className="container-site max-w-6xl py-5 sm:py-6 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Galería de fotos</h2>
            <GaleriaHotel imagenes={hotel.imagenesUrls} nombre={hotel.nombre} />
          </section>
        )}

        <section className="container-site max-w-6xl py-10 sm:py-14">
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start">
            <div className="flex-1 animate-fade-up">
              <p className="label-eyebrow mb-2">Descripción</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--brand-navy)] mb-4 leading-tight">Sobre el hotel</h2>
              <p className="body-text !text-sm sm:!text-base max-w-3xl leading-relaxed">{hotel.descripcion}</p>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {[
                { Icon: MapPin,        label: 'Ciudad',       valor: hotel.ciudad },
                { Icon: Star,          label: 'Categoría',    valor: `${hotel.estrellas} Estrellas` },
                { Icon: BedDouble,     label: 'Oferta',       valor: `${habitaciones.length} Habitaciones` },
                { Icon: MessageCircle, label: 'Reservas',     valor: 'Vía WhatsApp' },
              ].map(({ Icon, label, valor }) => (
                <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center border border-transparent hover:border-[var(--brand-yellow)]/20 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-9 h-9 bg-[var(--brand-navy)] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon size={16} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                  </div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-xs sm:text-sm font-black text-[var(--brand-navy)] uppercase leading-snug">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--bg-subtle)] py-10 sm:py-14 px-5 sm:px-6 lg:px-8">
          <div className="container-site max-w-6xl !px-0">
            <AnimarAlEntrar className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-5">
              <div className="max-w-xl">
                <p className="label-eyebrow mb-2">Alojamiento</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--brand-navy)] leading-tight">Habitaciones Disponibles</h2>
                <p className="body-text mt-4">Elige la opción que mejor se adapte a tu viaje. Todas nuestras habitaciones están verificadas.</p>
              </div>
              <div className="glass-dark !bg-[var(--brand-navy)] text-white text-[10px] sm:text-xs font-black px-4 sm:px-5 py-3 rounded-xl uppercase tracking-widest flex items-center gap-3 w-full sm:w-auto justify-center">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {habitaciones.length} {habitaciones.length === 1 ? 'opción disponible' : 'opciones disponibles'}
              </div>
            </AnimarAlEntrar>

          <div className="flex flex-col gap-5 sm:gap-6">
            {habitaciones.map((hab, i) => {
              const simbolo = hab.moneda === 'PEN' ? 'S/' : '$';
              return (
                <AnimarAlEntrar key={hab.id} delay={i * 0.08}>
                  <article className="bg-white border border-gray-200 hover:border-[#ffd600]/50 rounded-2xl overflow-hidden group hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col lg:flex-row">
                    
                    {/* Imagen (Izquierda en desktop) */}
                    <div className="relative h-44 sm:h-52 lg:h-auto lg:w-64 xl:w-72 bg-gray-100 overflow-hidden shrink-0">
                      <ImagenSegura
                        src={hab.imagenesUrls[0] ?? ''}
                        alt={`Habitación ${hab.nombre}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {hab.imagenesUrls.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[#001f3f] text-[9px] font-black uppercase tracking-widest shadow-sm">
                          +{hab.imagenesUrls.length - 1} fotos
                        </div>
                      )}
                      {hab.tipoHabitacion && (
                        <div className="absolute top-3 left-3 bg-[#001f3f]/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[#ffd600] text-[9px] font-black uppercase tracking-widest shadow-sm">
                          {hab.tipoHabitacion}
                        </div>
                      )}
                    </div>
                    
                    {/* Contenido (Derecha en desktop) */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-black text-[#001f3f] mb-2 group-hover:text-blue-600 transition-colors uppercase leading-tight">{hab.nombre}</h3>
                          {hab.descripcion && (
                            <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-2 md:line-clamp-3">{hab.descripcion}</p>
                          )}
                        </div>
                        
                        {/* Bloque Precio (Solo visible en Desktop) */}
                        <div className="hidden md:flex flex-col items-end shrink-0 text-right bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-36">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio por Noche</p>
                          <div className="flex items-baseline gap-0.5 text-[#001f3f] mb-4">
                            <span className="text-2xl font-black">{simbolo}{hab.precioNoche}</span>
                            <span className="text-sm font-bold text-gray-400">.00</span>
                          </div>
                          <Link
                            href={`/checkout/${hab.id}`}
                            className="bg-[#001f3f] hover:bg-[#ffd600] text-white hover:text-[#001f3f] px-5 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all w-full text-center shadow-sm"
                          >
                            Reservar
                          </Link>
                        </div>
                      </div>

                      {/* Amenidades */}
                      {hab.amenidades?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {hab.amenidades.map(a => (
                            <span key={a} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg">
                              <span className="text-[#ffd600]">{iconosAmenidades[a] ?? null}</span>
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Detalles inferiores */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-2">
                          <Users size={14} className="text-[#ffd600]" aria-hidden="true" /> {hab.capacidadPersonas} Personas
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-200 hidden sm:block" />
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-500" aria-hidden="true" /> Disponibilidad Inmediata
                        </span>
                      </div>
                      
                      {/* Bloque Precio (Solo visible en Mobile) */}
                      <div className="md:hidden flex items-end justify-between pt-5 mt-5 border-t border-gray-100">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio por Noche</p>
                          <div className="flex items-baseline gap-0.5 text-[#001f3f]">
                            <span className="text-2xl font-black">{simbolo}{hab.precioNoche}</span>
                            <span className="text-xs font-bold text-gray-400">.00</span>
                          </div>
                        </div>
                        <Link
                          href={`/checkout/${hab.id}`}
                          className="bg-[#001f3f] hover:bg-[#ffd600] text-white hover:text-[#001f3f] px-5 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Reservar
                        </Link>
                      </div>

                    </div>
                  </article>
                </AnimarAlEntrar>
              );
            })}
            
            {habitaciones.length === 0 && (
              <div className="col-span-full text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-100">
                <BedDouble size={48} className="text-gray-200 mx-auto mb-4" aria-hidden="true" />
                <p className="body-text">No hay habitaciones disponibles</p>
              </div>
            )}
          </div>
          </div>
        </section>

      </main>
      
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Hotel',
            name: hotel.nombre,
            description: hotel.descripcion,
            address: {
              '@type': 'PostalAddress',
              streetAddress: hotel.direccion,
              addressLocality: hotel.ciudad,
              addressCountry: 'PE',
            },
            starRating: {
              '@type': 'Rating',
              ratingValue: hotel.estrellas,
            },
            image: hotel.imagenesUrls,
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hoteles.adventur.pe'}/hoteles/${hotel.id}`,
            priceRange: precioMinimo ? `${simboloMinimo}${precioMinimo}` : undefined,
            numberOfRooms: habitaciones.length,
            amenityFeature: habitaciones.flatMap(h => h.amenidades || []).filter((v, i, a) => a.indexOf(v) === i).map(amenidad => ({
              '@type': 'LocationFeatureSpecification',
              name: amenidad,
            })),
          }),
        }}
      />
    </>
  );
}
