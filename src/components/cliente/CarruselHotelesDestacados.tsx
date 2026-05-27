'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, MessageCircle, Star, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { HotelConPrecio } from '@/lib/hoteles-consultas';
import { ImagenSegura } from '@/components/ui/ImagenSegura';

interface Props {
  hoteles: HotelConPrecio[];
}

// ── Contador animado ──────────────────────────────────────────────────────────
function ContadorAnimado({ valor, sufijo = '' }: { valor: number | string; sufijo?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animado = useRef(false);

  useEffect(() => {
    if (typeof valor !== 'number') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animado.current) {
          animado.current = true;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * valor));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [valor]);

  if (typeof valor === 'string') return <span>{valor}</span>;
  return <span ref={ref}>{display}{sufijo}</span>;
}

// ── Badge de hotel ────────────────────────────────────────────────────────────
function BadgeHotel({ hotel, ahora }: { hotel: HotelConPrecio; ahora: number }) {
  const esNuevo = hotel.fechaCreacion
    ? (ahora - new Date(hotel.fechaCreacion).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;

  if (esNuevo) {
    return (
      <span className="flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
        <Sparkles size={9} />
        Nuevo
      </span>
    );
  }
  if (hotel.estrellas >= 4) {
    return (
      <span className="flex items-center gap-1 bg-(--brand-yellow) text-(--brand-navy) text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
        <TrendingUp size={9} />
        Popular
      </span>
    );
  }
  return null;
}

// ── Tarjeta móvil (width variable para carrusel) ─────────────────────────────
function TarjetaHotel({ hotel, index, ahora }: { hotel: HotelConPrecio; index: number; ahora: number }) {
  return (
    <Link href={`/hoteles/${hotel.id}`} className="block group shrink-0 snap-start" style={{ width: 'var(--card-w)' }}>
      <article className="card-premium h-full flex flex-col">
        <div className="relative h-44 sm:h-48 bg-(--brand-navy) overflow-hidden shrink-0 rounded-t-2xl">
          {hotel.imagenesUrls[0] ? (
            <ImagenSegura
              src={hotel.imagenesUrls[0]}
              alt={`Hotel ${hotel.nombre} en ${hotel.ciudad}`}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
              priority={index < 4}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Star size={32} className="text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          {hotel.precioMinimo && (
            <div className="absolute bottom-3 left-3 z-10">
              <p className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none mb-0.5">Desde</p>
              <p className="text-white font-black text-lg leading-none drop-shadow-md">S/{hotel.precioMinimo}</p>
            </div>
          )}
          <div className="absolute top-3 right-3 z-10"><BadgeHotel hotel={hotel} ahora={ahora} /></div>
          <div className="absolute top-3 left-3 z-10 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
            {Array.from({ length: hotel.estrellas }).map((_, j) => (
              <Star key={j} size={10} className="text-amber-400 fill-amber-400" aria-hidden="true" />
            ))}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="heading-card mb-1.5 group-hover:text-(--brand-yellow) transition-colors line-clamp-2 text-sm font-bold">{hotel.nombre}</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin size={12} className="text-(--brand-yellow) shrink-0" aria-hidden="true" />
            <span className="text-(--text-secondary) text-xs font-semibold truncate">{hotel.ciudad}</span>
            {hotel.tipoAlojamiento && (
              <span className="text-(--text-muted) text-[10px] truncate">· {hotel.tipoAlojamiento}</span>
            )}
          </div>
          <div className="mt-auto">
            <div className="btn-primary !w-full !py-2.5 !text-xs group-hover:bg-(--brand-yellow-light)">
              <MessageCircle size={14} aria-hidden="true" />
              <span>Reservar ahora</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Tarjeta desktop (width 100% de su celda del grid) ─────────────────────────
function TarjetaHotelDesktop({ hotel, index, ahora }: { hotel: HotelConPrecio; index: number; ahora: number }) {
  return (
    <Link href={`/hoteles/${hotel.id}`} className="block group w-full">
      <article className="card-premium h-full flex flex-col">
        <div className="relative h-44 sm:h-48 bg-(--brand-navy) overflow-hidden shrink-0 rounded-t-2xl">
          {hotel.imagenesUrls[0] ? (
            <ImagenSegura
              src={hotel.imagenesUrls[0]}
              alt={`Hotel ${hotel.nombre} en ${hotel.ciudad}`}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              priority={index < 4}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Star size={32} className="text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          {hotel.precioMinimo && (
            <div className="absolute bottom-3 left-3 z-10">
              <p className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none mb-0.5">Desde</p>
              <p className="text-white font-black text-lg leading-none drop-shadow-md">S/{hotel.precioMinimo}</p>
            </div>
          )}
          <div className="absolute top-3 right-3 z-10"><BadgeHotel hotel={hotel} ahora={ahora} /></div>
          <div className="absolute top-3 left-3 z-10 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
            {Array.from({ length: hotel.estrellas }).map((_, j) => (
              <Star key={j} size={10} className="text-amber-400 fill-amber-400" aria-hidden="true" />
            ))}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="heading-card mb-1.5 group-hover:text-(--brand-yellow) transition-colors line-clamp-2 text-sm font-bold">{hotel.nombre}</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin size={12} className="text-(--brand-yellow) shrink-0" aria-hidden="true" />
            <span className="text-(--text-secondary) text-xs font-semibold truncate">{hotel.ciudad}</span>
            {hotel.tipoAlojamiento && (
              <span className="text-(--text-muted) text-[10px] truncate">· {hotel.tipoAlojamiento}</span>
            )}
          </div>
          <div className="mt-auto">
            <div className="btn-primary !w-full !py-2.5 !text-xs group-hover:bg-(--brand-yellow-light)">
              <MessageCircle size={14} aria-hidden="true" />
              <span>Reservar ahora</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function CarruselHotelesDestacados({ hoteles }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [ahora] = useState(() => Date.now());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(idx, hoteles.length - 1));
    setActiveIndex(clamped);
    const card = track.children[clamped] as HTMLElement;
    if (card) {
      track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    }
  }, [hoteles.length]);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - scrollLeft - 16);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }, []);

  // Desktop: grid real. Mobile: carrusel horizontal con snap
  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {hoteles.map((hotel, i) => (
          <TarjetaHotelDesktop key={hotel.id} hotel={hotel} index={i} ahora={ahora} />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-10">
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-4"
        style={{
          scrollbarWidth: 'none',
          // CSS variable para el ancho de tarjeta
          ['--card-w' as string]: 'min(80vw, 300px)',
        }}
      >
        {hoteles.map((hotel, i) => (
          <TarjetaHotel key={hotel.id} hotel={hotel} index={i} ahora={ahora} />
        ))}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between px-4 mt-2">
        <div className="flex items-center gap-1.5">
          {hoteles.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Hotel ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 7,
                height: 7,
                background: i === activeIndex ? 'var(--brand-navy)' : '#d1d5db',
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Anterior"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-(--brand-navy) hover:bg-(--brand-navy) hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={activeIndex >= hoteles.length - 1}
            aria-label="Siguiente"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-(--brand-navy) hover:bg-(--brand-navy) hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Exportar ContadorAnimado para uso en page.tsx
export { ContadorAnimado };
