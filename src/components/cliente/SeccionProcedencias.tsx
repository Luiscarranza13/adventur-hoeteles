'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, BedDouble, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { crearUrlWhatsApp } from '@/lib/configuracion';
import type { DestinoProcedencia } from '@/lib/destinos';

interface SeccionProcedenciasProps {
  principales: DestinoProcedencia[];
  restantes: DestinoProcedencia[];
  whatsappNumero: string;
}

const GAP_PX = 24;

function hrefProcedencia(destino: DestinoProcedencia, whatsappNumero: string) {
  if (destino.hayOfertaDirecta) {
    return `/hoteles?ciudad=${encodeURIComponent(destino.nombre)}`;
  }
  return crearUrlWhatsApp(
    whatsappNumero,
    `Hola, quiero consultar alojamientos en ${destino.nombre}. ¿Tienen disponibilidad?`,
  );
}

function atributosLink(destino: DestinoProcedencia) {
  if (destino.hayOfertaDirecta) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

function gradienteRegion(departamento: string): string {
  const mapa: Record<string, string> = {
    'Cajamarca':    'from-amber-900   to-amber-700',
    'Cusco':        'from-stone-800    to-stone-600',
    'Lima':         'from-slate-800    to-slate-600',
    'Arequipa':     'from-orange-900   to-orange-700',
    'Loreto':       'from-green-900    to-green-700',
    'San Martín':   'from-emerald-900  to-emerald-700',
    'Piura':        'from-cyan-900     to-cyan-700',
    'Tumbes':       'from-sky-900      to-sky-700',
    'Puno':         'from-indigo-900   to-indigo-700',
    'Áncash':       'from-blue-900     to-blue-700',
    'Amazonas':     'from-teal-900     to-teal-700',
    'Ica':          'from-yellow-900   to-yellow-700',
  };
  return mapa[departamento] ?? 'from-(--brand-navy) to-(--brand-navy-light)';
}

function TarjetaProcedencia({
  destino,
  whatsappNumero,
}: {
  destino: DestinoProcedencia;
  whatsappNumero: string;
}) {
  const tieneImagen = !!destino.imagen_url;
  const imagenExterna = /^https?:\/\//.test(destino.imagen_url ?? '');

  return (
    <a
      href={hrefProcedencia(destino, whatsappNumero)}
      {...atributosLink(destino)}
      className="block h-full"
      aria-label={`${destino.nombre} — ${destino.hayOfertaDirecta ? 'Ver hoteles disponibles' : 'Consultar por WhatsApp'}`}
    >
      <article className="group relative h-72 overflow-hidden rounded-3xl border border-gray-200 bg-(--brand-navy) shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-(--brand-yellow)/60 sm:h-80">
        {tieneImagen ? (
          <Image
            src={destino.imagen_url!}
            alt={destino.nombre}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={imagenExterna}
          />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${gradienteRegion(destino.departamento)}`} />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent transition-all duration-500 group-hover:from-black/62" />

        {/* Badge disponible */}
        {destino.hayOfertaDirecta && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-(--brand-yellow) px-3 py-2 text-[9px] font-black uppercase tracking-widest text-(--brand-navy)">
            <span className="w-1.5 h-1.5 rounded-full bg-(--brand-navy) animate-pulse" />
            Disponible
          </div>
        )}

        {/* Ícono de pin para los que solo tienen WhatsApp */}
        {!destino.hayOfertaDirecta && (
          <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur-md">
            <MapPin size={16} aria-hidden="true" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="max-w-[92%]">
            <p className="mb-1.5 text-[10px] font-black uppercase leading-none tracking-[0.26em] text-(--brand-yellow) drop-shadow">
              {destino.departamento}
            </p>
            <h3 className="text-2xl font-black leading-none text-white drop-shadow-md sm:text-3xl">
              {destino.nombre}
            </h3>
          </div>
          <div className={`mt-4 inline-flex max-w-full items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.12em] backdrop-blur-md transition-all duration-300 group-hover:gap-3 ${
            destino.hayOfertaDirecta
              ? 'border-(--brand-yellow)/45 bg-(--brand-yellow) text-(--brand-navy)'
              : 'border-white/25 bg-black/30 text-white'
          }`}>
            {destino.hayOfertaDirecta ? <BedDouble size={13} aria-hidden="true" /> : <MessageCircle size={13} aria-hidden="true" />}
            <span className="truncate">
              {destino.hayOfertaDirecta ? 'Ver hoteles' : 'Consultar'}
            </span>
            <ArrowRight size={12} className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </div>
        </div>
      </article>
    </a>
  );
}

export function SeccionProcedencias({
  principales,
  restantes,
  whatsappNumero,
}: SeccionProcedenciasProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsVisible, setCardsVisible] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const destinos = useMemo(() => [...principales, ...restantes], [principales, restantes]);

  const conHoteles = destinos.filter(d => d.hayOfertaDirecta).length;
  const total = destinos.length;

  useEffect(() => {
    const measure = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const width = container.clientWidth;

      if (width < 640) {
        setCardsVisible(1);
        setCardWidth(Math.max(280, width - 32));
        return;
      }
      if (width < 1024) {
        setCardsVisible(2);
        setCardWidth((width - GAP_PX) / 2);
        return;
      }
      setCardsVisible(3);
      setCardWidth((width - GAP_PX * 2) / 3);
    };

    measure();
    const timer = window.setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const step = cardWidth + GAP_PX;
  const maxIndex = Math.max(0, total - cardsVisible);
  const progreso = maxIndex > 0 ? (activeIndex / maxIndex) * 100 : 100;

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
    trackRef.current?.scrollTo({ left: clamped * step, behavior: 'smooth' });
  }, [maxIndex, step]);

  useEffect(() => {
    if (isPaused || total <= cardsVisible) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = current >= maxIndex ? 0 : current + 1;
        trackRef.current?.scrollTo({ left: next * step, behavior: 'smooth' });
        return next;
      });
    }, 1800);

    return () => window.clearInterval(timer);
  }, [cardsVisible, isPaused, maxIndex, step, total]);

  const onScroll = () => {
    if (!trackRef.current) return;
    const next = Math.round(trackRef.current.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
  };

  if (!destinos.length) return null;

  return (
    <section id="destinos" className="section-padding bg-(--bg-base)">
      <div className="container-site">

        {/* Encabezado */}
        <AnimarAlEntrar className="text-center mb-10 sm:mb-12">
          <p className="label-eyebrow mb-3">Dónde hospedarte</p>
          <h2 className="heading-section mb-3">
            Alojamiento en todo el Perú
          </h2>
          <div className="section-divider" />
          <p className="body-text max-w-2xl mx-auto mt-4">
            Selecciona tu destino y encuentra hotel al instante. Si ya tenemos habitaciones disponibles, te mostramos opciones directas; si no, te asesoramos por WhatsApp en minutos.
          </p>

          {/* Estadísticas rápidas */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <div className="flex items-center gap-2 bg-(--brand-yellow) text-(--brand-navy) px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              <BedDouble size={13} aria-hidden="true" />
              {conHoteles} destinos con hoteles disponibles
            </div>
            <div className="flex items-center gap-2 bg-(--brand-navy) text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              <MapPin size={13} aria-hidden="true" />
              {total}+ destinos cubiertos
            </div>
          </div>
        </AnimarAlEntrar>

        {/* Carrusel */}
        <AnimarAlEntrar>
          <div
            className="relative"
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
          >
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto py-3 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {destinos.map((destino) => (
                <div
                  key={destino.slug}
                  className="snap-start shrink-0 w-(--card-w)"
                  style={{ '--card-w': `${cardWidth}px` } as React.CSSProperties}
                >
                  <TarjetaProcedencia
                    destino={destino}
                    whatsappNumero={whatsappNumero}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Destinos anteriores"
              className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) transition-all hover:border-(--brand-navy) hover:bg-(--brand-navy) hover:text-white disabled:pointer-events-none disabled:opacity-0 md:flex"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              aria-label="Destinos siguientes"
              className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) transition-all hover:border-(--brand-navy) hover:bg-(--brand-navy) hover:text-white disabled:pointer-events-none disabled:opacity-0 md:flex"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-(--brand-navy) transition-all duration-300 w-(--progress)"
                    style={{ '--progress': `${progreso}%` } as React.CSSProperties}
                  />
                </div>
                <span className="hidden min-w-max text-[10px] font-black uppercase tracking-widest text-(--text-muted) sm:inline">
                  {Math.min(activeIndex + cardsVisible, total)} / {total}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => scrollTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Destinos anteriores"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) shadow-sm transition-all hover:border-(--brand-navy) hover:bg-(--brand-navy) hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(activeIndex + 1)}
                  disabled={activeIndex >= maxIndex}
                  aria-label="Destinos siguientes"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) shadow-sm transition-all hover:border-(--brand-navy) hover:bg-(--brand-navy) hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </AnimarAlEntrar>

      </div>
    </section>
  );
}
