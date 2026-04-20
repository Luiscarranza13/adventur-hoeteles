'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Hotel, MapPin, Menu, X, Phone } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const esActivo = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`bg-[#001f3f] text-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#ffd600] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Hotel size={16} className="text-[#001f3f]" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">
            Adventur <span className="text-[#ffd600]">Hoteles</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/hoteles', label: 'Hoteles' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                esActivo(href)
                  ? 'bg-white/10 text-[#ffd600]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/hoteles"
            className="ml-3 flex items-center gap-2 bg-[#ffd600] text-[#001f3f] text-sm font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all shadow-lg shadow-[#ffd600]/20"
          >
            <Phone size={14} strokeWidth={2.5} />
            Reservar ahora
          </Link>
        </nav>

        {/* Hamburger móvil */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Menú"
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-2 bg-[#001f3f]">
          <Link href="/" className="text-sm text-white/80 py-2.5 hover:text-[#ffd600] transition-colors flex items-center gap-2" onClick={() => setMenuAbierto(false)}>
            Inicio
          </Link>
          <Link href="/hoteles" className="text-sm text-white/80 py-2.5 hover:text-[#ffd600] transition-colors flex items-center gap-2" onClick={() => setMenuAbierto(false)}>
            <MapPin size={14} /> Hoteles
          </Link>
          <Link href="/hoteles" className="mt-2 bg-[#ffd600] text-[#001f3f] text-sm font-bold px-5 py-3 rounded-xl text-center flex items-center justify-center gap-2" onClick={() => setMenuAbierto(false)}>
            <Phone size={14} /> Reservar ahora
          </Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white">
      {/* CTA strip */}
      <div className="bg-[#ffd600] py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold text-[#001f3f]">¿Listo para reservar?</h3>
            <p className="text-[#001f3f]/70 text-sm mt-1">Confirma directamente con el hotel por WhatsApp</p>
          </div>
          <Link
            href="/hoteles"
            className="flex-shrink-0 flex items-center gap-2 bg-[#001f3f] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#002d5a] transition-colors text-sm"
          >
            Ver todos los hoteles →
          </Link>
        </div>
      </div>

      {/* Footer principal */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#ffd600] rounded-lg flex items-center justify-center">
                <Hotel size={16} className="text-[#001f3f]" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-white text-lg">Adventur <span className="text-[#ffd600]">Hoteles</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Conectamos viajeros con los mejores hoteles. Reserva directamente por WhatsApp, sin intermediarios ni comisiones.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Explorar</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-sm text-gray-400 hover:text-[#ffd600] transition-colors">Inicio</Link>
              <Link href="/hoteles" className="text-sm text-gray-400 hover:text-[#ffd600] transition-colors">Todos los hoteles</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Reservas</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Elige tu habitación y confirma directamente con el hotel vía WhatsApp.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">
          © {new Date().getFullYear()} Adventur Hoteles · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
