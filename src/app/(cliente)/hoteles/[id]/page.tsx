import { Header, Footer } from '@/components/layout/Header';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { GaleriaHotel } from '@/components/cliente/GaleriaHotel';
import { CarruselResenas } from '@/components/cliente/CarruselResenas';
import { obtenerResenasPorHotel, promedioCalificacion } from '@/lib/resenas-consultas';
import { Metadata } from 'next';
import { getPublicEnv } from '@/lib/env';
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
    const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
    const url = `${siteUrl}/hoteles/${hotel.id}`;

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
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        type: 'website',
        url,
        images: hotel.imagenesUrls.length > 0 ? [
          {
            url: hotel.imagenesUrls[0],
            width: 1200,
            height: 630,
            alt: `Hotel ${hotel.nombre} en ${hotel.ciudad}`,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: hotel.imagenesUrls[0] ? [hotel.imagenesUrls[0]] : undefined,
      },
    };
  } catch {
    return { title: 'Hotel no encontrado' };
  }
}

export default async function PaginaDetalleHotel({ params }: PageProps) {
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  const { id } = await params;

  const hotel = await new ServicioHoteles(new AdaptadorSupabaseHotel()).buscarPorId(id);
  if (!hotel) notFound();

  const [habitaciones, resenas] = await Promise.all([
    new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorHotel(id),
    obtenerResenasPorHotel(id),
  ]);
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

        <AnimarAlEntrar direction="none" className="relative z-10 container-site max-w-6xl w-full">
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
            
            <AnimarAlEntrar delay={0.2} className="shrink-0 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-4 rounded-xl text-center min-w-40">
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.18em] mb-2 flex items-center justify-center gap-2">
                <BedDouble size={13} className="text-[var(--brand-yellow)]" aria-hidden="true" /> Disponibilidad
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white leading-none mb-1">
                {habitaciones.length}
              </p>
              <p className="text-[10px] font-bold text-[var(--brand-yellow)] uppercase tracking-widest">
                {habitaciones.length === 1 ? 'Habitación' : 'Habitaciones'}
              </p>
            </AnimarAlEntrar>
          </div>
        </AnimarAlEntrar>
      </section>

      <main className="bg-white">

        {hotel.imagenesUrls.length > 1 && (
          <section className="container-site max-w-5xl py-4 sm:py-5 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Galería de fotos</h2>
            <GaleriaHotel imagenes={hotel.imagenesUrls} nombre={hotel.nombre} />
          </section>
        )}

        <section className="container-site max-w-6xl py-10 sm:py-14">
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start">
            <AnimarAlEntrar className="flex-1">
              <p className="label-eyebrow mb-2">Descripción</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--brand-navy)] mb-4 leading-tight">Sobre el hotel</h2>
              <p className="body-text !text-sm sm:!text-base max-w-3xl leading-relaxed">{hotel.descripcion}</p>
            </AnimarAlEntrar>
            
            <AnimarAlEntrar delay={0.1} className="w-full grid grid-cols-2 gap-3">
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
            </AnimarAlEntrar>
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

          <div className="flex flex-col gap-3">
            {habitaciones.map((hab, i) => {
              const simbolo = hab.moneda === 'PEN' ? 'S/' : '$';
              return (
                <AnimarAlEntrar key={hab.id} delay={i * 0.05}>
                  <article className="bg-white border border-gray-100 hover:border-[#ffd600]/50 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row">

                    {/* Imagen */}
                    <div className="relative h-40 sm:h-auto sm:w-48 bg-gray-100 overflow-hidden shrink-0">
                      <ImagenSegura
                        src={hab.imagenesUrls[0] ?? ''}
                        alt={`Habitación ${hab.nombre}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {hab.tipoHabitacion && (
                        <div className="absolute top-2.5 left-2.5 bg-[#001f3f] px-2.5 py-1 rounded-full text-[#ffd600] text-[8px] font-black uppercase tracking-widest shadow">
                          {hab.tipoHabitacion}
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-col sm:flex-row flex-1 min-w-0">

                      {/* Info */}
                      <div className="flex-1 min-w-0 px-4 py-3.5">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-snug">
                          {hab.nombre}
                        </h3>
                        {hab.descripcion && (
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2.5">{hab.descripcion}</p>
                        )}

                        {/* Amenidades */}
                        {hab.amenidades?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {hab.amenidades.slice(0, 4).map(a => (
                              <span key={a} className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                <span className="text-[#ffd600]">{iconosAmenidades[a] ?? null}</span>
                                {a}
                              </span>
                            ))}
                            {hab.amenidades.length > 4 && (
                              <span className="text-[10px] text-gray-400 px-1">+{hab.amenidades.length - 4} más</span>
                            )}
                          </div>
                        )}

                        {/* Capacidad */}
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users size={11} className="text-[#ffd600]" /> {hab.capacidadPersonas} personas
                          </span>
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 size={11} /> Disponible
                          </span>
                        </div>
                      </div>

                      {/* Precio + acciones — separador vertical */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center sm:border-l border-t sm:border-t-0 border-gray-100 px-4 py-3.5 gap-3 shrink-0 sm:w-40">
                        {/* Precio */}
                        <div className="text-right sm:text-center">
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">por noche</p>
                          <p className="text-xl font-bold text-gray-800 leading-none">
                            {simbolo}{hab.precioNoche}
                          </p>
                        </div>

                        {/* Botones */}
                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                          <Link
                            href={`/checkout/${hab.id}`}
                            className="flex items-center justify-center gap-1.5 bg-[#001f3f] hover:bg-[#ffd600] text-white hover:text-[#001f3f] px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                          >
                            <MessageCircle size={13} />
                            Reservar
                          </Link>
                          <Link
                            href={`/habitaciones/${hab.id}`}
                            className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border border-gray-100"
                          >
                            Ver detalles
                          </Link>
                        </div>
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

        {resenas.length > 0 && (
          <section className="container-site max-w-6xl py-10 sm:py-14">
            <AnimarAlEntrar className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <p className="label-eyebrow mb-2">Opiniones de huéspedes</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--brand-navy)] leading-tight">
                  Reseñas verificadas
                </h2>
              </div>
              {(() => {
                const avg = promedioCalificacion(resenas);
                return (
                  <div className="flex items-center gap-2 bg-[var(--bg-subtle)] rounded-xl px-4 py-2.5 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.round(avg) ? 'fill-[#ffd600] text-[#ffd600]' : 'fill-gray-200 text-gray-200'}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-[var(--brand-navy)] font-black text-sm">
                      {avg.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-xs">({resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'})</span>
                  </div>
                );
              })()}
            </AnimarAlEntrar>
            <AnimarAlEntrar delay={0.1}>
              <CarruselResenas resenas={resenas} />
            </AnimarAlEntrar>
          </section>
        )}

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
            url: `${siteUrl}/hoteles/${hotel.id}`,
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
