'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight,
  Plane, MapPin, Building2, PartyPopper, GraduationCap, Bus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Servicio {
  Icon: LucideIcon;
  titulo: string;
  desc: string;
  badge1: string;
  badge2: string;
  color: string;
}

const SERVICIOS: Servicio[] = [
  {
    Icon: Plane,
    titulo: 'Traslado al aeropuerto',
    desc: 'Llegamos a tiempo para llevarte o recogerte. Puntualidad garantizada las 24 horas.',
    badge1: 'Disponible 24/7',
    badge2: 'Lima → AEP',
    color: '#ffd600',
  },
  {
    Icon: MapPin,
    titulo: 'Viajes interprovinciales',
    desc: 'Viaja cómodo a cualquier provincia del Perú. Ica, Cusco, Arequipa, Trujillo y más.',
    badge1: 'Todo el Perú',
    badge2: 'Con conductor',
    color: '#ffd600',
  },
  {
    Icon: Building2,
    titulo: 'Hospedaje corporativo',
    desc: 'Soluciones de alojamiento para empresas: ejecutivos, visitas de clientes y eventos.',
    badge1: 'Empresas',
    badge2: 'Factura',
    color: '#ffd600',
  },
  {
    Icon: PartyPopper,
    titulo: 'Eventos especiales',
    desc: 'Bodas, quinceañeros, graduaciones, giras. Hacemos tu evento memorable.',
    badge1: 'Premium',
    badge2: 'A medida',
    color: '#ffd600',
  },
  {
    Icon: GraduationCap,
    titulo: 'Turismo escolar',
    desc: 'Paseos escolares y excursiones educativas con total seguridad. Grupos verificados.',
    badge1: 'Seguro',
    badge2: 'Grupos',
    color: '#ffd600',
  },
  {
    Icon: Bus,
    titulo: 'Hoteles verificados',
    desc: 'Establecimientos certificados con habitaciones en óptimo estado para estadías cómodas.',
    badge1: 'Verificados',
    badge2: 'Modernos',
    color: '#ffd600',
  },
];

const AUTO_DELAY = 3000;

export function CarruselServicios() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);
  const [cardsVisible, setCardsVisible] = useState(3);
  const [paused, setPaused] = useState(false);
  const GAP = 16;
  const total = SERVICIOS.length;

  useEffect(() => {
    const measure = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const width = container.clientWidth;
      
      if (width < 640) {
        setCardsVisible(1);
        setCardWidth(width - 32); // Deja un pequeño margen para ver la siguiente
      } else if (width < 1024) {
        setCardsVisible(2);
        setCardWidth((width - GAP) / 2);
      } else {
        setCardsVisible(3);
        setCardWidth((width - (GAP * 2)) / 3);
      }
    };
    
    measure();
    const timeoutId = setTimeout(measure, 100); // Asegurar medida tras render inicial
    window.addEventListener('resize', measure);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const STEP = cardWidth + GAP;
  const maxIndex = Math.max(0, total - cardsVisible);

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
    trackRef.current?.scrollTo({ left: clamped * STEP, behavior: 'smooth' });
  }, [maxIndex, STEP]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        trackRef.current?.scrollTo({ left: next * STEP, behavior: 'smooth' });
        return next;
      });
    }, AUTO_DELAY);
    return () => clearInterval(timer);
  }, [paused, maxIndex, STEP]);

  const onScroll = () => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / STEP);
    setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SERVICIOS.map(({ Icon, titulo, desc, badge1, badge2 }) => (
          <article
            key={titulo}
            className="snap-start shrink-0 flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 border border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            style={{ width: `${cardWidth}px` }}
          >
            {/* Decoración de fondo en hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ffd600]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-[#001f3f] group-hover:bg-[#ffd600] flex items-center justify-center mb-6 transition-colors duration-500 shadow-lg shrink-0 relative z-10">
              <Icon
                size={24}
                className="text-[#ffd600] group-hover:text-[#001f3f] transition-colors duration-500"
                aria-hidden="true"
              />
            </div>

            <h3 className="font-black text-[#001f3f] text-lg mb-3 relative z-10 leading-tight">
              {titulo}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6 relative z-10">
              {desc}
            </p>

            <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#001f3f]/5 text-[#001f3f]">
                {badge1}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#ffd600]/25 text-[#001f3f]">
                {badge2}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-1.5">
          {SERVICIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); scrollTo(i); }}
              aria-label={`Ir al servicio ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 h-2 bg-[#001f3f]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPaused(true); scrollTo(activeIndex - 1); }}
            disabled={activeIndex === 0}
            aria-label="Anterior servicio"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#001f3f] hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => { setPaused(true); scrollTo(activeIndex + 1); }}
            disabled={activeIndex >= total - 1}
            aria-label="Siguiente servicio"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#001f3f] hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
