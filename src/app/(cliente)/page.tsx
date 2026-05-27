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
import { crearUrlWhatsApp } from '@/lib/configuracion';
import { getPublicEnv } from '@/lib/env';
import { Metadata } from 'next';
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
  const whatsappViaje = crearUrlWhatsApp(configuracion.whatsapp_numero, 'Hola, quiero planificar mi viaje por el Perú.');

  return (
    <>
      <Header />
      <main>

        <section id="inicio" className="relative min-h-[calc(100svh-57px)] flex flex-col bg-black overflow-hidden scroll-mt-40 sm:scroll-mt-48" style={{ isolation: 'isolate' }}>
          <HeroFondoAnimado />
          <HeroCliente totalHoteles={hoteles.length} totalCiudades={departamentos.length || ciudades.length} ciudadesDisponibles={ciudades} />
        </section>

        <section id="hoteles" className="section-padding bg-white scroll-mt-40 sm:scroll-mt-48">
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
                <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-(--border-base) bg-white px-6 py-8 text-center shadow-sm sm:px-10">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-(--brand-yellow)">
                    Aún no hay ofertas destacadas
                  </p>
                  <h3 className="mb-3 text-xl font-black leading-tight text-(--brand-navy) sm:text-2xl">
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

        <section id="servicios" className="section-padding bg-(--bg-base) scroll-mt-40 sm:scroll-mt-48">
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

        <section className="section-padding bg-white relative overflow-hidden">
          <div className="container-site relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
              <AnimarAlEntrar>
                <p className="label-eyebrow mb-4">Seguridad Total</p>
                <h2 className="heading-section mb-6">
                  Viaja con seguridad y el confort que mereces
                </h2>
                <p className="body-text text-base sm:text-lg leading-relaxed mb-8">
                  En Adventur ofrecemos hoteles verificados con la misma calidad que esperas de un operador nacional: establecimientos seguros, habitaciones modernas y atención coordinada.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Hoteles verificados con licencia vigente y experiencia comprobada',
                    'Habitaciones modernas con mantenimiento preventivo al día',
                    'Asistencia personalizada disponible las 24 horas del día',
                  ].map((texto) => (
                    <div key={texto} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="w-7 h-7 rounded-full bg-(--brand-yellow) flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} className="text-(--brand-navy)" aria-hidden="true" />
                      </div>
                      <p className="text-(--brand-navy) text-sm sm:text-base font-semibold leading-relaxed">{texto}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/hoteles"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-(--brand-navy) px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-(--brand-navy-light)"
                >
                  Ver hoteles verificados
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </AnimarAlEntrar>

              <AnimarAlEntrar delay={0.2}>
                <Link
                  href="/hoteles"
                  className="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative h-[260px] overflow-hidden bg-slate-100 sm:h-[320px] lg:h-[360px]">
                    {hoteles[1]?.imagenesUrls[0] ? (
                      <ImagenSegura
                        src={hoteles[1].imagenesUrls[0]}
                        alt="Hotel seguro y confortable"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        fit="cover"
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <div className="text-center">
                          <Shield size={64} className="text-(--brand-navy)/20 mx-auto mb-4" aria-hidden="true" />
                          <p className="text-(--brand-navy)/40 text-lg font-bold">Adventur Hoteles</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-(--brand-navy)/85 via-(--brand-navy)/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-(--brand-yellow)">
                        Hoteles verificados
                      </p>
                      <h3 className="text-2xl font-black leading-tight text-white">
                        Reserva con confianza y atención directa
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 sm:p-5">
                    {[
                      { n: hoteles.length, sufijo: '+', label: 'Hoteles' },
                      { n: departamentos.length || ciudades.length, sufijo: '', label: 'Cobertura' },
                      { n: 0, sufijo: '%', label: 'Comisión' },
                    ].map(({ n, sufijo, label }) => (
                      <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-(--brand-navy) font-black text-xl sm:text-2xl leading-none mb-1">
                          <ContadorAnimado valor={n || 10} sufijo={sufijo} />
                        </p>
                        <p className="text-(--brand-yellow) text-[8px] sm:text-[10px] font-black uppercase tracking-[0.14em]">{label}</p>
                      </div>
                    ))}
                  </div>
                </Link>
              </AnimarAlEntrar>
            </div>
          </div>
        </section>

        <section className="relative bg-white py-12 sm:py-16 lg:py-20">
          <div className="container-site">
            <AnimarAlEntrar>
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group">
                
                <div className="absolute inset-0 z-0 bg-[#001f3f]">
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-75"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  >
                    <source src="/fondo.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-linear-to-r from-[#001f3f]/95 via-[#001f3f]/78 md:via-[#001f3f]/52 to-[#001f3f]/10" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#001f3f]/80 via-transparent to-black/10" />
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
                      Vive la magia <br className="hidden md:block"/>del <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">PERÚ</span>
                    </h2>
                    
                    <p className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed mb-6 sm:mb-8 text-center md:text-left drop-shadow-sm">
                      Desde los imponentes Andes hasta la belleza de la costa. Recorre los rincones más mágicos del país descansando en hoteles verificados, seguros y diseñados para brindarte el máximo confort.
                    </p>
                    
                    <a
                      href={whatsappViaje}
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

        <section className="section-padding bg-(--bg-subtle)">
          <div className="container-site">
            <div className="rounded-[2rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:px-8 lg:px-10">
              <AnimarAlEntrar className="mb-8 text-center">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Lo que dicen nuestros viajeros
                </h2>
              </AnimarAlEntrar>
              <AnimarAlEntrar delay={0.1}>
                <CarruselTestimonios />
              </AnimarAlEntrar>
            </div>
          </div>
        </section>

        <section id="preguntas-frecuentes" className="section-padding bg-(--bg-subtle) scroll-mt-40 sm:scroll-mt-48">
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
      <summary className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 cursor-pointer list-none font-bold text-(--brand-navy) text-sm sm:text-base transition-colors">
        <span className="pr-4">{pregunta}</span>
        <div className="w-8 h-8 rounded-full bg-(--bg-subtle) group-hover:bg-(--brand-yellow)/15 group-open:bg-(--brand-navy) flex items-center justify-center transition-all shrink-0">
          <ChevronDown size={16} className="text-(--text-muted) group-open:rotate-180 group-open:text-white transition-all duration-300" aria-hidden="true" />
        </div>
      </summary>
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-(--text-secondary) text-sm sm:text-base leading-relaxed border-t border-(--border-subtle) pt-5 sm:pt-6">
        {respuesta}
      </div>
    </details>
  );
}
