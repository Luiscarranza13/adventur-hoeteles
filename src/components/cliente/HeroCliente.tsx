'use client';

import {
  Search, MapPin, Star, Building2, ChevronDown,
  Hotel, Home, Layers, TreePine, Leaf, Backpack,
  CheckCircle2, Loader2, ArrowRight, X,
  AlertCircle, ChevronLeft, ChevronRight,
  Users, ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { TipoAlojamiento } from '@/modules/hoteles/dominio/entidades/Hotel';
import type { HotelConPrecio } from '@/lib/hoteles-consultas';
import { useHeroCarrusel, HERO_SLIDES } from './HeroFondoAnimado';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { useConfiguracionWeb } from '@/hooks/useConfiguracionWeb';

interface HeroClienteProps {
  totalHoteles: number;
  totalCiudades: number;
  ciudadesDisponibles?: string[];
}

// ─── Result card ──────────────────────────────────────────────────────────────

function TarjetaHotelResultado({ hotel }: { hotel: HotelConPrecio }) {
  return (
    <Link href={`/hoteles/${hotel.id}`} className="block group">
      <article className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#001f3f]/[0.03] transition-all duration-200 border border-transparent hover:border-[#001f3f]/8">
        {/* Imagen */}
        <div className="relative w-[72px] h-[56px] rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
          {hotel.imagenesUrls?.[0] ? (
            <ImagenSegura
              src={hotel.imagenesUrls[0]}
              alt={hotel.nombre}
              fill
              sizes="72px"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
              <Hotel size={20} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Estrellas */}
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: hotel.estrellas }).map((_, i) => (
              <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-sm font-bold text-[#001f3f] truncate leading-tight group-hover:text-[#001f3f] transition-colors">
            {hotel.nombre}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={9} className="text-[#ffd600] shrink-0" />
            <span className="text-[10px] text-gray-400 font-medium truncate">{hotel.ciudad}</span>
            {hotel.tipoAlojamiento && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-[10px] text-gray-400">{hotel.tipoAlojamiento}</span>
              </>
            )}
          </div>
        </div>

        {/* Precio */}
        <div className="shrink-0 text-right">
          {hotel.precioMinimo ? (
            <div>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Desde</p>
              <p className="text-base font-black text-[#001f3f] leading-none">S/{hotel.precioMinimo}</p>
            </div>
          ) : (
            <span className="text-[10px] text-gray-400 font-medium">Ver más</span>
          )}
          <div className="flex justify-end mt-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-[#ffd600] flex items-center justify-center transition-all duration-200">
              <ArrowRight size={10} className="text-gray-400 group-hover:text-[#001f3f] transition-colors" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

const CATEGORIAS = [
  { value: '', label: 'Cualquier categoría', stars: 0 },
  { value: '5', label: 'Luxury — 5 estrellas', stars: 5 },
  { value: '4', label: 'Premium — 4 estrellas', stars: 4 },
  { value: '3', label: 'Estándar — 3 estrellas', stars: 3 },
  { value: '2', label: 'Económico — 2 estrellas', stars: 2 },
  { value: '1', label: 'Básico — 1 estrella', stars: 1 },
];

const ICONOS_TIPO: Record<string, React.ReactNode> = {
  Hotel:        <Hotel size={14} />,
  Hostal:       <Home size={14} />,
  'Apart-hotel': <Layers size={14} />,
  Resort:       <TreePine size={14} />,
  Ecolodge:     <Leaf size={14} />,
  Albergue:     <Backpack size={14} />,
};

function useClickFuera(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

interface Opcion {
  value: string;
  label: string;
  icono?: React.ReactNode;
  stars?: number;
}

interface DropdownProps {
  label: string;
  value: string;
  placeholder: string;
  triggerIcon: React.ReactNode;
  opciones: Opcion[];
  onChange: (v: string) => void;
  cargando?: boolean;
  mensajeVacio?: string;
  isFirst?: boolean;
  searchable?: boolean;
}

function Dropdown({
  label, value, placeholder, triggerIcon,
  opciones, onChange, cargando, mensajeVacio, isFirst, searchable,
}: DropdownProps) {
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [busqueda, setBusqueda] = useState('');
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickFuera(panelRef, () => { setAbierto(false); setBusqueda(''); });

  const abrir = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 6,
        left: r.left + window.scrollX,
        width: Math.max(r.width, 300),
      });
    }
    setAbierto(v => {
      if (!v) setTimeout(() => inputRef.current?.focus(), 50);
      return !v;
    });
    setBusqueda('');
  };

  const seleccionada = opciones.find(o => o.value === value);

  const opcionesFiltradas = searchable && busqueda
    ? opciones.filter(o => o.label.toLowerCase().includes(busqueda.toLowerCase()))
    : opciones;

  const panel = abierto && (
    <div
      ref={panelRef}
      style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl shadow-[0_16px_56px_-8px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden">
        {searchable && (
          <div className="px-3 pt-3 pb-2 border-b border-gray-50">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search size={13} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder={`Buscar ${label.toLowerCase()}...`}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              {busqueda && (
                <button type="button" onClick={() => setBusqueda('')} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}
        {cargando ? (
          <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Cargando opciones...
          </div>
        ) : opcionesFiltradas.length > 0 ? (
          <div className="max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {opcionesFiltradas.map(({ value: v, label: l, icono, stars }) => {
              const activo = value === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => { onChange(v); setAbierto(false); setBusqueda(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all group ${
                    activo ? 'bg-(--brand-navy)/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    activo ? 'border-(--brand-navy) bg-(--brand-navy)' : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {activo && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                  </span>

                  {icono && (
                    <span className={`shrink-0 ${activo ? 'text-(--brand-navy)' : 'text-gray-400'}`}>
                      {icono}
                    </span>
                  )}

                  {stars !== undefined && stars > 0 && (
                    <span className="flex items-center gap-0.5 shrink-0">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} size={9} className="text-(--brand-yellow) fill-(--brand-yellow)" />
                      ))}
                    </span>
                  )}

                  <span className={`flex-1 truncate ${activo ? 'font-semibold text-(--brand-navy)' : 'text-gray-600'}`}>
                    {l}
                  </span>

                  {activo && <CheckCircle2 size={14} className="text-(--brand-navy) shrink-0" />}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="px-5 py-5 text-xs text-gray-400 text-center">
            {busqueda ? `Sin resultados para "${busqueda}"` : (mensajeVacio ?? 'Sin opciones disponibles')}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex-1">
      <button
        ref={btnRef}
        type="button"
        onClick={abrir}
        className={`w-full flex items-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 transition-colors text-left group ${
          isFirst ? 'sm:rounded-l-full' : ''
        } ${abierto ? 'bg-gray-50' : 'hover:bg-gray-50/70'}`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          abierto || value ? 'bg-(--brand-yellow)' : 'bg-(--brand-yellow)/10'
        }`}>
          <span className={abierto || value ? 'text-(--brand-navy)' : 'text-(--brand-yellow)'}>
            {triggerIcon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
          <div className="flex items-center justify-between gap-1">
            <span className={`text-sm truncate leading-tight ${
              value ? 'font-semibold text-(--brand-navy)' : 'text-gray-600 font-normal'
            }`}>
              {cargando ? 'Cargando...' : (seleccionada?.value ? seleccionada.label : placeholder)}
            </span>
            <ChevronDown
              size={12}
              className={`shrink-0 transition-all duration-200 ${
                abierto ? 'rotate-180 text-(--brand-navy)' : 'text-gray-300'
              }`}
            />
          </div>
        </div>
      </button>

      {typeof document !== 'undefined' && panel && createPortal(panel, document.body)}
    </div>
  );
}


// ─── Real-time results panel ──────────────────────────────────────────────────

interface PanelResultadosProps {
  resultados: HotelConPrecio[];
  cargando: boolean;
  visible: boolean;
  total: number;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onVerTodos: () => void;
}

function PanelResultados({ resultados, cargando, visible, total, anchorRef, panelRef, onVerTodos }: PanelResultadosProps) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  useEffect(() => {
    if (!visible || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 10, left: r.left + window.scrollX, width: r.width });
  }, [visible, anchorRef]);
  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div ref={panelRef} style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
      <div className="bg-white rounded-3xl shadow-[0_24px_64px_-12px_rgba(0,31,63,0.22)] border border-gray-100/80 overflow-hidden">

        {cargando ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd600]/10 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-[#001f3f]" />
            </div>
            <p className="text-sm font-medium text-gray-400">Buscando hoteles...</p>
          </div>

        ) : resultados.length > 0 ? (
          <>
            {/* Header del panel */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffd600] animate-pulse" />
                <span className="text-[10px] font-black text-[#001f3f] uppercase tracking-[0.18em]">
                  {total} resultado{total !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-[10px] text-gray-300 font-medium">Toca para ver detalles</span>
            </div>

            {/* Lista de hoteles */}
            <div className="py-2 max-h-[340px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {resultados.map((hotel, i) => (
                <div key={hotel.id}>
                  <TarjetaHotelResultado hotel={hotel} />
                  {i < resultados.length - 1 && (
                    <div className="mx-4 h-px bg-gray-50" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer — ver todos */}
            {total > resultados.length && (
              <div className="border-t border-gray-50 px-4 py-3.5">
                <button
                  type="button"
                  onClick={onVerTodos}
                  className="w-full flex items-center justify-center gap-2 bg-[#001f3f] hover:bg-[#002d5a] text-white text-xs font-bold py-3 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm uppercase tracking-widest"
                >
                  <ArrowRight size={13} />
                  Ver los {total} resultados
                </button>
              </div>
            )}
          </>

        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#001f3f] mb-1">Sin resultados</p>
              <p className="text-xs text-gray-400">Prueba con otro destino o categoría</p>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-white text-sm font-black leading-none tabular-nums">{value}</p>
        <p className="text-white/45 text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function StatsBar({ config, coberturaTexto }: { config: ReturnType<typeof useConfiguracionWeb>; coberturaTexto: string }) {
  const rating  = Number(config.hero_rating)         || 4.9;
  const clientes = Number(config.hero_clientes_count) || 1050;

  const sep = <div className="hidden sm:block h-8 w-px bg-white/12" />;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-8">

      <StatItem
        icon={<Star size={16} className="text-(--brand-yellow) fill-(--brand-yellow)" aria-hidden="true" />}
        value={rating.toFixed(1)}
        label="Calificación"
      />

      {sep}

      <StatItem
        icon={<Users size={15} className="text-(--brand-yellow)" aria-hidden="true" />}
        value={`+${clientes.toLocaleString('es-PE')}`}
        label="Clientes felices"
      />

      {sep}

      <StatItem
        icon={<MapPin size={15} className="text-(--brand-yellow)" aria-hidden="true" />}
        value={coberturaTexto.replace(' destinos', '')}
        label="Destinos"
      />

      {sep}

      <StatItem
        icon={<ShieldCheck size={15} className="text-(--brand-yellow)" aria-hidden="true" />}
        value="100%"
        label="Hoteles verificados"
      />

    </div>
  );
}

export function HeroCliente({ totalHoteles, totalCiudades, ciudadesDisponibles = [] }: HeroClienteProps) {
  const [ciudad, setCiudad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<TipoAlojamiento | ''>('');
  const [ciudades, setCiudades] = useState<string[]>(ciudadesDisponibles);
  const [tiposDisponibles, setTiposDisponibles] = useState<TipoAlojamiento[]>([]);
  const [cargandoTipos, setCargandoTipos] = useState(false);

  // Real-time results
  const [resultados, setResultados] = useState<HotelConPrecio[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [cargandoResultados, setCargandoResultados] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/hoteles/ciudades')
      .then(r => r.json())
      .then(d => { if (d.ciudades?.length) setCiudades(d.ciudades); })
      .catch(() => {});
  }, []);

  const cargarTipos = useCallback(async (ciudadBuscar: string) => {
    setCargandoTipos(true);
    setTipo('');
    try {
      const params = ciudadBuscar ? `?ciudad=${encodeURIComponent(ciudadBuscar)}` : '';
      const res = await fetch(`/api/hoteles/tipos${params}`);
      const data = await res.json();
      setTiposDisponibles(data.tipos ?? []);
    } catch {
      setTiposDisponibles([]);
    } finally {
      setCargandoTipos(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => cargarTipos(ciudad), 350);
    return () => clearTimeout(delay);
  }, [ciudad, cargarTipos]);

  // Real-time search with debounce
  const buscarEnTiempoReal = useCallback(async (c: string, cat: string, t: string) => {
    setCargandoResultados(true);
    try {
      const params = new URLSearchParams();
      if (c) params.set('ciudad', c);
      if (cat) params.set('estrellas', cat);
      if (t) params.set('tipo', t);
      const res = await fetch(`/api/hoteles/buscar?${params}`);
      const data = await res.json();
      setResultados((data.hoteles ?? []).slice(0, 5));
      setTotalResultados(data.total ?? 0);
    } catch {
      setResultados([]);
      setTotalResultados(0);
    } finally {
      setCargandoResultados(false);
    }
  }, []);

  useEffect(() => {
    const hayFiltros = !!(ciudad || categoria || tipo);
    if (!hayFiltros) return;

    const delay = setTimeout(() => {
      setPanelVisible(true);
      buscarEnTiempoReal(ciudad, categoria, tipo);
    }, 400);
    return () => clearTimeout(delay);
  }, [ciudad, categoria, tipo, buscarEnTiempoReal]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelVisible(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navegar = useCallback(() => {
    const params = new URLSearchParams();
    if (ciudad) params.set('ciudad', ciudad);
    if (categoria) params.set('estrellas', categoria);
    if (tipo) params.set('tipo', tipo);
    window.location.href = `/hoteles${params.toString() ? `?${params}` : ''}`;
  }, [ciudad, categoria, tipo]);

  const handleCiudadChange = (v: string) => { setCiudad(v); };
  const handleCategoriaChange = (v: string) => { setCategoria(v); };
  const handleTipoChange = (v: string) => { setTipo(v as TipoAlojamiento | ''); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navegar();
  };

  const opcionesCiudad: Opcion[] = [
    { value: '', label: 'Todas las ciudades', icono: <MapPin size={14} /> },
    ...ciudades.map(c => ({ value: c, label: c, icono: <MapPin size={14} /> })),
  ];

  const opcionesTipo: Opcion[] = [
    { value: '', label: 'Cualquier tipo', icono: <Building2 size={14} /> },
    ...tiposDisponibles.map(t => ({ value: t, label: t, icono: ICONOS_TIPO[t] ?? <Hotel size={14} /> })),
  ];

  const opcionesCategoria: Opcion[] = CATEGORIAS.map(c => ({
    value: c.value,
    label: c.label,
    stars: c.stars,
  }));

  const hayFiltros = !!(ciudad || categoria || tipo);
  const coberturaTexto = totalCiudades || ciudades.length
    ? `${totalCiudades || ciudades.length} destinos`
    : 'Todo el Perú';

  // ── Config real-time ──
  const config = useConfiguracionWeb();

  // ── Carrusel state ──
  const carrusel = useHeroCarrusel();
  const [lugarVisible, setLugarVisible] = useState(true);
  const prevActual = useRef(carrusel.actual);

  useEffect(() => {
    if (prevActual.current === carrusel.actual) return;
    prevActual.current = carrusel.actual;
    setLugarVisible(false);
    const t = setTimeout(() => setLugarVisible(true), 300);
    return () => clearTimeout(t);
  }, [carrusel.actual]);

  return (
    <div className="relative z-10 w-full flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-10 sm:pb-14">

      {/* ── Flechas de navegación ── */}
      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={carrusel.anteriorSlide}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 hover:bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shrink-0"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Imagen siguiente"
        onClick={carrusel.siguiente}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 hover:bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shrink-0"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Etiqueta de lugar — esquina superior derecha ── */}
      <div
        className="absolute top-5 right-5 sm:top-6 sm:right-8 pointer-events-none"
        style={{
          opacity: lugarVisible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--brand-yellow) shrink-0" />
          <span className="text-white/90 text-[11px] font-semibold tracking-wide">
            {HERO_SLIDES[carrusel.actual].lugar}
          </span>
        </div>
        <p className="text-white/55 text-[10px] font-medium text-right mt-1 pr-1 hidden sm:block">
          {HERO_SLIDES[carrusel.actual].subtitulo}
        </p>
      </div>

      {/* ── Indicadores + barra de progreso ── */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a imagen ${i + 1}`}
            onClick={() => carrusel.irA(i)}
            className="relative flex h-8 w-8 items-center justify-center focus:outline-none"
          >
            <span
              className="block rounded-full transition-all duration-300 overflow-hidden"
              style={{
                width: i === carrusel.actual ? 28 : 7,
                height: 7,
                background: i === carrusel.actual ? 'var(--brand-yellow)' : 'rgba(255,255,255,0.3)',
              }}
            >
            </span>
          </button>
        ))}
      </div>

      {/* ── Contador ── */}
      <div className="absolute bottom-5 sm:bottom-7 right-5 sm:right-8 pointer-events-none" aria-hidden="true">
        <span className="text-white/35 text-[10px] font-mono tabular-nums tracking-widest">
          {String(carrusel.actual + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Contenido principal ── */}
      <p className="label-eyebrow mb-3">
        HOSPEDAJE TURÍSTICO Y CORPORATIVO
      </p>

      <h1
        className="font-black text-white leading-tight mb-4 max-w-3xl"
        style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}
      >
        Alojamiento que te lleva{' '}
        <span className="text-(--brand-yellow)">más lejos</span>,{' '}
        con seguridad y confianza
      </h1>

      <p
        className="text-gray-200 leading-relaxed mb-7 max-w-lg"
        style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)' }}
      >
        Hoteles verificados en Cajamarca y todo el Perú. Reserva directa,
        sin comisiones y con confirmación inmediata por WhatsApp.
      </p>

      <StatsBar config={config} coberturaTexto={coberturaTexto} />

      <div ref={wrapperRef} className="w-full max-w-5xl relative">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-full p-1.5">
          <div className="bg-white rounded-xl sm:rounded-full shadow-xl overflow-visible">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row sm:divide-x divide-gray-100 items-stretch">
                <Dropdown
                  label="Destino"
                  value={ciudad}
                  placeholder="¿A qué ciudad viajas?"
                  triggerIcon={<MapPin size={13} />}
                  opciones={opcionesCiudad}
                  onChange={handleCiudadChange}
                  mensajeVacio="Sin ciudades disponibles"
                  isFirst
                  searchable
                />
                <Dropdown
                  label="Categoría"
                  value={categoria}
                  placeholder="Cualquier clase"
                  triggerIcon={<Star size={13} />}
                  opciones={opcionesCategoria}
                  onChange={handleCategoriaChange}
                />
                <Dropdown
                  label="Tipo de alojamiento"
                  value={tipo}
                  placeholder="Cualquier tipo"
                  triggerIcon={<Building2 size={13} />}
                  opciones={opcionesTipo}
                  onChange={handleTipoChange}
                  cargando={cargandoTipos}
                  mensajeVacio={ciudad ? 'Sin tipos en esta ciudad' : 'Selecciona una ciudad primero'}
                />
              </div>
            </form>
          </div>
        </div>

        <PanelResultados
          resultados={resultados}
          cargando={cargandoResultados}
          visible={panelVisible}
          total={totalResultados}
          anchorRef={wrapperRef}
          panelRef={panelRef}
          onVerTodos={navegar}
        />
        {hayFiltros && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {ciudad && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <MapPin size={10} />
                {ciudad}
              </span>
            )}
            {categoria && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Star size={10} />
                {CATEGORIAS.find(c => c.value === categoria)?.label}
              </span>
            )}
            {tipo && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Building2 size={10} />
                {tipo}
              </span>
            )}
            <button
              type="button"
              onClick={() => { setCiudad(''); setCategoria(''); setTipo(''); setPanelVisible(false); }}
              className="text-white/50 hover:text-white text-[10px] font-semibold transition-colors underline underline-offset-2"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
