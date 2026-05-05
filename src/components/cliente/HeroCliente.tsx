'use client';

import { Search, MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface HeroClienteProps {
  totalHoteles: number;
  totalCiudades: number;
}

export function HeroCliente({ totalHoteles, totalCiudades }: HeroClienteProps) {
  const [pasajeros, setPasajeros] = useState(1);

  return (
    <div className="relative z-10 w-full flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-10 sm:pb-14">

      <p className="label-eyebrow mb-3 animate-fade-up">
        HOSPEDAJE TURÍSTICO Y CORPORATIVO
      </p>

      <h1
        className="font-black text-white leading-tight mb-4 animate-fade-up max-w-3xl"
        style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', animationDelay: '0.1s' }}
      >
        Alojamiento que te lleva{' '}
        <span className="text-[var(--brand-yellow)]">más lejos</span>,{' '}
        con seguridad y confianza
      </h1>

      <p
        className="text-gray-200 leading-relaxed mb-7 max-w-lg animate-fade-up"
        style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', animationDelay: '0.2s' }}
      >
        Hoteles verificados en Cajamarca y todo el Perú. Reserva directa,
        sin comisiones y con confirmación inmediata por WhatsApp.
      </p>

      <div
        className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mb-8 animate-fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {[10, 11, 12].map((n) => (
              <div key={n} className="w-8 h-8 rounded-full border-2 border-[var(--brand-navy)] overflow-hidden bg-gray-700 shrink-0">
                <Image src={`https://i.pravatar.cc/100?img=${n}`} alt="" width={32} height={32} className="object-cover" />
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-0.5 mb-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={10} className="text-[var(--brand-yellow)] fill-[var(--brand-yellow)]" aria-hidden="true" />
              ))}
              <span className="text-white text-xs font-black ml-1">4.9</span>
            </div>
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
              +{totalHoteles > 0 ? totalHoteles * 50 : 150} clientes
            </p>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-white/20" />

        <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
          <MapPin size={11} className="text-[var(--brand-yellow)]" aria-hidden="true" />
          Todo el Perú
        </div>

        <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
          <Star size={11} className="text-[var(--brand-yellow)]" aria-hidden="true" />
          Hoteles verificados
        </div>
      </div>

      <div className="w-full max-w-4xl animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <div className="bg-white rounded-2xl sm:rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]">
          <form action="/hoteles" method="GET">
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 items-center">

              <div className="flex items-center gap-2.5 px-5 py-3 sm:py-3.5 w-full sm:flex-[1.5] hover:bg-gray-50/80 transition-colors sm:rounded-l-full">
                <div className="w-8 h-8 bg-[var(--brand-yellow)]/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="hero-ciudad" className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                    Destino
                  </label>
                  <input
                    id="hero-ciudad"
                    name="ciudad"
                    type="text"
                    placeholder="¿A qué ciudad viajas?"
                    className="w-full text-sm font-bold text-[var(--brand-navy)] placeholder:text-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-5 py-3 sm:py-3.5 w-full sm:flex-1 hover:bg-gray-50/80 transition-colors">
                <div className="w-8 h-8 bg-[var(--brand-yellow)]/10 rounded-full flex items-center justify-center shrink-0">
                  <Star size={14} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="hero-estrellas" className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                    Categoría
                  </label>
                  <select
                    id="hero-estrellas"
                    name="estrellas"
                    className="w-full text-sm font-bold text-[var(--brand-navy)] bg-transparent focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Cualquier clase</option>
                    <option value="5">Luxury (5 ★)</option>
                    <option value="4">Premium (4 ★)</option>
                    <option value="3">Estándar (3 ★)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-5 py-3 sm:py-3.5 w-full sm:flex-1 hover:bg-gray-50/80 transition-colors">
                <div className="w-8 h-8 bg-[var(--brand-yellow)]/10 rounded-full flex items-center justify-center shrink-0">
                  <Users size={14} className="text-[var(--brand-yellow)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Huéspedes</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPasajeros(p => Math.max(1, p - 1))}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[var(--brand-yellow)] text-[var(--brand-navy)] font-black text-sm flex items-center justify-center transition-all leading-none"
                      aria-label="Reducir">−</button>
                    <span className="text-sm font-black text-[var(--brand-navy)] w-4 text-center tabular-nums" aria-live="polite">{pasajeros}</span>
                    <button type="button" onClick={() => setPasajeros(p => Math.min(20, p + 1))}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[var(--brand-yellow)] text-[var(--brand-navy)] font-black text-sm flex items-center justify-center transition-all leading-none"
                      aria-label="Aumentar">+</button>
                  </div>
                </div>
              </div>

              <div className="p-2 sm:pr-2 w-full sm:w-auto">
                <button type="submit"
                  className="w-full sm:w-auto bg-[var(--brand-yellow)] hover:bg-[var(--brand-yellow-light)] active:scale-95 text-[var(--brand-navy)] font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <Search size={14} aria-hidden="true" />
                  Buscar Hotel
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
