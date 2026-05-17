'use client';

import { useState } from 'react';
import { Shield, Zap, BadgeDollarSign, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Razon {
  Icon: LucideIcon;
  numero: string;
  titulo: string;
  resumen: string;
  detalle: string;
  stat: string;
  statLabel: string;
}

const RAZONES: Razon[] = [
  {
    Icon: Shield,
    numero: '01',
    titulo: 'Reserva 100% segura',
    resumen: 'Privacidad total, sin intermediarios.',
    detalle:
      'Tus datos son gestionados directamente con el hotel a través de WhatsApp, sin intermediarios digitales. Cumplimos con la Ley de Protección de Datos Personales del Perú y nunca compartimos tu información con terceros.',
    stat: '100%',
    statLabel: 'Privacidad garantizada',
  },
  {
    Icon: Zap,
    numero: '02',
    titulo: 'Respuesta inmediata',
    resumen: 'Confirmación directa en tiempo récord.',
    detalle:
      'Nuestra integración con WhatsApp conecta directamente con el hotel para que recibas confirmación en minutos. Sin formularios lentos, sin correos que se pierden. Atención real, en tiempo real.',
    stat: '< 5 min',
    statLabel: 'Tiempo de respuesta',
  },
  {
    Icon: BadgeDollarSign,
    numero: '03',
    titulo: 'Precio directo sin extras',
    resumen: 'Sin comisiones ni cargos ocultos.',
    detalle:
      'El precio que ves es exactamente lo que pagas directamente al establecimiento. Sin comisiones de plataforma, sin cargos de gestión, sin sorpresas. Precio justo, trato directo.',
    stat: '0%',
    statLabel: 'Comisión cobrada',
  },
];

// ── Tarjeta individual con panel expandible inline ────────────────────────────
function TarjetaRazon({ razon }: { razon: Razon }) {
  const [open, setOpen] = useState(false);
  const { Icon, numero, titulo, resumen, detalle, stat, statLabel } = razon;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      open
        ? 'border-[#001f3f]/20 shadow-lg bg-white'
        : 'border-gray-100 bg-[var(--bg-subtle)] hover:bg-white hover:shadow-md hover:border-[#ffd600]/30'
    }`}>
      {/* Cabecera — siempre visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd600] rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icono */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
              open ? 'bg-[#ffd600]' : 'bg-[#001f3f]/8 group-hover:bg-[#001f3f]'
            }`}>
              <Icon
                size={18}
                className={`transition-colors duration-300 ${open ? 'text-[#001f3f]' : 'text-[#001f3f]'}`}
                aria-hidden="true"
              />
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold text-gray-300 tabular-nums">{numero}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#001f3f] leading-snug mb-1">{titulo}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{resumen}</p>
            </div>
          </div>

          {/* Chevron */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-200 ${
            open ? 'bg-[#001f3f]' : 'bg-gray-100'
          }`}>
            <ChevronDown
              size={13}
              className={`transition-all duration-300 ${open ? 'rotate-180 text-white' : 'text-gray-400'}`}
            />
          </div>
        </div>
      </button>

      {/* Panel expandible inline — sin fixed, sin portal */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? '300px' : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-gray-100">
          {/* Stat */}
          <div className="bg-[#001f3f] px-4 py-3 flex items-center gap-3">
            <span className="text-xl font-bold text-[#ffd600] tabular-nums leading-none">{stat}</span>
            <span className="text-[11px] text-white/50 leading-tight">{statLabel}</span>
          </div>
          {/* Detalle */}
          <div className="bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500 leading-relaxed">{detalle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function SeccionPorQueElegirnos() {
  return (
    <section className="py-12 sm:py-16 bg-[var(--bg-base)]">
      <div className="container-site">
        <div className="text-center mb-8 sm:mb-10">
          <p className="label-eyebrow mb-2">La Diferencia Adventur</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001f3f]">¿Por qué elegirnos?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {RAZONES.map(razon => (
            <TarjetaRazon key={razon.numero} razon={razon} />
          ))}
        </div>
      </div>
    </section>
  );
}
