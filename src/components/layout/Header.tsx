'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type MouseEvent } from 'react';
import { MapPin, Menu, X, MessageCircle, Hotel, BedDouble, Info, ArrowRight, Phone } from 'lucide-react';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { SelectorIdioma } from '@/components/shared/GoogleTranslate';
import Image from 'next/image';
import { crearUrlWhatsApp, type ConfiguracionWeb } from '@/lib/configuracion';
import { useConfiguracionWeb } from '@/hooks/useConfiguracionWeb';

const navItems = [
  { href: '/#inicio',               label: 'Inicio',    Icon: Hotel,        hash: 'inicio' },
  { href: '/#hoteles',              label: 'Hoteles',   Icon: BedDouble,    hash: 'hoteles' },
  { href: '/#destinos',             label: 'Destinos',  Icon: MapPin,       hash: 'destinos' },
  { href: '/#servicios',            label: 'Servicios', Icon: Info,         hash: 'servicios' },
  { href: '/#preguntas-frecuentes', label: 'FAQ',       Icon: MessageCircle,hash: 'preguntas-frecuentes' },
  { href: '/contacto',              label: 'Contacto',  Icon: Phone,        hash: null },
];

function redesConfiguradas(config: ConfiguracionWeb) {
  return [
    {
      label: 'Facebook',
      href: config.facebook_url,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: config.instagram_url,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
    },
    {
      label: 'TikTok',
      href: config.tiktok_url,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.6 2c.2 1.7 1.2 3.2 2.7 4.1.9.5 1.8.8 2.7.8v4.1c-1.8 0-3.5-.5-5-1.4v6.2c0 3.5-2.8 6.2-6.3 6.2S4.5 19.3 4.5 15.8s2.8-6.2 6.2-6.2c.5 0 1 .1 1.5.2v4.3c-.4-.2-.9-.3-1.4-.3-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V2h3.8z"/>
        </svg>
      ),
    },
    {
      label: 'Twitter/X',
      href: config.twitter_url,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.8 3.9H5.9L17.7 20z"/>
        </svg>
      ),
    },
  ].filter((red) => Boolean(red.href?.trim()));
}

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hashActivo, setHashActivo] = useState('');
  const config = useConfiguracionWeb();

  const whatsappConsulta = crearUrlWhatsApp(
    config.whatsapp_numero,
    config.whatsapp_mensaje_reserva || 'Hola, quiero consultar por un hotel.'
  );
  const whatsappReserva = crearUrlWhatsApp(
    config.whatsapp_numero,
    config.whatsapp_mensaje_reserva || 'Hola, quiero reservar un hotel.'
  );
  const redes = redesConfiguradas(config);

  // ── Scroll detector ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Scroll spy simple y estable ──────────────────────────────────────────
  // Solo activo en la homepage
  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const SECCIONES = ['inicio', 'contacto', 'hoteles', 'destinos', 'servicios', 'preguntas-frecuentes'];
    const calcularActivo = () => {
      const scrollY = window.scrollY;
      const alturaVentana = window.innerHeight;
      const alturaDoc = document.documentElement.scrollHeight;
      const lineaActiva = scrollY + Math.min(alturaVentana * 0.45, 360);

      // Si estamos al fondo de la página, activar la última sección
      if (scrollY + alturaVentana >= alturaDoc - 50) {
        setHashActivo('preguntas-frecuentes');
        return;
      }

      // Recorrer secciones de abajo hacia arriba
      // La primera cuyo top ya pasó el offset es la activa
      let activa = '';
      for (let i = SECCIONES.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECCIONES[i]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (lineaActiva >= top) {
          activa = SECCIONES[i];
          break;
        }
      }

      setHashActivo(activa);
    };

    // Calcular al montar y en cada scroll
    calcularActivo();
    window.addEventListener('scroll', calcularActivo, { passive: true });
    return () => window.removeEventListener('scroll', calcularActivo);
  }, [pathname]);

  const handleMobileNavClick = () => {
    setMenuAbierto(false);
  };

  const scrollASeccion = (hash: string | null) => {
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;

    const header = document.querySelector('header[role="banner"]');
    const altoHeader = header instanceof HTMLElement ? header.offsetHeight : 80;
    const ajustes: Record<string, number> = {
      inicio: 0,
      contacto: 0,
      destinos: 0,
      hoteles: 0,
      servicios: 0,
      'preguntas-frecuentes': 0,
    };
    const top = el.getBoundingClientRect().top + window.scrollY - altoHeader + (ajustes[hash] ?? 70);

    window.history.pushState(null, '', `/#${hash}`);
    setHashActivo(hash);
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, hash: string | null) => {
    if (!hash) {
      handleMobileNavClick();
      return;
    }

    if (pathname === '/') {
      event.preventDefault();
      scrollASeccion(hash);
    }

    handleMobileNavClick();
  };

  // ── Estado activo ─────────────────────────────────────────────────────────
  const esActivo = (href: string, hash: string | null) => {
    // Links de páginas separadas (Hoteles, Contacto)
    if (!hash) {
      if (href === '/') return pathname === '/' && hashActivo === '';
      return pathname === href || pathname.startsWith(href + '/');
    }
    // Links de secciones (solo en homepage)
    return pathname === '/' && hashActivo === hash;
  };

  return (
    <>
      <div className="bg-[var(--brand-navy)] hidden md:block border-b border-[var(--border-white-10)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          <a
            href={whatsappConsulta}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--brand-yellow)] transition-colors"
          >
            <MessageCircle size={13} className="text-[var(--brand-yellow)] shrink-0" />
            <span className="hidden sm:inline">Atención rápida por WhatsApp:</span>
            <span className="font-bold text-white">{config.telefono_principal}</span>
          </a>
          <div className={`${redes.length ? 'flex' : 'hidden'} items-center gap-3 sm:gap-5 text-xs sm:text-sm text-[var(--text-muted)]`}>
            <span className="hidden sm:inline">Síguenos:</span>
            {config.facebook_url && (
            <a
              href={config.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-yellow)] transition-colors font-semibold flex items-center gap-1"
              aria-label="Facebook"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </a>
            )}
            {config.instagram_url && (
            <a
              href={config.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-yellow)] transition-colors font-semibold flex items-center gap-1"
              aria-label="Instagram"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>
            )}
            {config.tiktok_url && (
            <a
              href={config.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-yellow)] transition-colors font-semibold flex items-center gap-1"
              aria-label="TikTok"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.6 2c.2 1.7 1.2 3.2 2.7 4.1.9.5 1.8.8 2.7.8v4.1c-1.8 0-3.5-.5-5-1.4v6.2c0 3.5-2.8 6.2-6.3 6.2S4.5 19.3 4.5 15.8s2.8-6.2 6.2-6.2c.5 0 1 .1 1.5.2v4.3c-.4-.2-.9-.3-1.4-.3-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V2h3.8z"/>
              </svg>
              <span className="hidden sm:inline">TikTok</span>
            </a>
            )}
            {config.twitter_url && (
            <a
              href={config.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-yellow)] transition-colors font-semibold flex items-center gap-1"
              aria-label="Twitter/X"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.8 3.9H5.9L17.7 20z"/>
              </svg>
              <span className="hidden sm:inline">Twitter/X</span>
            </a>
            )}
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-white py-3 border-b transition-[box-shadow,border-color] duration-200 ${
          scrolled ? 'shadow-sm border-gray-100' : 'shadow-none border-gray-100/50'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-3">

          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 group shrink-0" aria-label="Adventur Hoteles — Inicio">
            <div className="w-7 xs:w-8 sm:w-9 md:w-10 h-7 xs:h-8 sm:h-9 md:h-10 shrink-0">
              <Image
                src="/logoadventur2.png"
                alt="Adventur"
                width={40}
                height={40}
                className="object-contain group-hover:scale-105 transition-transform duration-300 w-full h-full"
                priority
              />
            </div>
            <div className="hidden xs:block sm:hidden leading-none">
              <p className="font-black text-[var(--brand-navy)] text-[10px] tracking-tight uppercase leading-none">Adventur</p>
              <p className="text-[var(--brand-yellow)] text-[7px] font-black uppercase tracking-[0.1em] mt-0.5">Hoteles</p>
            </div>
            <div className="hidden sm:block md:hidden leading-none">
              <p className="font-black text-[var(--brand-navy)] text-xs tracking-tight uppercase leading-none">Adventur</p>
              <p className="text-[var(--brand-yellow)] text-[8px] font-black uppercase tracking-[0.15em] mt-0.5">Hoteles</p>
            </div>
            <div className="hidden md:block leading-none">
              <p className="font-black text-[var(--brand-navy)] text-sm md:text-base tracking-tight uppercase leading-none">Adventur</p>
              <p className="text-[var(--brand-yellow)] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Hoteles</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegación principal">
            {navItems.map(({ href, label, Icon, hash }) => {
              const activo = esActivo(href, hash);
              const esContacto = href === '/contacto';
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(event) => handleNavClick(event, hash)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm tracking-wide transition-all group ${
                    esContacto
                      ? `rounded-full border ${
                          activo
                            ? 'border-[#001f3f] bg-[#001f3f] text-white font-black shadow-sm'
                            : 'border-[#001f3f]/15 bg-[#001f3f]/5 text-[#001f3f] font-bold hover:bg-[#001f3f] hover:text-white'
                        }`
                      : `rounded-lg ${
                          activo
                            ? 'text-[#001f3f] font-bold'
                            : 'text-slate-500 font-medium hover:text-[#001f3f] hover:bg-gray-50'
                        }`
                  }`}
                >
                  <Icon
                    size={15}
                    className={
                      esContacto
                        ? (activo ? 'text-[#ffd600]' : 'text-[#001f3f] group-hover:text-[#ffd600] transition-colors')
                        : (activo ? 'text-[#001f3f]' : 'text-slate-400 group-hover:text-[#001f3f] transition-colors')
                    }
                    aria-hidden="true"
                  />
                  {label}
                  {activo && !esContacto && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#ffd600] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:block">
              <SelectorIdioma />
            </div>
            <a
              href={whatsappReserva}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-[#ffd600] hover:bg-[#ffdf33] text-[#001f3f] font-black text-xs px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-[0_4px_12px_rgba(255,214,0,0.35)] hover:shadow-[0_6px_18px_rgba(255,214,0,0.45)] hover:-translate-y-0.5"
            >
              <MessageCircle size={14} aria-hidden="true" />
              <span>Reservar ahora</span>
            </a>
            <button
              className="lg:hidden p-1.5 xs:p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gray-100 text-[#001f3f] hover:bg-gray-200 transition-colors"
              onClick={() => setMenuAbierto(v => !v)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuAbierto}
              aria-controls="mobile-menu"
            >
              {menuAbierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div
            id="mobile-menu"
            className="lg:hidden fixed inset-x-0 top-[57px] bottom-0 bg-white z-50 overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <nav className="px-3 xs:px-4 sm:px-5 pt-3 xs:pt-3.5 sm:pt-4 pb-6 flex flex-col gap-2" aria-label="Navegación móvil">
              {navItems.map(({ href, label, Icon, hash }) => {
                const activo = esActivo(href, hash);
                const esContacto = href === '/contacto';

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(event) => handleNavClick(event, hash)}
                    className={`flex items-center justify-between py-2.5 xs:py-3 sm:py-3.5 px-3 xs:px-4 sm:px-5 rounded-lg xs:rounded-xl sm:rounded-2xl text-sm font-bold transition-all border ${
                      esContacto
                        ? activo
                          ? 'bg-[#001f3f] border-[#001f3f] text-white'
                          : 'bg-[#001f3f]/5 border-[#001f3f]/15 text-[#001f3f]'
                        : activo
                          ? 'bg-[#ffd600]/10 border-[#ffd600]/30 text-[#001f3f]'
                          : 'bg-gray-50 hover:bg-[#ffd600]/10 border-gray-100 text-[#001f3f]'
                    }`}
                  >
                    <span className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                      <Icon size={17} className={esContacto ? (activo ? 'text-[#ffd600]' : 'text-[#001f3f]') : 'text-[#ffd600]'} aria-hidden="true" />
                      {label}
                    </span>
                    <ArrowRight size={14} className={esContacto && activo ? 'text-white/50' : 'text-gray-300'} aria-hidden="true" />
                  </Link>
                );
              })}

              <div className="mt-3 xs:mt-3.5 sm:mt-4 p-3 xs:p-4 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#001f3f] text-white">
                <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#ffd600] mb-1">Contacto directo</p>
                <p className="text-sm xs:text-base sm:text-lg font-black mb-2.5 xs:mb-3 sm:mb-4">{config.telefono_principal}</p>
                <a
                  href={whatsappConsulta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#ffd600] text-[#001f3f] font-black py-2 xs:py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Escribir por WhatsApp
                </a>
              </div>

              <div className="mt-2 flex justify-center">
                <SelectorIdioma />
              </div>
            </nav>
          </div>
        )}
      </header>

      <ScrollToTop />
    </>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const config = useConfiguracionWeb();

  return (
    <footer className="bg-[#001f3f] text-white" role="contentinfo">
      {/*

              <p className="text-[#ffd600] text-[10px] font-black uppercase tracking-[0.25em] mt-1">Hoteles · Perú</p>
            Hoteles verificados en todo el Perú.<br className="hidden sm:block" />
      */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0">
                <Image src="/logoadventur2.png" alt="Adventur" width={36} height={36} className="object-contain w-6 sm:w-9 h-6 sm:h-9" />
              </div>
              <div className="leading-none">
                <p className="font-black text-white text-sm sm:text-base uppercase tracking-tight">ADVENTUR</p>
                <p className="text-[#ffd600] text-[8px] sm:text-[10px] font-black uppercase tracking-widest mt-0.5">Hoteles</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-1">HORIZONTE ANDINO COMPANY E.I.R.L.</p>
            <p className="text-gray-400 text-[11px] sm:text-xs mb-4 sm:mb-5">RUC: 20612408255</p>
            <div className="flex items-center gap-2">
              {[
                { label: 'Facebook', href: config.facebook_url, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                )},
                { label: 'Instagram', href: config.instagram_url, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                )},
                { label: 'TikTok', href: config.tiktok_url, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.6 2c.2 1.7 1.2 3.2 2.7 4.1.9.5 1.8.8 2.7.8v4.1c-1.8 0-3.5-.5-5-1.4v6.2c0 3.5-2.8 6.2-6.3 6.2S4.5 19.3 4.5 15.8s2.8-6.2 6.2-6.2c.5 0 1 .1 1.5.2v4.3c-.4-.2-.9-.3-1.4-.3-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V2h3.8z"/>
                  </svg>
                )},
                { label: 'Twitter/X', href: config.twitter_url, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.8 3.9H5.9L17.7 20z"/>
                  </svg>
                )},
              ].filter(({ href }) => href).map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-[#ffd600] hover:text-[#001f3f] hover:border-[#ffd600]"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-[#ffd600] mb-3 sm:mb-5">Explorar</h3>
            <ul className="flex flex-col gap-2 sm:gap-3" role="list">
              {[
                { href: '/',                      label: 'Inicio' },
                { href: '/hoteles',               label: 'Hoteles' },
                { href: '/#destinos',             label: 'Destinos' },
                { href: '/#servicios',            label: 'Servicios' },
                { href: '/#preguntas-frecuentes', label: 'Preguntas frecuentes' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#ffd600] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-[#ffd600] mb-3 sm:mb-5">Compañía</h3>
            <ul className="flex flex-col gap-2 sm:gap-3" role="list">
              {[
                { label: 'Nosotros', href: '/#nosotros' },
                { label: 'Términos y Condiciones', href: '/terminos' },
                { label: 'Políticas de Privacidad', href: '/privacidad' },
                { label: 'Libro de Reclamaciones', href: '/reclamaciones' }
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-[#ffd600] mb-3 sm:mb-5">Contacto</h3>
            <address className="not-italic flex flex-col gap-3 sm:gap-4">
              <a href={`tel:${config.telefono_principal.replace(/\s/g, '')}`} className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-[#ffd600] group-hover:bg-[#ffd600] group-hover:text-[#001f3f] transition-all shrink-0">
                  <Phone size={15} aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white">{config.telefono_principal}</span>
              </a>
              <a href={`mailto:${config.email_contacto}`} className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-[#ffd600] group-hover:bg-[#ffd600] group-hover:text-[#001f3f] transition-all shrink-0">
                  <MessageCircle size={15} aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors break-all">{config.email_contacto}</span>
              </a>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-[#ffd600] shrink-0 mt-0.5">
                  <MapPin size={15} aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-gray-400">Jr. Amazonas 1079, Cajamarca, Perú</span>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-gray-400 text-center sm:text-left">
            © {year} Adventur. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Safe Travels</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mincetur</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
