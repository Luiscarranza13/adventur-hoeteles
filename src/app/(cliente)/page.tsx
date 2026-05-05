import { Header, Footer } from '@/components/layout/Header';
import { CarruselServicios } from '@/components/cliente/CarruselServicios';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { HeroCliente } from '@/components/cliente/HeroCliente';
import { HeroFondoAnimado } from '@/components/cliente/HeroFondoAnimado';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import { obtenerDestinos } from '@/lib/destinos';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, MessageCircle, Star,
  Shield, Zap, BadgeDollarSign, ArrowRight,
  CheckCircle2, ChevronDown
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Adventur Hoteles — Alojamiento en Cajamarca y todo el Perú',
  description: 'Encuentra los mejores hoteles en Cajamarca, Lima, Cusco, Arequipa y todo el Perú. Reserva directa por WhatsApp, sin comisiones y con confirmación inmediata.',
  keywords: ['hoteles Perú', 'hoteles Cajamarca', 'reserva hotel WhatsApp', 'alojamiento Perú', 'hospedaje Cajamarca'],
  openGraph: {
    title: 'Adventur Hoteles — Alojamiento en Cajamarca y todo el Perú',
    description: 'Hoteles verificados en todo el Perú. Reserva directa por WhatsApp, sin comisiones.',
    type: 'website',
  },
};

async function obtenerHoteles() {
  try {
    return await new ServicioHoteles(new AdaptadorSupabaseHotel()).listarActivos();
  } catch {
    return [];
  }
}

async function obtenerPrecioMinimo(hotelId: string): Promise<number | null> {
  try {
    const habs = await new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).buscarPorHotel(hotelId);
    if (!habs.length) return null;
    return Math.min(...habs.map(h => h.precioNoche));
  } catch {
    return null;
  }
}

const faqs = [
  {
    pregunta: '¿Qué documentos necesito para reservar un hotel?',
    respuesta: 'Solo necesitas tu DNI o pasaporte vigente. Para reservas corporativas, también puedes solicitar factura electrónica con tu RUC. Todos tus datos son tratados con total confidencialidad.',
  },
  {
    pregunta: '¿Mis datos personales están seguros al realizar una reserva?',
    respuesta: 'Sí. Tus datos se gestionan directamente con el hotel a través de WhatsApp, sin intermediarios digitales que almacenen tu información. Cumplimos con la Ley de Protección de Datos Personales del Perú.',
  },
  {
    pregunta: '¿Qué modalidades de reserva ofrecen?',
    respuesta: 'Ofrecemos reserva directa por WhatsApp, sin comisiones ni cargos adicionales. El precio que ves es el que pagas directamente al establecimiento. También puedes solicitar cotizaciones para grupos o eventos especiales.',
  },
];

