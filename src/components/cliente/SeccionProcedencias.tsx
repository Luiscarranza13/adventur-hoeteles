'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { crearUrlWhatsApp } from '@/lib/configuracion';
import type { DestinoProcedencia } from '@/lib/destinos';

interface SeccionProcedenciasProps {
  principales: DestinoProcedencia[];
  restantes: DestinoProcedencia[];
  whatsappNumero: string;
}

const GAP = 18;

function hrefProcedencia(destino: DestinoProcedencia, whatsappNumero: string) {
  if (destino.hayOfertaDirecta) {
    return `/hoteles?ciudad=${encodeURIComponent(destino.nombre)}`;
  }

  return crearUrlWhatsApp(
    whatsappNumero,
    `Hola, vengo de ${destino.nombre} y quiero consultar alojamientos disponibles.`,
  );
}

function atributosLinkProcedencia(destino: DestinoProcedencia) {
  if (destino.hayOfertaDirecta) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

function TarjetaProcedencia({
  destino,
  whatsappNumero,
}: {
  destino: DestinoProcedencia;
  whatsappNumero: string;
}) {
  return (
    <a
      href={hrefProcedencia(destino, whatsappNumero)}
      {...atributosLinkProcedencia(destino)}
      className="block h-full"
    >
      <article className="group relative h-full min-h-36 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-yellow)]/60 hover:shadow-xl">
        <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-bl from-[#ffd600]/10 via-[#ffd600]/4 to-transparent pointer-events-none" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-1.5 truncate text-[9px] font-black uppercase tracking-[0.2em] text-[var(--brand-yellow)]">
                {destino.departamento}
              </p>
              <h3 className="text-base font-black leading-tight text-[var(--brand-navy)]">
                {destino.nombre}
              </h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-subtle)] transition-all duration-300 group-hover:bg-[var(--brand-navy)] group-hover:shadow-md">
              <MapPin size={16} className="text-[var(--brand-navy)] transition-colors group-hover:text-[var(--brand-yellow)]" aria-hidden="true" />
            </div>
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--brand-yellow)]">
            {destino.hayOfertaDirecta ? 'Ver hoteles ->' : 'Consultar por WhatsApp ->'}
          </p>
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
  const destinos = useMemo(() => [...principales, ...restantes], [principales, restantes]);

  useEffect(() => {
    const measure = () => {
      const container = trackRef.current?.parentElement;
      if (!container) return;
      const width = container.clientWidth;

      if (width < 640) {
        setCardsVisible(1);
        setCardWidth(Math.max(260, width - 24));
        return;
      }

      if (width < 1024) {
        setCardsVisible(2);
        setCardWidth((width - GAP) / 2);
        return;
      }

      setCardsVisible(3);
      setCardWidth((width - GAP * 2) / 3);
    };

    measure();
    const timer = window.setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const total = destinos.length;
  const step = cardWidth + GAP;
  const maxIndex = Math.max(0, total - cardsVisible);
  const progreso = maxIndex > 0 ? (activeIndex / maxIndex) * 100 : 100;

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
    trackRef.current?.scrollTo({ left: clamped * step, behavior: 'smooth' });
  }, [maxIndex, step]);

  const onScroll = () => {
    if (!trackRef.current) return;
    const next = Math.round(trackRef.current.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
  };

  if (!destinos.length) return null;

  return (
    <section id="destinos" className="section-padding bg-[var(--bg-base)] scroll-mt-40 sm:scroll-mt-48">
      <div className="container-site">
        <AnimarAlEntrar className="text-center mb-10 sm:mb-12">
          <p className="label-eyebrow mb-3">Lugares de procedencia</p>
          <h2 className="heading-section mb-3">
            Atendemos viajeros de todo el Peru
          </h2>
          <div className="section-divider" />
          <p className="body-text max-w-2xl mx-auto mt-4">
            Explora las procedencias disponibles en un carrusel compacto y consulta alojamientos por WhatsApp.
          </p>
        </AnimarAlEntrar>

        <AnimarAlEntrar>
          <div className="relative">
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex snap-x snap-mandatory overflow-x-auto pb-3 pt-1"
              style={{ scrollbarWidth: 'none', gap: `${GAP}px` }}
            >
              {destinos.map((destino) => (
                <div
                  key={destino.slug}
                  className="snap-start shrink-0"
                  style={{ width: `${cardWidth}px` }}
                >
                  <TarjetaProcedencia
                    destino={destino}
                    whatsappNumero={whatsappNumero}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[var(--brand-navy)] transition-all duration-300"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <span className="hidden text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] sm:inline">
                  {Math.min(activeIndex + cardsVisible, total)} / {total}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Destinos anteriores"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[var(--brand-navy)] shadow-sm transition-all hover:border-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(activeIndex + 1)}
                  disabled={activeIndex >= maxIndex}
                  aria-label="Destinos siguientes"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[var(--brand-navy)] shadow-sm transition-all hover:border-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
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
