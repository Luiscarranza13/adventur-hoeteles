'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, BedDouble, ArrowRight } from 'lucide-react';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import type { DestinoProcedencia } from '@/lib/destinos';

interface SeccionProcedenciasProps {
  principales: DestinoProcedencia[];
  restantes: DestinoProcedencia[];
  whatsappNumero: string;
}

const GAP_PX = 24;

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
  // Siempre va a la página de hoteles filtrada por ciudad/destino
  const urlHoteles = `/hoteles?ciudad=${encodeURIComponent(destino.nombre)}`;
  const tieneImagen = !!destino.imagen_url;
  const imagenExterna = /^https?:\/\//.test(destino.imagen_url ?? '');

  // Silenciar warning de whatsappNumero no usado directamente aquí
  void whatsappNumero;

  return (
    <a
      href={urlHoteles}
      className="block h-full"
      aria-label={`Ver hoteles en ${destino.nombre}`}
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

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/65" />

        {/* Badge "Disponible" solo si tiene hoteles cargados */}
        {destino.hayOfertaDirecta && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-(--brand-yellow) px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-(--brand-navy) shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-(--brand-navy) animate-pulse" />
            Disponible
          </div>
        )}

        {/* Contenido inferior */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="max-w-[92%] mb-4">
            <p className="mb-1.5 text-[10px] font-black uppercase leading-none tracking-[0.26em] text-(--brand-yellow) drop-shadow">
              {destino.departamento}
            </p>
            <h3 className="text-2xl font-black leading-none text-white drop-shadow-md sm:text-3xl">
              {destino.nombre}
            </h3>
          </div>

          {/* Botón siempre igual para todos — va a /hoteles?ciudad=... */}
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-(--brand-yellow)/50 bg-(--brand-yellow) px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-(--brand-navy) shadow-lg transition-all duration-300 group-hover:gap-3 group-hover:shadow-[0_4px_16px_rgba(255,214,0,0.4)]">
            <BedDouble size={13} aria-hidden="true" />
            <span className="truncate">Ver hoteles</span>
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
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsVisible, setCardsVisible] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0); // solo para la barra de progreso
  const isJumping = useRef(false);

  const destinos = useMemo(() => [...principales, ...restantes], [principales, restantes]);
  const total = destinos.length;

  // Triplicamos los items: [copia | original | copia]
  // Empezamos en el bloque del medio para poder ir en ambas direcciones
  const tripled = useMemo(() => [...destinos, ...destinos, ...destinos], [destinos]);

  useEffect(() => {
    const measure = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const width = container.clientWidth;
      if (width < 640) {
        setCardsVisible(1);
        setCardWidth(Math.max(280, width - 32));
      } else if (width < 1024) {
        setCardsVisible(2);
        setCardWidth((width - GAP_PX) / 2);
      } else {
        setCardsVisible(3);
        setCardWidth((width - GAP_PX * 2) / 3);
      }
    };
    measure();
    const t = window.setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  const step = cardWidth + GAP_PX;

  // Al montar, posicionar en el bloque del medio (índice `total`)
  useEffect(() => {
    if (!trackRef.current || step === 0 || total === 0) return;
    const t = window.setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.scrollLeft = total * step;
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [step, total]);

  // Scroll a un índice dentro del triplicado
  const scrollToTripled = useCallback((idx: number, smooth = true) => {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({ left: idx * step, behavior: smooth ? 'smooth' : 'instant' });
  }, [step]);

  // Detectar cuando llegamos al borde y hacer el jump invisible
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || isJumping.current || step === 0 || total === 0) return;

    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Actualizar índice visual (relativo al bloque original)
    const rawIndex = Math.round(scrollLeft / step);
    const normalIndex = ((rawIndex % total) + total) % total;
    setDisplayIndex(normalIndex);

    // Si llegamos al último bloque (tercera copia), saltar al bloque del medio
    if (scrollLeft >= (total * 2) * step) {
      isJumping.current = true;
      track.scrollLeft = scrollLeft - total * step;
      window.requestAnimationFrame(() => { isJumping.current = false; });
      return;
    }

    // Si llegamos al primer bloque (primera copia), saltar al bloque del medio
    if (scrollLeft <= 0) {
      isJumping.current = true;
      track.scrollLeft = scrollLeft + total * step;
      window.requestAnimationFrame(() => { isJumping.current = false; });
      return;
    }

    // Silenciar warning de maxScroll no usado
    void maxScroll;
  }, [step, total]);

  const irAnterior = useCallback(() => {
    if (!trackRef.current || step === 0) return;
    const current = Math.round(trackRef.current.scrollLeft / step);
    scrollToTripled(current - 1);
  }, [step, scrollToTripled]);

  const irSiguiente = useCallback(() => {
    if (!trackRef.current || step === 0) return;
    const current = Math.round(trackRef.current.scrollLeft / step);
    scrollToTripled(current + 1);
  }, [step, scrollToTripled]);

  // Auto-avance
  useEffect(() => {
    if (isPaused || total <= cardsVisible) return;
    const timer = window.setInterval(irSiguiente, 2200);
    return () => window.clearInterval(timer);
  }, [isPaused, total, cardsVisible, irSiguiente]);

  const progreso = total > 0 ? ((displayIndex + cardsVisible) / total) * 100 : 100;

  if (!destinos.length) return null;

  return (
    <section id="destinos" className="section-padding bg-(--bg-base) scroll-mt-20 md:scroll-mt-24">
      <div className="container-site">

        {/* Encabezado */}
        <AnimarAlEntrar className="text-center mb-10 sm:mb-12">
          <p className="label-eyebrow mb-3">Dónde hospedarte</p>
          <h2 className="heading-section mb-3">Alojamiento en todo el Perú</h2>
          <div className="section-divider" />
          <p className="body-text max-w-2xl mx-auto mt-4">
            Selecciona tu destino y encuentra hotel al instante. Si ya tenemos habitaciones disponibles, te mostramos opciones directas; si no, te asesoramos por WhatsApp en minutos.
          </p>
        </AnimarAlEntrar>

        {/* Carrusel */}
        <AnimarAlEntrar>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Track — overflow hidden para que no se vean los clones */}
            <div className="overflow-hidden">
              <div
                ref={trackRef}
                onScroll={onScroll}
                className="flex gap-6 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollBehavior: 'auto' }}
              >
                {tripled.map((destino, i) => (
                  <div
                    key={`${destino.slug}-${i}`}
                    className="shrink-0"
                    style={{ width: `${cardWidth}px` }}
                    aria-hidden={i < total || i >= total * 2}
                  >
                    <TarjetaProcedencia destino={destino} whatsappNumero={whatsappNumero} />
                  </div>
                ))}
              </div>
            </div>

            {/* Flechas desktop */}
            <button
              type="button"
              onClick={irAnterior}
              aria-label="Destinos anteriores"
              className="absolute -left-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) shadow-md transition-all hover:border-(--brand-navy) hover:bg-(--brand-navy) hover:text-white md:flex"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={irSiguiente}
              aria-label="Destinos siguientes"
              className="absolute -right-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) shadow-md transition-all hover:border-(--brand-navy) hover:bg-(--brand-navy) hover:text-white md:flex"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>

            {/* Barra de progreso + flechas mobile */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-(--brand-navy) transition-all duration-500"
                    style={{ width: `${Math.min(progreso, 100)}%` }}
                  />
                </div>
                <span className="hidden min-w-max text-[10px] font-black uppercase tracking-widest text-(--text-muted) sm:inline">
                  {displayIndex + 1} / {total}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={irAnterior}
                  aria-label="Destinos anteriores"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) shadow-sm transition-all hover:bg-(--brand-navy) hover:text-white"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={irSiguiente}
                  aria-label="Destinos siguientes"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-(--brand-navy) shadow-sm transition-all hover:bg-(--brand-navy) hover:text-white"
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
