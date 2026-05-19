'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { Resena } from '@/lib/resenas-consultas';

interface Props {
  resenas: Resena[];
}

const GAP = 16;
const AUTO_DELAY = 6000;

const FUENTE_LABEL: Record<string, string> = {
  google: 'Google',
  tripadvisor: 'TripAdvisor',
  booking: 'Booking.com',
  adventur: 'Adventur',
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
}

function InicialAvatar({ nombre, color }: { nombre: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
      style={{ background: color }}
      aria-hidden="true"
    >
      {nombre.charAt(0).toUpperCase()}
    </div>
  );
}

const COLORES = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'];

export function CarruselResenas({ resenas }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsVisible, setCardsVisible] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = resenas.length;

  useEffect(() => {
    const measure = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const w = container.clientWidth;
      if (w < 640) { setCardsVisible(1); setCardWidth(w - 32); }
      else if (w < 1024) { setCardsVisible(2); setCardWidth((w - GAP) / 2); }
      else { setCardsVisible(3); setCardWidth((w - GAP * 2) / 3); }
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
    if (paused || total <= cardsVisible) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        trackRef.current?.scrollTo({ left: next * STEP, behavior: 'smooth' });
        return next;
      });
    }, AUTO_DELAY);
    return () => clearInterval(timer);
  }, [paused, maxIndex, STEP, total, cardsVisible]);

  const onScroll = () => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / STEP);
    setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));
  };

  if (!resenas.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory pb-2 pt-1"
        style={{ scrollbarWidth: 'none', gap: `${GAP}px` }}
      >
        {resenas.map((r, i) => {
          const color = COLORES[i % COLORES.length];
          return (
            <article
              key={r.id}
              className="snap-start shrink-0 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-md hover:border-[#ffd600]/30 transition-all duration-200 flex flex-col gap-4"
              style={{ width: `${cardWidth}px` }}
            >
              {/* Cabecera: estrellas + fuente */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s < r.calificacion ? 'fill-[#ffd600] text-[#ffd600]' : 'fill-gray-200 text-gray-200'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-[#001f3f]/5 text-[#001f3f]/50">
                  {FUENTE_LABEL[r.fuente] ?? r.fuente}
                </span>
              </div>

              {/* Comentario */}
              <div className="relative flex-1">
                <Quote
                  size={24}
                  className="absolute -top-1 -left-1 text-[#ffd600]/25 fill-[#ffd600]/25"
                  aria-hidden="true"
                />
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 pl-1">
                  {r.comentario}
                </p>
              </div>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <InicialAvatar nombre={r.nombre_revisor} color={color} />
                <div className="min-w-0">
                  <p className="text-[#001f3f] font-bold text-sm leading-snug truncate">{r.nombre_revisor}</p>
                  <p className="text-gray-400 text-xs">
                    {r.origen ? `${r.origen} · ` : ''}{formatearFecha(r.fecha)}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Controles */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setPaused(true); scrollTo(i); }}
                aria-label={`Grupo ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  background: i === activeIndex ? '#001f3f' : '#d1d5db',
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPaused(true); scrollTo(activeIndex - 1); }}
              disabled={activeIndex === 0}
              aria-label="Anterior"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#001f3f] hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => { setPaused(true); scrollTo(activeIndex + 1); }}
              disabled={activeIndex >= maxIndex}
              aria-label="Siguiente"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#001f3f] hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
