import { Header, Footer } from '@/components/layout/Header';
import { CarruselServicios } from '@/components/cliente/CarruselServicios';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { HeroCliente } from '@/components/cliente/HeroCliente';
import { HeroFondoAnimado } from '@/components/cliente/HeroFondoAnimado';
import { SeccionProcedencias } from '@/components/cliente/SeccionProcedencias';
import { CarruselHotelesDestacados, ContadorAnimado } from '@/components/cliente/CarruselHotelesDestacados';
import { SeccionPorQueElegirnos } from '@/components/cliente/SeccionPorQueElegirnos';
import { CarruselTestimonios } from '@/components/cliente/CarruselTestimonios';
import { obtenerDestinos, prepararProcedencias } from '@/lib/destinos';
import { obtenerCiudadesConHoteles, listarHotelesActivos, anexarPreciosMinimos } from '@/lib/hoteles-consultas';
import { obtenerConfiguracionPublica } from '@/lib/configuracion-consultas';
import { getPublicEnv } from '@/lib/env';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle, Shield, ArrowRight,
  CheckCircle2, ChevronDown,
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

// Revalidar la página cada 5 minutos
export const revalidate = 300;

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
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  const [hoteles, destinos, configuracion] = await Promise.all([
    listarHotelesActivos(),
    obtenerDestinos(),
    obtenerConfiguracionPublica(),
  ]);
  const ciudades = obtenerCiudadesConHoteles(hoteles);
  const { departamentos, principales: destinosPrincipales, restantes: destinosRestantes } =
    prepararProcedencias(destinos, ciudades);

  // Paralelizar la query de precios con el resto del procesamiento
  const hotelesConPrecio = await anexarPreciosMinimos(hoteles.slice(0, 8));

  return (
    <>
      <Header />
      <main>

        <section id="inicio" className="relative min-h-[calc(100svh-57px)] flex flex-col bg-black overflow-hidden scroll-mt-40 sm:scroll-mt-48" style={{ isolation: 'isolate' }}>
          <HeroFondoAnimado />
          <HeroCliente totalHoteles={hoteles.length} totalCiudades={departamentos.length || ciudades.length} ciudadesDisponibles={ciudades} />
        </section>

        <section id="hoteles" className="section-padding bg-[var(--bg-subtle)] scroll-mt-40 sm:scroll-mt-48">
          <div className="container-site">
            <AnimarAlEntrar className="text-center mb-10">
              <p className="label-eyebrow mb-3">Selección Exclusiva</p>
              <h2 className="heading-section mb-3">
                Hoteles Destacados
              </h2>
              <div className="section-divider" />
              <p className="body-text max-w-2xl mx-auto mt-4">
                Seleccionamos los mejores alojamientos para garantizar tu confort: desde hostales acogedores hasta hoteles de lujo.
              </p>
            </AnimarAlEntrar>

            {hotelesConPrecio.length > 0 ? (
              <>
                <CarruselHotelesDestacados hoteles={hotelesConPrecio} />

                <div className="text-center mt-6">
                  <Link href="/hoteles" className="btn-secondary">
                    Ver hoteles <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </>
            ) : (
              <AnimarAlEntrar>
                <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-[var(--border-base)] bg-white px-6 py-8 text-center shadow-sm sm:px-10">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
                    Aún no hay ofertas destacadas
                  </p>
                  <h3 className="mb-3 text-xl font-black leading-tight text-[var(--brand-navy)] sm:text-2xl">
                    Revisa todos los hoteles disponibles
                  </h3>
                  <p className="body-text mb-6 max-w-xl">
                    Estamos preparando promociones destacadas. Mientras tanto, puedes ver la lista completa de hoteles activos.
                  </p>
                  <Link href="/hoteles" className="btn-secondary">
                    Ver hoteles <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </AnimarAlEntrar>
            )}
          </div>
        </section>

        <SeccionProcedencias
          principales={destinosPrincipales}
          restantes={destinosRestantes}
          whatsappNumero={configuracion.whatsapp_numero}
        />

        <section id="servicios" className="section-padding bg-[var(--bg-base)] scroll-mt-40 sm:scroll-mt-48">
          <div className="container-site">
            <AnimarAlEntrar className="text-center mb-14">
              <p className="label-eyebrow mb-3">Nuestros Servicios</p>
              <h2 className="heading-section mb-3">
                Servicios de hospedaje en Cajamarca y todo el Perú
              </h2>
              <div className="section-divider" />
              <p className="body-text max-w-3xl mx-auto mt-4">
                Traslados al aeropuerto, hospedaje corporativo y atención personalizada. Misma exigencia de calidad y seguridad en cada destino.
              </p>
            </AnimarAlEntrar>

            <CarruselServicios />
          </div>
        </section>

        <section className="section-padding bg-[var(--brand-navy)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--brand-yellow)]/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[80px] pointer-events-none" />
          <div className="container-site relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
              <AnimarAlEntrar>
                <p className="label-eyebrow mb-4">Seguridad Total</p>
                <h2 className="heading-section-light mb-6">
                  Viaja con seguridad y el confort que mereces
                </h2>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10">
                  En Adventur ofrecemos hoteles verificados con la misma calidad que esperas de un operador nacional: establecimientos seguros, habitaciones modernas y atención coordinada.
                </p>

                <div className="space-y-5">
                  {[
                    'Hoteles verificados con licencia vigente y experiencia comprobada',
                    'Habitaciones modernas con mantenimiento preventivo al día',
                    'Asistencia personalizada disponible las 24 horas del día',
                  ].map((texto) => (
                    <div key={texto} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-[var(--brand-yellow)]/15 border border-[var(--brand-yellow)]/25 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{texto}</p>
                    </div>
                  ))}
                </div>
              </AnimarAlEntrar>

              <AnimarAlEntrar delay={0.2}>
                <div className="relative h-[300px] sm:h-[360px] lg:h-[400px] rounded-3xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] group bg-white">
                  {hoteles[1]?.imagenesUrls[0] ? (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100" />
                      <ImagenSegura
                        src={hoteles[1].imagenesUrls[0]}
                        alt="Hotel seguro y confortable"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        fit="contain"
                        className="p-8 sm:p-16 group-hover:scale-105 transition-transform duration-1000 relative z-10"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--brand-navy-light)]">
                      <div className="text-center">
                        <Shield size={64} className="text-[var(--brand-yellow)]/30 mx-auto mb-4" aria-hidden="true" />
                        <p className="text-white/30 text-lg font-bold">Adventur Hoteles</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-20">
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {[
                        { n: hoteles.length, sufijo: '+', label: 'Hoteles' },
                        { n: departamentos.length || ciudades.length, sufijo: '', label: 'Cobertura' },
                        { n: 0, sufijo: '%', label: 'Comisión' },
                      ].map(({ n, sufijo, label }) => (
                        <div key={label} className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1 transition-transform duration-500">
                          <p className="text-[var(--brand-navy)] font-black text-xl sm:text-2xl leading-none mb-1 sm:mb-2">
                            <ContadorAnimado valor={n || 10} sufijo={sufijo} />
                          </p>
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

        <section className="relative py-12 sm:py-16 lg:py-20">
          <div className="container-site">
            <AnimarAlEntrar>
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group">
                
                {/* Imagen de fondo contenida */}
                <div className="absolute inset-0 z-0 bg-[#001f3f]">
                  <Image
                    src="/imagen1.jpg"
                    alt="Paisaje majestuoso del Perú"
                    fill
                    loading="eager"
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

        <SeccionPorQueElegirnos />

        <section className="section-padding bg-[var(--brand-navy)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--brand-yellow)]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="container-site relative z-10 max-w-3xl">
            <AnimarAlEntrar className="text-center mb-12">
              <p className="label-eyebrow mb-3">Lo que dicen nuestros viajeros</p>
              <h2 className="heading-section-light mb-3">Testimonios reales</h2>
              <div className="w-12 h-0.5 bg-[var(--brand-yellow)] mx-auto" />
            </AnimarAlEntrar>
            <AnimarAlEntrar delay={0.1}>
              <CarruselTestimonios />
            </AnimarAlEntrar>
          </div>
        </section>

        <section id="preguntas-frecuentes" className="section-padding bg-[var(--bg-subtle)] scroll-mt-40 sm:scroll-mt-48">
          <div className="container-site max-w-4xl">
            <AnimarAlEntrar className="text-center mb-14">
              <p className="label-eyebrow mb-3">Resolvemos tus dudas</p>
              <h2 className="heading-section mb-3">
                Preguntas frecuentes
              </h2>
              <div className="section-divider" />
              <p className="body-text max-w-2xl mx-auto mt-4">
                Todo lo que necesitas saber sobre documentos, privacidad y modalidad de servicio para tu próxima estadía.
              </p>
            </AnimarAlEntrar>

            <div className="space-y-3">
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
            url: siteUrl,
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
    <details className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md group overflow-hidden transition-all duration-300 hover:border-[#ffd600]/30">
      <summary className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 cursor-pointer list-none font-bold text-[var(--brand-navy)] text-sm sm:text-base transition-colors">
        <span className="pr-4">{pregunta}</span>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] group-hover:bg-[var(--brand-yellow)]/15 group-open:bg-[var(--brand-navy)] flex items-center justify-center transition-all shrink-0">
          <ChevronDown size={16} className="text-[var(--text-muted)] group-open:rotate-180 group-open:text-white transition-all duration-300" aria-hidden="true" />
        </div>
      </summary>
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed border-t border-[var(--border-subtle)] pt-5 sm:pt-6">
        {respuesta}
      </div>
    </details>
  );
}
