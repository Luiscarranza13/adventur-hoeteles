'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface Testimonio {
  nombre: string;
  origen: string;
  calificacion: number;
  texto: string;
  inicial: string;
  color: string;
}

const TESTIMONIOS: Testimonio[] = [
  {
    nombre: 'María García',
    origen: 'Lima',
    calificacion: 5,
    texto: 'Reservé el hotel en Cajamarca por WhatsApp y en menos de 5 minutos tenía la confirmación. Sin formularios, sin comisiones, trato directo. Nunca había sido tan fácil planificar un viaje.',
    inicial: 'M',
    color: '#3B82F6',
  },
  {
    nombre: 'Roberto Sánchez',
    origen: 'Trujillo',
    calificacion: 5,
    texto: 'Llegué al hotel y todo estuvo exactamente como me lo describieron: limpio, cómodo y en perfecto estado. Adventur realmente verifica los hoteles. Una tranquilidad enorme para el viajero.',
    inicial: 'R',
    color: '#8B5CF6',
  },
  {
    nombre: 'Lucía Torres',
    origen: 'Arequipa',
    calificacion: 5,
    texto: 'El precio que vi fue el que pagué, sin sorpresas. Ahorré comparado con otras plataformas porque no hay comisiones. La atención fue personalizada y me ayudaron a elegir el hotel ideal para mi familia.',
    inicial: 'L',
    color: '#EC4899',
  },
  {
    nombre: 'Carlos Mendoza',
    origen: 'Chiclayo',
    calificacion: 5,
    texto: 'Organicé el viaje de toda la familia a Cajamarca para el Carnaval. Adventur nos consiguió habitaciones en el mejor hotel de la ciudad con disponibilidad inmediata. Servicio increíble.',
    inicial: 'C',
    color: '#10B981',
  },
  {
    nombre: 'Ana Rodríguez',
    origen: 'Cusco',
    calificacion: 5,
    texto: 'Primera vez viajando sola a Cajamarca. Me orientaron sobre qué hotel elegir según mi presupuesto y me sentí completamente segura. Los hoteles verificados de Adventur son una garantía real.',
    inicial: 'A',
    color: '#F59E0B',
  },
];

const AUTO_DELAY = 5000;

export function CarruselTestimonios() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIOS.length;

  const scrollTo = useCallback((index: number) => {
    const clamped = ((index % total) + total) % total;
    setActiveIndex(clamped);
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % total;
        const track = trackRef.current;
        if (track) track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
        return next;
      });
    }, AUTO_DELAY);
    return () => clearInterval(timer);
  }, [paused, total]);

  const onScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, clientWidth } = trackRef.current;
    const idx = Math.round(scrollLeft / clientWidth);
    setActiveIndex(Math.max(0, Math.min(idx, total - 1)));
  };

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
      >
        {TESTIMONIOS.map((t, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-full px-2 sm:px-4"
          >
            <div className="max-w-2xl mx-auto">
              {/* Estrellas */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: t.calificacion }).map((_, s) => (
                  <Star key={s} size={18} className="fill-[#ffd600] text-[#ffd600]" aria-hidden="true" />
                ))}
              </div>

              {/* Cita */}
              <div className="relative">
                <Quote
                  size={40}
                  className="absolute -top-2 -left-2 text-[#ffd600]/20 fill-[#ffd600]/20"
                  aria-hidden="true"
                />
                <blockquote className="text-center text-base sm:text-lg lg:text-xl text-white leading-relaxed font-medium px-6 sm:px-8 relative z-10">
                  &ldquo;{t.texto}&rdquo;
                </blockquote>
              </div>

              {/* Autor */}
              <div className="flex items-center justify-center gap-3 mt-8">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base shrink-0"
                  style={{ background: t.color }}
                  aria-hidden="true"
                >
                  {t.inicial}
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">{t.nombre}</p>
                  <p className="text-gray-400 text-xs">{t.origen}, Perú</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {TESTIMONIOS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPaused(true); scrollTo(i); }}
            aria-label={`Testimonio ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              background: i === activeIndex ? '#ffd600' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Flechas */}
      <button
        onClick={() => { setPaused(true); scrollTo(activeIndex - 1); }}
        aria-label="Anterior testimonio"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-4 w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all duration-200"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => { setPaused(true); scrollTo(activeIndex + 1); }}
        aria-label="Siguiente testimonio"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-4 w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all duration-200"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
