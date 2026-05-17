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
      <div className="bg-[var(--brand-navy)] pt-20 sm:pt-28 pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-5 flex-wrap">
            <Link href="/hoteles" className="hover:text-[var(--brand-yellow)] transition-colors">Hoteles</Link>
            <ChevronRight size={12} />
            <Link href={`/hoteles/${hotel.id}`} className="hover:text-[var(--brand-yellow)] transition-colors truncate max-w-[140px]">{hotel.nombre}</Link>
            <ChevronRight size={12} />
            <span className="text-white/70 truncate max-w-[160px]">{hab.nombre}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {hab.tipoHabitacion && (
                <span className="inline-block bg-[var(--brand-yellow)] text-[var(--brand-navy)] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
                  {ETIQUETAS_TIPO_HABITACION[hab.tipoHabitacion]}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight mb-1">
                {hab.nombre}
              </h1>
              <div className="flex items-center gap-2 text-white/50 text-xs font-semibold">
                <Link href={`/hoteles/${hotel.id}`} className="hover:text-[var(--brand-yellow)] transition-colors flex items-center gap-1">
                  <Star size={11} className="text-[var(--brand-yellow)]" />
                  {hotel.nombre}
                </Link>
                <span>·</span>
                <span>{hotel.ciudad}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-0.5">Precio por noche</p>
              <p className="text-3xl font-black text-white">{simbolo}{hab.precioNoche}</p>
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
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {hab.imagenesUrls.slice(0, 4).map((url, i) => (
                      <div
                        key={i}
                        className={`relative overflow-hidden rounded-lg bg-gray-100 ${
                          i === 0 && hab.imagenesUrls.length > 1 ? 'col-span-2 h-56 sm:h-72' : 'h-32 sm:h-40'
                        } ${i === 0 && hab.imagenesUrls.length === 1 ? 'col-span-2 h-64 sm:h-80' : ''}`}
                      >
                        <ImagenSegura
                          src={url}
                          alt={`${hab.nombre} - foto ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                        {i === 3 && hab.imagenesUrls.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-black text-lg">+{hab.imagenesUrls.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Descripción */}
              {hab.descripcion && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-black text-[var(--brand-navy)] uppercase tracking-widest mb-3">Descripción</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{hab.descripcion}</p>
                </div>
              )}

              {/* Detalles */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-black text-[var(--brand-navy)] uppercase tracking-widest mb-4">Detalles</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Capacidad', value: `${hab.capacidadPersonas} persona${hab.capacidadPersonas > 1 ? 's' : ''}`, icon: <Users size={14} /> },
                    { label: 'Camas', value: `${hab.cantidadCamas} cama${hab.cantidadCamas > 1 ? 's' : ''}`, icon: <BedDouble size={14} /> },
                    ...(hab.tipoCama ? [{ label: 'Tipo de cama', value: ETIQUETAS_TIPO_CAMA[hab.tipoCama], icon: <BedDouble size={14} /> }] : []),
                    ...(hab.regimenAlimentacion ? [{ label: 'Régimen', value: ETIQUETAS_REGIMEN[hab.regimenAlimentacion], icon: <Coffee size={14} /> }] : []),
                    ...(hab.numeroHabitacion ? [{ label: 'N° habitación', value: hab.numeroHabitacion, icon: <CheckCircle2 size={14} /> }] : []),
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center gap-1.5 text-[var(--brand-yellow)] mb-1">{icon}</div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                      <p className="text-xs font-bold text-[var(--brand-navy)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenidades */}
              {hab.amenidades?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-black text-[var(--brand-navy)] uppercase tracking-widest mb-4">Amenidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {hab.amenidades.map(a => (
                      <span key={a} className="flex items-center gap-1.5 text-[10px] font-bold bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">
                        <span className="text-[var(--brand-yellow)]">{iconosAmenidades[a] ?? <CheckCircle2 size={12} />}</span>
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
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-24">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio por noche</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[var(--brand-navy)]">{simbolo}{hab.precioNoche}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle2 size={12} className="text-green-500" />
                    <span className="text-[10px] font-bold text-green-600">Disponibilidad inmediata</span>
                  </div>
                </div>

                <Link
                  href={`/checkout/${hab.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-[var(--brand-navy)] hover:bg-[var(--brand-yellow)] text-white hover:text-[var(--brand-navy)] py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all mb-2"
                >
                  <MessageCircle size={14} />
                  Reservar ahora
                </Link>

                <Link
                  href={`/hoteles/${hotel.id}`}
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-[var(--brand-navy)] text-gray-500 hover:text-[var(--brand-navy)] py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <ArrowLeft size={12} />
                  Volver al hotel
                </Link>

                <p className="text-[9px] text-gray-400 text-center mt-3 leading-relaxed">
                  Sin comisiones · Confirmación directa por WhatsApp
                </p>
              </div>

              {/* Info del hotel */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Hotel</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: hotel.estrellas }).map((_, i) => (
                      <Star key={i} size={10} className="text-[var(--brand-yellow)] fill-[var(--brand-yellow)]" />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-black text-[var(--brand-navy)] mb-0.5">{hotel.nombre}</p>
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
