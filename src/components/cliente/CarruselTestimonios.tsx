'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonio {
  id: string;
  nombre: string;
  origen: string;
  cargo: string;
  calificacion: number;
  texto: string;
  color: string;
}

const FALLBACK: Testimonio[] = [
  { id: '1', nombre: 'Maria Garcia',    origen: 'Lima',    cargo: 'Viajera frecuente', calificacion: 5, texto: 'Reserve el hotel en Cajamarca por WhatsApp y en menos de 5 minutos tenia la confirmacion. Sin formularios, sin comisiones.', color: '#2563EB' },
  { id: '2', nombre: 'Roberto Sanchez', origen: 'Trujillo',cargo: 'Reserva familiar',  calificacion: 5, texto: 'Llegue al hotel y todo estuvo como me lo describieron: limpio, comodo y en perfecto estado. Adventur realmente verifica.', color: '#7C3AED' },
  { id: '3', nombre: 'Lucia Torres',    origen: 'Arequipa',cargo: 'Viaje en familia',  calificacion: 5, texto: 'El precio que vi fue el que pague, sin sorpresas. La atencion fue personalizada y me ayudaron a elegir el hotel ideal.',   color: '#DB2777' },
  { id: '4', nombre: 'Carlos Mendoza',  origen: 'Chiclayo',cargo: 'Grupo familiar',    calificacion: 5, texto: 'Organice el viaje de toda la familia a Cajamarca. Adventur consiguio habitaciones con disponibilidad inmediata.',           color: '#059669' },
  { id: '5', nombre: 'Ana Rodriguez',   origen: 'Cusco',   cargo: 'Viaje individual',  calificacion: 5, texto: 'Me orientaron sobre que hotel elegir segun mi presupuesto y me senti completamente segura durante todo el proceso.',        color: '#D97706' },
];

const AUTO_DELAY = 3600;

export function CarruselTestimonios() {
  const [items, setItems] = useState<Testimonio[]>(FALLBACK);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;

  useEffect(() => {
    fetch('/api/testimonios')
      .then(r => r.ok ? r.json() : null)
      .then((data: Testimonio[] | null) => {
        if (data && data.length >= 3) setItems(data);
      })
      .catch(() => {});
  }, []);

  const visibles = useMemo(() => [
    items[activeIndex],
    items[(activeIndex + 1) % total],
    items[(activeIndex + 2) % total],
  ], [activeIndex, items, total]);

  const scrollTo = useCallback((index: number) => {
    setActiveIndex(((index % total) + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, AUTO_DELAY);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  return (
    <div
      className="relative mx-auto max-w-6xl px-3 sm:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {visibles.map((t, index) => {
          const inicial = t.nombre.trim().charAt(0).toUpperCase();
          return (
            <article
              key={`${t.id}-${activeIndex}-${index}`}
              className="flex min-h-[230px] flex-col justify-between rounded-[22px] bg-slate-50 p-6 text-slate-900 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:ring-slate-200 md:p-7"
            >
              <div>
                <div className="mb-3 flex items-center gap-0.5 text-[#ffb800]">
                  {Array.from({ length: t.calificacion }).map((_, star) => (
                    <Star key={star} size={18} className="fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-[15px] font-medium leading-relaxed text-slate-800">
                  {t.texto}
                </p>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-black text-white ring-4 ring-white"
                  style={{ background: t.color }}
                  aria-hidden="true"
                >
                  {inicial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-black text-slate-950">{t.nombre}</p>
                    <BadgeCheck size={15} className="shrink-0 fill-blue-500 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-medium text-slate-400">{t.cargo}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                    {t.origen}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollTo(activeIndex - 1)}
        aria-label="Anterior testimonio"
        className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.16)] transition hover:bg-(--brand-yellow)"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollTo(activeIndex + 1)}
        aria-label="Siguiente testimonio"
        className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.16)] transition hover:bg-(--brand-yellow)"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>

      <div className="mt-9 flex items-center justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Grupo de testimonios ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? 'w-7 bg-slate-950' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
