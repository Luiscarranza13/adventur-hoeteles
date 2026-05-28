'use client';

import { ArrowRight, Plane, Bus, Building2, Calendar, GraduationCap, ShieldCheck, Headphones, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Servicio {
  slug: string;
  titulo: string;
  categoria: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
}

const SERVICIOS: Servicio[] = [
  { slug: 'traslado-aeropuerto',      titulo: 'Traslado al aeropuerto',    categoria: 'Movilidad 24/7',    Icon: Plane,        color: '#2563EB', bg: '#eff6ff' },
  { slug: 'viajes-interprovinciales', titulo: 'Viajes interprovinciales',  categoria: 'Rutas nacionales',  Icon: Bus,          color: '#7C3AED', bg: '#f5f3ff' },
  { slug: 'hospedaje-corporativo',    titulo: 'Hospedaje corporativo',     categoria: 'Empresas',          Icon: Building2,    color: '#0891B2', bg: '#ecfeff' },
  { slug: 'eventos-especiales',       titulo: 'Eventos especiales',        categoria: 'Grupos y eventos',  Icon: Calendar,     color: '#DB2777', bg: '#fdf2f8' },
  { slug: 'turismo-escolar',          titulo: 'Turismo escolar',           categoria: 'Instituciones',     Icon: GraduationCap,color: '#059669', bg: '#ecfdf5' },
  { slug: 'hoteles-verificados',      titulo: 'Hoteles verificados',       categoria: 'Alojamiento seguro',Icon: ShieldCheck,  color: '#001f3f', bg: '#f0f4f8' },
  { slug: 'atencion-personalizada',   titulo: 'Atención personalizada',    categoria: 'Asesoría directa',  Icon: Headphones,   color: '#D97706', bg: '#fffbeb' },
  { slug: 'paquetes-medida',          titulo: 'Paquetes a medida',         categoria: 'Viajes y estadías', Icon: Package,      color: '#DC2626', bg: '#fef2f2' },
];

function TarjetaServicio({ s }: { s: Servicio }) {
  return (
    <a
      href={`/hoteles?servicio=${encodeURIComponent(s.slug)}`}
      className="group flex w-[168px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ffd600]/60 hover:shadow-[0_16px_32px_rgba(15,23,42,0.1)] sm:w-[185px]"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: s.bg }}
      >
        <s.Icon size={26} style={{ color: s.color }} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-black leading-snug text-[#001f3f]">{s.titulo}</h3>
        <p className="mt-1 text-xs font-bold text-emerald-600">{s.categoria}</p>
      </div>
    </a>
  );
}

export function CarruselServicios() {
  const items = [...SERVICIOS, ...SERVICIOS];

  return (
    <div className="relative -mx-5 overflow-hidden py-2 sm:-mx-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-white to-transparent" />

      <div className="servicios-marquee overflow-hidden py-3">
        <div className="servicios-marquee-track">
          {items.map((s, i) => (
            <TarjetaServicio key={`${s.slug}-${i}`} s={s} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href="/hoteles"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#001f3f] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-[#002d5a]"
        >
          Ver hoteles y servicios
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
