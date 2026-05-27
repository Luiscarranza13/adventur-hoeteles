'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight,
  Plane, MapPin, Building2, PartyPopper, GraduationCap, Hotel,
  Info, ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Servicio {
  Icon: LucideIcon;
  numero: string;
  titulo: string;
  desc: string;
  badge1: string;
  badge2: string;
}

const SERVICIOS: Servicio[] = [
  {
    Icon: Plane,
    numero: '01',
    titulo: 'Traslado al aeropuerto',
    desc: 'Llegamos a tiempo para llevarte o recogerte. Puntualidad garantizada las 24 horas del día, los 7 días de la semana. Servicio disponible en Lima y principales ciudades del Perú.',
    badge1: '24/7',
    badge2: 'Lima · AEP',
  },
  {
    Icon: MapPin,
    numero: '02',
    titulo: 'Viajes interprovinciales',
    desc: 'Viaja cómodo a cualquier provincia del Perú con conductor profesional. Cubrimos Ica, Cusco, Arequipa, Trujillo, Cajamarca y más destinos. Vehículos modernos y seguros.',
    badge1: 'Todo el Perú',
    badge2: 'Con conductor',
  },
  {
    Icon: Building2,
    numero: '03',
    titulo: 'Hospedaje corporativo',
    desc: 'Soluciones de alojamiento para empresas: ejecutivos, visitas de clientes y eventos corporativos. Facturación electrónica disponible. Tarifas especiales para grupos y estadías prolongadas.',
    badge1: 'Empresas',
    badge2: 'Factura',
  },
  {
    Icon: PartyPopper,
    numero: '04',
    titulo: 'Eventos especiales',
    desc: 'Bodas, quinceañeros, graduaciones y giras artísticas. Coordinamos alojamiento, traslados y logística completa para que tu evento sea memorable. Atención personalizada desde el primer contacto.',
    badge1: 'Premium',
    badge2: 'A medida',
  },
  {
    Icon: GraduationCap,
    numero: '05',
    titulo: 'Turismo escolar',
    desc: 'Paseos escolares y excursiones educativas con total seguridad. Grupos verificados, conductores certificados y coordinación con instituciones educativas. Precios especiales para colegios.',
    badge1: 'Seguro',
    badge2: 'Grupos',
  },
  {
    Icon: Hotel,
    numero: '06',
    titulo: 'Hoteles verificados',
    desc: 'Establecimientos certificados con habitaciones en óptimo estado para estadías cómodas y seguras. Todos nuestros hoteles pasan por un proceso de verificación de calidad antes de ser publicados.',
    badge1: 'Verificados',
    badge2: 'Modernos',
  },
];

const AUTO_DELAY = 4500;
const GAP = 16;

export function CarruselServicios() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);
  const [cardsVisible, setCardsVisible] = useState(3);
  const [paused, setPaused] = useState(false);
  const [abierto, setAbierto] = useState<string | null>(null);

  const total = SERVICIOS.length;

  useEffect(() => {
    const measure = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const w = container.clientWidth;
      if (w < 640) setCardsVisible(1);
      else if (w < 1024) setCardsVisible(2);
      else setCardsVisible(3);

      const firstCard = trackRef.current?.firstElementChild;
      if (firstCard instanceof HTMLElement) {
        setCardWidth(firstCard.getBoundingClientRect().width);
      }
    };
    measure();
    const t = setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  const STEP = cardWidth + GAP;
  const maxIndex = Math.max(0, total - cardsVisible);

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
    trackRef.current?.scrollTo({ left: clamped * STEP, behavior: 'smooth' });
  }, [maxIndex, STEP]);

  useEffect(() => {
    if (paused || abierto) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        trackRef.current?.scrollTo({ left: next * STEP, behavior: 'smooth' });
        return next;
      });
    }, AUTO_DELAY);
    return () => clearInterval(timer);
  }, [paused, abierto, maxIndex, STEP]);

  const onScroll = () => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / STEP);
    setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));
  };

  const toggleServicio = (numero: string) => {
    setAbierto(prev => prev === numero ? null : numero);
    setPaused(true);
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { if (!abierto) setPaused(false); }}
        className="flex overflow-x-auto snap-x snap-mandatory pb-2 pt-1 gap-4 [scrollbar-width:none]"
      >
        {SERVICIOS.map((servicio) => {
          const { Icon, numero, titulo, desc, badge1, badge2 } = servicio;
          const isOpen = abierto === numero;
          const panelId = `servicio-panel-${numero}`;

          return (
            <div
              key={numero}
              className="snap-start shrink-0 w-[calc(100vw-2rem)] max-w-[300px] sm:w-[calc((100%-1rem)/2)] sm:max-w-none lg:w-[calc((100%-2rem)/3)]"
            >
              {/* Tarjeta */}
              <button
                type="button"
                onClick={() => toggleServicio(numero)}
                aria-label={`${isOpen ? 'Cerrar' : 'Abrir'} servicio ${titulo}`}
                className={`w-full text-left relative overflow-hidden rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd600] group ${
                  isOpen
                    ? 'bg-[#001f3f] shadow-xl rounded-b-none'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#ffd600]/40'
                }`}
              >
                {/* Línea superior */}
                <div className={`absolute top-0 left-0 right-0 h-0.75 transition-all duration-300 ${
                  isOpen ? 'bg-[#ffd600]' : 'bg-transparent group-hover:bg-[#ffd600]/50'
                }`} />

                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? 'bg-[#ffd600] shadow-[0_8px_20px_rgba(255,214,0,0.3)]'
                        : 'bg-[#001f3f]/6 group-hover:bg-[#001f3f]'
                    }`}>
                      <Icon size={24} className={`transition-colors duration-200 ${
                        isOpen ? 'text-[#001f3f]' : 'text-[#001f3f] group-hover:text-[#ffd600]'
                      }`} aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black tabular-nums ${isOpen ? 'text-[#ffd600]/80' : 'text-gray-600'}`}>
                        {numero}
                      </span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#ffd600]/60' : 'text-gray-300'
                      }`} />
                    </div>
                  </div>

                  <h3 className={`font-bold text-base leading-snug mb-2 transition-colors duration-200 ${
                    isOpen ? 'text-white' : 'text-[#001f3f]'
                  }`}>
                    {titulo}
                  </h3>

                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 ${
                    isOpen ? 'text-[#ffd600]/90' : 'text-gray-700 group-hover:text-[#001f3f]'
                  }`}>
                    <Info size={10} />
                    {isOpen ? 'Cerrar' : 'Saber más'}
                  </div>
                </div>
              </button>

              {/* Panel expandible inline — debajo de la tarjeta, mismo ancho */}
              <div
                id={panelId}
                className={`grid transition-all duration-300 ease-in-out rounded-b-2xl ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100 bg-white border border-gray-200 border-t-0 shadow-[0_8px_24px_-4px_rgba(0,31,63,0.12)]'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4">
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{desc}</p>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#001f3f] text-[#ffd600]">
                        {badge1}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#ffd600]/15 text-[#001f3f]">
                        {badge2}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setPaused(true); scrollTo(i); }}
              aria-label={`Grupo ${i + 1}`}
              className={`rounded-full transition-all duration-300 w-6 h-6 ${
                i === activeIndex ? 'bg-[#001f3f]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setPaused(true); scrollTo(activeIndex - 1); }}
            disabled={activeIndex === 0}
            aria-label="Anterior"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#001f3f] hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => { setPaused(true); scrollTo(activeIndex + 1); }}
            disabled={activeIndex >= maxIndex}
            aria-label="Siguiente"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#001f3f] hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
