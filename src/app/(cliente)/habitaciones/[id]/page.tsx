import { Header, Footer } from '@/components/layout/Header';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import {
  ETIQUETAS_TIPO_HABITACION,
  ETIQUETAS_TIPO_CAMA,
  ETIQUETAS_REGIMEN,
} from '@/modules/habitaciones/dominio/entidades/Habitacion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Users, BedDouble, Coffee, Wifi, Tv,
  Wind, Waves, TreePine, CheckCircle2, ChevronRight,
  MessageCircle, Star,
} from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

const iconosAmenidades: Record<string, React.ReactNode> = {
  'WiFi':              <Wifi size={14} />,
  'TV':                <Tv size={14} />,
  'Aire Acondicionado':<Wind size={14} />,
  'Minibar':           <Coffee size={14} />,
  'Jacuzzi':           <Waves size={14} />,
  'Balcón':            <TreePine size={14} />,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const hab = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorId(id);
    if (!hab) return { title: 'Habitación no encontrada' };
    return {
      title: `${hab.nombre} — Detalle de habitación`,
      description: hab.descripcion ?? `Habitación ${hab.nombre}, capacidad ${hab.capacidadPersonas} personas. Desde S/${hab.precioNoche} por noche.`,
    };
  } catch {
    return { title: 'Habitación no encontrada' };
  }
}

