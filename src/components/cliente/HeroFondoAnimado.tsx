'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

export const HERO_SLIDES = [
  { src: '/imagen1.jpg',  lugar: 'Máncora, Piura',      subtitulo: 'Playas paradisíacas del norte peruano' },
  { src: '/imagen2.jpg',  lugar: 'Cusco',                subtitulo: 'Historia y cultura en cada rincón' },
  { src: '/imagen3.avif', lugar: 'Cajamarca',            subtitulo: 'Tradición, gastronomía y naturaleza' },
  { src: '/imagen4.jpg',  lugar: 'Arequipa',             subtitulo: 'Arquitectura colonial y volcanes imponentes' },
  { src: '/imagen5.jpg',  lugar: 'Machu Picchu',         subtitulo: 'La ciudadela inca más famosa del planeta' },
  { src: '/imagen6.jpg',  lugar: 'Iquitos, Loreto',      subtitulo: 'Biodiversidad única en el mundo' },
  { src: '/imagen7.jpg',  lugar: 'Paracas, Ica',         subtitulo: 'Desierto, mar y fauna silvestre' },
  { src: '/imagen8.jpg',  lugar: 'Huaraz, Áncash',       subtitulo: 'Nevados y lagunas de altura' },
  { src: '/imagen9.jpg',  lugar: 'Tarapoto, San Martín', subtitulo: 'Naturaleza exuberante del oriente' },
  { src: '/imagen10.jpg', lugar: 'Lima',                 subtitulo: 'La mejor cocina de Latinoamérica' },
];

export const HERO_DURACION_SLIDE = 5000;

// ── Estado compartido con HeroCliente ────────────────────────────────────────
type CarruselState = {
  actual: number;
  pausado: boolean;
  irA: (i: number) => void;
  siguiente: () => void;
  anteriorSlide: () => void;
};

const listeners = new Set<(s: CarruselState) => void>();
let sharedState: CarruselState = {
  actual: 0,
  pausado: false,
  irA: () => {},
  siguiente: () => {},
  anteriorSlide: () => {},
};

function notificar(s: CarruselState) {
  sharedState = s;
  listeners.forEach(fn => fn(s));
}

export function useHeroCarrusel(): CarruselState {
  const [state, setState] = useState<CarruselState>(sharedState);
  useEffect(() => {
    listeners.add(setState);
    return () => { listeners.delete(setState); };
  }, []);
  return state;
}

// ── Componente ────────────────────────────────────────────────────────────────
export function HeroFondoAnimado() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const transitandoRef = useRef(false);

  const irA = useCallback((idx: number) => {
    if (transitandoRef.current || idx === actual) return;
    transitandoRef.current = true;
    setActual(idx);
    // Bloquear clicks rápidos 400ms
    setTimeout(() => { transitandoRef.current = false; }, 400);
  }, [actual]);

  const siguiente = useCallback(() => irA((actual + 1) % HERO_SLIDES.length), [actual, irA]);
  const anteriorSlide = useCallback(() => irA((actual - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [actual, irA]);

  // Publicar estado al hook
  useEffect(() => {
    notificar({ actual, pausado, irA, siguiente, anteriorSlide });
  }, [actual, pausado, irA, siguiente, anteriorSlide]);

  // Auto-advance
  useEffect(() => {
    if (pausado) return;
    timerRef.current = setTimeout(siguiente, HERO_DURACION_SLIDE);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [actual, pausado, siguiente]);

  // Swipe táctil
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPausado(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) siguiente();
      else anteriorSlide();
    }
    setPausado(false);
  };

  // Teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') anteriorSlide();
      if (e.key === 'ArrowRight') siguiente();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [siguiente, anteriorSlide]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides: solo opacity transition, sin scale ni transform */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0"
          style={{
            opacity: i === actual ? 1 : 0,
            transition: 'opacity 600ms ease',
            zIndex: i === actual ? 2 : 1,
          }}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            priority={i < 3}
            loading={i < 3 ? 'eager' : 'lazy'}
            sizes="100vw"
            aria-hidden="true"
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay fijo — sin animación */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'linear-gradient(to bottom, rgba(0,8,24,0.35) 0%, rgba(0,8,24,0.10) 35%, rgba(0,8,24,0.52) 75%, rgba(0,8,24,0.84) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'linear-gradient(105deg, rgba(0,8,24,0.45) 0%, transparent 55%)',
        }}
      />
    </div>
  );
}