export default async function PaginaInicio() {
  const [hoteles, destinos] = await Promise.all([obtenerHoteles(), obtenerDestinos()]);
  const ciudades = [...new Set(hoteles.map(h => h.ciudad))];
  const departamentos = [...new Set(destinos.map(d => d.departamento))];

  const hotelesConPrecio = await Promise.all(
    hoteles.slice(0, 8).map(async h => ({ ...h, precioMinimo: await obtenerPrecioMinimo(h.id) }))
  );

  return (
    <>
      <Header />
      <main>

        <section className="relative h-screen flex flex-col bg-black overflow-hidden" style={{ isolation: 'isolate' }}>
          <HeroFondoAnimado />
          <HeroCliente totalHoteles={hoteles.length} totalCiudades={departamentos.length || ciudades.length} />
        </section>

        {destinos.length > 0 && (
          <section id="destinos" className="section-padding bg-[var(--bg-base)]">
            <div className="container-site">
              <AnimarAlEntrar className="text-center mb-16">
                <p className="label-eyebrow mb-2">Lugares de procedencia</p>
                <h2 className="heading-section mb-4">
                  Atendemos viajeros de todo el Perú
                </h2>
                <p className="body-text max-w-2xl mx-auto">Selecciona tu ciudad, distrito o zona de procedencia para consultar alojamientos disponibles por WhatsApp.</p>
              </AnimarAlEntrar>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-14">
                {destinos.map((destino, i) => (
                  <AnimarAlEntrar key={destino.slug} delay={(i % 10) * 0.03}>
                    <Link href={`/hoteles?ciudad=${encodeURIComponent(destino.nombre)}`} className="block h-full">
                      <article className="group h-full min-h-28 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:border-[var(--brand-yellow)]/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-yellow)] truncate">
                              {destino.departamento}
                            </p>
                            <h3 className="mt-2 text-sm sm:text-base font-black text-[var(--brand-navy)] leading-tight group-hover:text-[var(--brand-yellow-light)] transition-colors">
                              {destino.nombre}
                            </h3>
                          </div>
                          <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] group-hover:bg-[var(--brand-navy)] flex items-center justify-center shrink-0 transition-colors">
                            <MapPin size={16} className="text-[var(--brand-navy)] group-hover:text-[var(--brand-yellow)] transition-colors" aria-hidden="true" />
                          </div>
                        </div>
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                          {destino.tipo}
                        </p>
                      </article>
                    </Link>
                  </AnimarAlEntrar>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/hoteles"
                  className="btn-outline"
                >
                  Ver todos los destinos <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="section-padding bg-[var(--bg-subtle)]">
          <div className="container-site">
            <AnimarAlEntrar className="text-center mb-16">
              <p className="label-eyebrow mb-2">Selección Exclusiva</p>
              <h2 className="heading-section mb-4">
                Hoteles Destacados
              </h2>
              <p className="body-text max-w-2xl mx-auto">
                Seleccionamos los mejores alojamientos para garantizar tu confort: desde hostales acogedores hasta hoteles de lujo.
              </p>
            </AnimarAlEntrar>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {hotelesConPrecio.map((hotel, i) => (
                <AnimarAlEntrar key={hotel.id} delay={i * 0.07}>
                  <Link href={`/hoteles/${hotel.id}`}>
                    <article className="card-premium h-full flex flex-col group">

                      <div className="relative h-56 bg-[var(--brand-navy)] overflow-hidden shrink-0">
                        <ImagenSegura
                          src={hotel.imagenesUrls[0] ?? ''}
                          alt={`Hotel ${hotel.nombre} en ${hotel.ciudad}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {hotel.precioMinimo && (
                          <div className="absolute top-4 left-4 glass px-3 py-2 rounded-xl shadow-lg z-10">
                            <p className="text-[9px] font-black text-[var(--brand-navy)]/60 uppercase tracking-widest leading-none mb-1">DESDE</p>
                            <p className="text-[var(--brand-navy)] font-black text-sm leading-none">S/{hotel.precioMinimo}</p>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg z-10">
                          <Star size={14} className="text-[var(--brand-yellow)] fill-[var(--brand-yellow)]" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-0.5 mb-3">
                          {Array.from({ length: hotel.estrellas }).map((_, j) => (
                            <Star key={j} size={11} className="text-[var(--brand-yellow)] fill-[var(--brand-yellow)]" aria-hidden="true" />
                          ))}
                        </div>
                        <h3 className="heading-card mb-2 group-hover:text-[var(--brand-yellow-light)] transition-colors line-clamp-2">
                          {hotel.nombre}
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                          <MapPin size={14} className="text-[var(--text-muted)] shrink-0" aria-hidden="true" />
                          <span className="text-[var(--text-secondary)] text-xs font-semibold truncate">{hotel.ciudad}</span>
                        </div>
                        <div className="mt-auto">
                          <div className="btn-primary !w-full !py-3 !text-xs group-hover:bg-[var(--brand-yellow-light)]">
                            <MessageCircle size={16} aria-hidden="true" />
                            <span>Reservar ahora</span>
                          </div>
                        </div>
                      </div>

                    </article>
                  </Link>
                </AnimarAlEntrar>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/hoteles"
                className="btn-secondary"
              >
                Ver toda la oferta <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="servicios" className="section-padding bg-[var(--bg-base)]">
          <div className="container-site">
            <AnimarAlEntrar className="text-center mb-16">
              <p className="label-eyebrow mb-2">Nuestros Servicios</p>
              <h2 className="heading-section mb-4">
                Servicios de hospedaje en Cajamarca y todo el Perú
              </h2>
              <p className="body-text max-w-3xl mx-auto">
                Traslados al aeropuerto, hospedaje corporativo y atención personalizada. Misma exigencia de calidad y seguridad en cada destino.
              </p>
            </AnimarAlEntrar>

            <CarruselServicios />
          </div>
        </section>

        <section className="section-padding bg-[var(--brand-navy)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="container-site relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
              <AnimarAlEntrar>
                <p className="label-eyebrow mb-4">Seguridad Total</p>
                <h2 className="heading-section-light mb-6">
                  Viaja con seguridad y el confort que mereces
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                  En Adventur ofrecemos hoteles verificados con la misma calidad que esperas de un operador nacional: establecimientos seguros, habitaciones modernas y atención coordinada.
                </p>

                <div className="space-y-6">
                  {[
                    'Hoteles verificados con licencia vigente y experiencia comprobada',
                    'Habitaciones modernas con mantenimiento preventivo al día',
                    'Asistencia personalizada disponible las 24 horas del día',
                  ].map((texto) => (
                    <div key={texto} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[var(--brand-yellow)]/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 size={14} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">{texto}</p>
                    </div>
                  ))}
                </div>
              </AnimarAlEntrar>

              <AnimarAlEntrar delay={0.2}>
                <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group bg-white">
                  {hoteles[1]?.imagenesUrls[0] ? (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100" />
                      <ImagenSegura
                        src={hoteles[1].imagenesUrls[0]}
                        alt="Hotel seguro y confortable"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain p-8 sm:p-16 group-hover:scale-105 transition-transform duration-1000 relative z-10"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--brand-navy-light)] relative z-10">
                      <div className="text-center">
                        <Shield size={64} className="text-[var(--brand-yellow)]/30 mx-auto mb-4" aria-hidden="true" />
                        <p className="text-white/30 text-lg font-bold">Adventur Hoteles</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-6 sm:bottom-8 left-6 right-6 sm:left-8 sm:right-8 z-20">
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {[
                        { n: hoteles.length || '50+', label: 'Hoteles' },
                        { n: ciudades.length || '10+', label: 'Ciudades' },
                        { n: '0%', label: 'Comisión' },
                      ].map(({ n, label }) => (
                        <div key={label} className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1 transition-transform duration-500">
                          <p className="text-[var(--brand-navy)] font-black text-xl sm:text-2xl leading-none mb-1 sm:mb-2">{n}</p>
                          <p className="text-[var(--brand-yellow)] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em]">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimarAlEntrar>
            </div>
          </div>
        </section>

        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            <AnimarAlEntrar>
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group">
                
                {/* Imagen de fondo contenida */}
                <div className="absolute inset-0 z-0 bg-[#001f3f]">
                  <Image
                    src="/imagen1.jpg"
                    alt="Paisaje majestuoso del Perú"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
                  />
                  {/* Overlays elegantes */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] via-[#001f3f]/90 md:via-[#001f3f]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f] via-transparent to-transparent opacity-80 md:hidden" />
                </div>

                {/* Contenido del Banner */}
                <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 md:py-16 md:px-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
                  
                  <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
                    
                    <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="relative flex w-10 h-7 rounded shadow-md overflow-hidden border border-white/20 shrink-0">
                        <div className="flex-1 bg-[#D91023]" />
                        <div className="flex-1 bg-white" />
                        <div className="flex-1 bg-[#D91023]" />
                      </div>
                      <p className="text-[#ffd600] font-black text-[10px] sm:text-xs tracking-[0.3em] uppercase pt-1">
                        Tu Próximo Destino
                      </p>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-md">
                      Vive la magia <br className="hidden md:block"/>del <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">PERÚ</span>
                    </h2>
                    
                    <p className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed mb-6 sm:mb-8 text-center md:text-left drop-shadow-sm">
                      Desde los imponentes Andes hasta la belleza de la costa. Recorre los rincones más mágicos del país descansando en hoteles verificados, seguros y diseñados para brindarte el máximo confort.
                    </p>
                    
                    <a
                      href="https://wa.me/51958101721?text=Hola%2C+quiero+planificar+mi+viaje+por+el+Perú."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#ffd600] hover:bg-[#ffdf33] text-[#001f3f] font-black text-xs sm:text-sm uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,214,0,0.3)] hover:shadow-[0_0_30px_rgba(255,214,0,0.5)] hover:-translate-y-1 active:scale-95"
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      <span>Empieza tu viaje hoy</span>
                    </a>
                  </div>

                  {/* Sello Decorativo (Oculto en móviles) */}
                  <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-32 lg:w-40 h-32 lg:h-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm self-center shadow-2xl">
                     <Shield size={32} className="text-[#ffd600] mb-2 lg:mb-3 lg:w-10 lg:h-10" />
                     <span className="text-white font-black text-[9px] lg:text-[10px] text-center tracking-widest uppercase leading-tight">Garantía<br/>Adventur</span>
                  </div>
                  
                </div>
              </div>
            </AnimarAlEntrar>
          </div>
        </section>

        <section className="section-padding bg-[var(--bg-base)]">
          <div className="container-site">
            <AnimarAlEntrar className="text-center mb-16">
              <p className="label-eyebrow mb-2">La Diferencia Adventur</p>
              <h2 className="heading-section">
                ¿Por qué elegirnos?
              </h2>
            </AnimarAlEntrar>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { Icon: Shield, titulo: 'Reserva 100% segura', desc: 'Tus datos son gestionados directamente con el hotel, garantizando privacidad total y seguridad en tu reserva.' },
                { Icon: Zap, titulo: 'Respuesta inmediata', desc: 'Olvídate de esperas. Nuestra integración con WhatsApp te asegura una respuesta del hotel en tiempo récord.' },
                { Icon: BadgeDollarSign, titulo: 'Precio directo sin extras', desc: 'Sin comisiones ocultas ni cargos de gestión. El precio que ves es el que pagas directamente al establecimiento.' },
              ].map(({ Icon, titulo, desc }, i) => (
                <AnimarAlEntrar key={titulo} delay={i * 0.1}>
                  <article className="group p-8 rounded-3xl bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--brand-yellow)]/30 hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="w-16 h-16 bg-[var(--brand-navy)] group-hover:bg-[var(--brand-yellow)] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 shadow-lg">
                      <Icon size={28} className="text-[var(--brand-yellow)] group-hover:text-[var(--brand-navy)] transition-colors" aria-hidden="true" />
                    </div>
                    <h3 className="heading-card mb-4">{titulo}</h3>
                    <p className="body-text text-base">{desc}</p>
                  </article>
                </AnimarAlEntrar>
              ))}
            </div>
          </div>
        </section>

        <section id="preguntas-frecuentes" className="section-padding bg-[var(--bg-subtle)]">
          <div className="container-site max-w-4xl">
            <AnimarAlEntrar className="text-center mb-16">
              <p className="label-eyebrow mb-2">Resolvemos tus dudas</p>
              <h2 className="heading-section mb-4">
                Preguntas frecuentes
              </h2>
              <p className="body-text max-w-2xl mx-auto">
                Todo lo que necesitas saber sobre documentos, privacidad y modalidad de servicio para tu próxima estadía.
              </p>
            </AnimarAlEntrar>

            <div className="space-y-4">
              {faqs.map(({ pregunta, respuesta }, i) => (
                <AnimarAlEntrar key={i} delay={i * 0.1}>
                  <FaqItem pregunta={pregunta} respuesta={respuesta} />
                </AnimarAlEntrar>
              ))}
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
            '@type': 'WebPage',
            name: 'Adventur Hoteles — Alojamiento en Cajamarca y todo el Perú',
            description: 'Encuentra los mejores hoteles en Cajamarca, Lima, Cusco, Arequipa y todo el Perú. Reserva directa por WhatsApp.',
            url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hoteles.adventur.pe',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: hoteles.length,
              itemListElement: hoteles.slice(0, 8).map((hotel, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Hotel',
                  name: hotel.nombre,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: hotel.ciudad,
                    addressCountry: 'PE',
                  },
                  starRating: {
                    '@type': 'Rating',
                    ratingValue: hotel.estrellas,
                  },
                },
              })),
            },
          }),
        }}
      />
    </>
  );
}

function FaqItem({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  return (
    <details className="card-premium !rounded-2xl group overflow-hidden border-none shadow-sm hover:shadow-md">
      <summary className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 cursor-pointer list-none font-bold text-[var(--brand-navy)] text-sm sm:text-base hover:text-[var(--brand-yellow)] transition-colors">
        {pregunta}
        <div className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] group-hover:bg-[var(--brand-yellow)]/10 flex items-center justify-center transition-colors shrink-0 ml-4">
          <ChevronDown size={18} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-300 group-hover:text-[var(--brand-yellow)]" aria-hidden="true" />
        </div>
      </summary>
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed border-t border-[var(--border-subtle)] pt-5 sm:pt-6">
        {respuesta}
      </div>
    </details>
  );
}