export default async function PaginaDetalleHabitacion({ params }: PageProps) {
  const { id } = await params;

  const hab = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorId(id);
  if (!hab) notFound();

  const hotel = await new ServicioHoteles(new AdaptadorSupabaseHotel()).buscarPorId(hab.hotelId);
  if (!hotel) notFound();

  const simbolo = hab.moneda === 'PEN' ? 'S/' : '$';

  return (
    <>
      <Header />

      {/* Banner */}
      <div className="bg-[var(--brand-navy)] pt-20 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-yellow)]/20 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 flex-wrap">
            <Link href="/hoteles" className="hover:text-[var(--brand-yellow)] transition-colors">Hoteles</Link>
            <ChevronRight size={12} />
            <Link href={`/hoteles/${hotel.id}`} className="hover:text-[var(--brand-yellow)] transition-colors truncate max-w-[140px]">{hotel.nombre}</Link>
            <ChevronRight size={12} />
            <span className="text-white/70 truncate max-w-[160px]">{hab.nombre}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              {hab.tipoHabitacion && (
                <span className="inline-block bg-[var(--brand-yellow)] text-[var(--brand-navy)] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4 shadow-[0_4px_12px_rgba(255,214,0,0.3)]">
                  {ETIQUETAS_TIPO_HABITACION[hab.tipoHabitacion]}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-2">
                {hab.nombre}
              </h1>
              <div className="flex items-center gap-2 text-white/50 text-xs font-semibold flex-wrap">
                <Link href={`/hoteles/${hotel.id}`} className="hover:text-[var(--brand-yellow)] transition-colors flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: hotel.estrellas }).map((_, i) => (
                      <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  {hotel.nombre}
                </Link>
                <span className="text-white/20">·</span>
                <span>{hotel.ciudad}</span>
              </div>
            </div>
            <div className="shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 text-right">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Precio por noche</p>
              <p className="text-3xl sm:text-4xl font-black text-white leading-none">{simbolo}{hab.precioNoche}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-[var(--bg-subtle)] py-8 sm:py-12 px-4 sm:px-6 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Columna principal */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Galería */}
              {hab.imagenesUrls.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-2 gap-1.5 p-1.5">
                    {hab.imagenesUrls.slice(0, 4).map((url, i) => (
                      <div
                        key={i}
                        className={`relative overflow-hidden rounded-xl bg-gray-100 ${
                          i === 0 && hab.imagenesUrls.length > 1 ? 'col-span-2 h-48 sm:h-60' : 'h-28 sm:h-36'
                        } ${i === 0 && hab.imagenesUrls.length === 1 ? 'col-span-2 h-56 sm:h-72' : ''}`}
                      >
                        <ImagenSegura
                          src={url}
                          alt={`${hab.nombre} - foto ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        {i === 3 && hab.imagenesUrls.length > 4 && (
                          <div className="absolute inset-0 bg-black/55 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center text-white">
                              <span className="text-2xl font-black block">+{hab.imagenesUrls.length - 4}</span>
                              <span className="text-xs font-semibold opacity-70">más fotos</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Descripción */}
              {hab.descripcion && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <p className="label-eyebrow mb-2 !text-left">Descripción</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{hab.descripcion}</p>
                </div>
              )}

              {/* Detalles */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="label-eyebrow mb-4 !text-left">Detalles</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Capacidad', value: `${hab.capacidadPersonas} persona${hab.capacidadPersonas > 1 ? 's' : ''}`, icon: <Users size={15} /> },
                    { label: 'Camas', value: `${hab.cantidadCamas} cama${hab.cantidadCamas > 1 ? 's' : ''}`, icon: <BedDouble size={15} /> },
                    ...(hab.tipoCama ? [{ label: 'Tipo de cama', value: ETIQUETAS_TIPO_CAMA[hab.tipoCama], icon: <BedDouble size={15} /> }] : []),
                    ...(hab.regimenAlimentacion ? [{ label: 'Régimen', value: ETIQUETAS_REGIMEN[hab.regimenAlimentacion], icon: <Coffee size={15} /> }] : []),
                    ...(hab.numeroHabitacion ? [{ label: 'N° habitación', value: hab.numeroHabitacion, icon: <CheckCircle2 size={15} /> }] : []),
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 border border-gray-100 hover:border-[var(--brand-yellow)]/30 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-1.5 text-[var(--brand-yellow)] mb-2">{icon}</div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
                      <p className="text-xs font-bold text-[var(--brand-navy)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenidades */}
              {hab.amenidades?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <p className="label-eyebrow mb-4 !text-left">Amenidades</p>
                  <div className="flex flex-wrap gap-2">
                    {hab.amenidades.map(a => (
                      <span key={a} className="flex items-center gap-2 text-xs font-semibold bg-[var(--bg-subtle)] border border-gray-100 text-gray-600 px-3 py-2 rounded-xl hover:border-[var(--brand-yellow)]/40 hover:bg-[var(--brand-yellow)]/5 transition-all duration-200">
                        <span className="text-[var(--brand-yellow)]">{iconosAmenidades[a] ?? <CheckCircle2 size={13} />}</span>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">

              {/* Card de reserva */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Precio por noche</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[var(--brand-navy)]">{simbolo}{hab.precioNoche}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <CheckCircle2 size={13} className="text-green-500" />
                    <span className="text-[10px] font-bold text-green-600">Disponibilidad inmediata</span>
                  </div>
                </div>

                <Link
                  href={`/checkout/${hab.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-[var(--brand-navy)] hover:bg-[var(--brand-yellow)] text-white hover:text-[var(--brand-navy)] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 mb-2.5 shadow-sm hover:shadow-[0_4px_14px_rgba(255,214,0,0.3)]"
                >
                  <MessageCircle size={14} />
                  Reservar ahora
                </Link>

                <Link
                  href={`/hoteles/${hotel.id}`}
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-[var(--brand-navy)] text-gray-400 hover:text-[var(--brand-navy)] py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-200"
                >
                  <ArrowLeft size={12} />
                  Volver al hotel
                </Link>

                <p className="text-[9px] text-gray-400 text-center mt-4 leading-relaxed">
                  Sin comisiones · Confirmación directa por WhatsApp
                </p>
              </div>

              {/* Info del hotel */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Hotel</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: hotel.estrellas }).map((_, i) => (
                    <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-black text-[var(--brand-navy)] mb-1">{hotel.nombre}</p>
                <p className="text-xs text-gray-400">{hotel.ciudad} · {hotel.direccion}</p>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
