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

function TarjetaRazon({ razon }: { razon: Razon }) {
  const [open, setOpen] = useState(false);
  const { Icon, numero, titulo, resumen, detalle, stat, statLabel } = razon;
  const panelId = `razon-panel-${numero}`;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      open
        ? 'border-[#001f3f]/20 shadow-xl bg-white'
        : 'border-gray-100 bg-white hover:shadow-lg hover:border-[#ffd600]/40'
    }`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={`${open ? 'Cerrar' : 'Abrir'} razon ${titulo}`}
        className="w-full text-left p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd600] rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
              open
                ? 'bg-[#ffd600] shadow-[0_8px_20px_rgba(255,214,0,0.35)]'
                : 'bg-linear-to-br from-[#001f3f]/8 to-[#001f3f]/4'
            }`}>
              <Icon size={24} className="text-[#001f3f] transition-colors duration-300" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 block ${open ? 'text-[#ffd600]' : 'text-[#8a6500]'}`}>{numero}</span>
              <h3 className="text-base font-bold text-[#001f3f] leading-snug mb-1.5">{titulo}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{resumen}</p>
            </div>
          </div>

          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all duration-200 ${
            open ? 'bg-[#001f3f]' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <ChevronDown
              size={14}
              className={`transition-all duration-300 ${open ? 'rotate-180 text-white' : 'text-gray-400'}`}
            />
          </div>
        </div>
      </button>

      {/* Panel expandible — grid trick, sin inline styles */}
      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-5 mb-5 rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-linear-to-r from-[#001f3f] to-[#002d5a] px-5 py-4 flex items-center gap-4">
              <span className="text-2xl font-black text-[#ffd600] tabular-nums leading-none">{stat}</span>
              <span className="text-xs text-white/60 leading-tight font-medium">{statLabel}</span>
            </div>
            <div className="bg-gray-50 px-5 py-4">
              <p className="text-sm text-gray-500 leading-relaxed">{detalle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeccionPorQueElegirnos() {
  return (
    <section className="section-padding bg-(--bg-subtle)">
      <div className="container-site">
        <div className="text-center mb-12 sm:mb-14">
          <p className="label-eyebrow mb-3">La Diferencia Adventur</p>
          <h2 className="heading-section mb-3">¿Por qué elegirnos?</h2>
          <div className="section-divider" />
          <p className="body-text max-w-xl mx-auto mt-4">
            Tres razones que nos distinguen de cualquier otra plataforma de reservas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {RAZONES.map(razon => (
            <TarjetaRazon key={razon.numero} razon={razon} />
          ))}
        </div>
      </div>
    </section>
  );
}
