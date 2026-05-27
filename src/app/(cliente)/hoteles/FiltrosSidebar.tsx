'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SlidersHorizontal, X, Star, MapPin, Search,
  ChevronDown, ChevronRight, Filter, Building2,
  Hotel, Home, Layers, TreePine, Leaf, Backpack,
  DollarSign, ArrowUpDown, CheckCircle2,
} from 'lucide-react';
import type { TipoAlojamiento } from '@/modules/hoteles/dominio/entidades/Hotel';
import { construirUrlHoteles, type ParametrosHoteles } from '@/lib/hoteles-opciones';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoriaOpcion { val: string; label: string; stars: number; }
interface TipoOpcion { val: TipoAlojamiento; emoji: string; }
interface PrecioOpcion { val: string; label: string; }
interface OrdenOpcion { val: string; label: string; }

interface FiltrosSidebarProps {
  hayFiltros: boolean;
  filtrosActivosCount: number;
  ciudad?: string;
  estrellas?: string;
  orden?: string;
  q?: string;
  tipo?: string;
  precio?: string;
  currentParams: ParametrosHoteles;
  categoriaOpciones: CategoriaOpcion[];
  tiposAlojamiento: TipoOpcion[];
  precioOpciones: PrecioOpcion[];
  ordenOpciones: OrdenOpcion[];
  departamentos: string[];
  ciudadesPorDepartamento: Record<string, string[]>;
  countPorEstrellas: Record<string, number>;
  countPorTipo: Record<string, number>;
  countPorCiudad: Record<string, number>;
}

// ─── Icono por tipo de alojamiento ───────────────────────────────────────────

const ICONO_TIPO: Record<string, React.ReactNode> = {
  Hotel:         <Hotel size={13} />,
  Hostal:        <Home size={13} />,
  'Apart-hotel': <Layers size={13} />,
  Resort:        <TreePine size={13} />,
  Ecolodge:      <Leaf size={13} />,
  Albergue:      <Backpack size={13} />,
};

// ─── Sección colapsable ───────────────────────────────────────────────────────

function Seccion({
  titulo,
  icono,
  children,
  defaultOpen = true,
}: {
  titulo: string;
  icono: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
      >
        <span className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <span className="text-gray-400 group-hover:text-[#001f3f] transition-colors">{icono}</span>
          {titulo}
        </span>
        <ChevronDown
          size={13}
          className={`text-gray-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

// ─── Contenido del sidebar ────────────────────────────────────────────────────

function SidebarContenido({
  hayFiltros, filtrosActivosCount, ciudad, estrellas, orden, q, tipo, precio,
  currentParams, categoriaOpciones, tiposAlojamiento, precioOpciones, ordenOpciones,
  departamentos, ciudadesPorDepartamento, countPorEstrellas, countPorTipo, countPorCiudad,
  onClose,
}: FiltrosSidebarProps & { onClose?: () => void }) {
  const router = useRouter();
  const [destSearch, setDestSearch] = useState('');
  const [collapsedDeps, setCollapsedDeps] = useState<Set<string>>(new Set());

  const toggleDep = useCallback((dep: string) => {
    setCollapsedDeps(prev => {
      const next = new Set(prev);
      if (next.has(dep)) {
        next.delete(dep);
      } else {
        next.add(dep);
      }
      return next;
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = (new FormData(e.currentTarget).get('q') as string) ?? '';
    router.push(construirUrlHoteles(currentParams, { q: val || undefined }));
    onClose?.();
  };

  const filteredDeps = destSearch
    ? departamentos.filter(dep =>
        dep.toLowerCase().includes(destSearch.toLowerCase()) ||
        (ciudadesPorDepartamento[dep] ?? []).some(c => c.toLowerCase().includes(destSearch.toLowerCase()))
      )
    : departamentos;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-(--brand-navy)">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-(--brand-yellow)" />
          <span className="text-sm font-black text-white uppercase tracking-widest">Filtros</span>
          {hayFiltros && (
            <span className="w-5 h-5 rounded-full bg-(--brand-yellow) text-(--brand-navy) text-[9px] font-black flex items-center justify-center">
              {filtrosActivosCount}
            </span>
          )}
        </div>
        {hayFiltros && (
          <Link
            href="/hoteles"
            onClick={onClose}
            className="flex items-center gap-1 text-[10px] font-bold text-white/50 hover:text-(--brand-yellow) transition-colors"
          >
            <X size={10} /> Limpiar
          </Link>
        )}
      </div>

      {/* Búsqueda */}
      <div className="px-4 py-3 border-b border-gray-100">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            name="q"
            type="text"
            defaultValue={q ?? ''}
            placeholder="Buscar hotel..."
            className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f]/20 bg-gray-50 placeholder-gray-400 text-[#001f3f]"
          />
          {q && (
            <Link href={construirUrlHoteles(currentParams, { q: undefined })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={11} />
            </Link>
          )}
        </form>
      </div>

      {/* Categoría */}
      <Seccion titulo="Categoría" icono={<Star size={13} />}>
        <div className="flex flex-col gap-0.5">
          {categoriaOpciones.map(({ val, label, stars }) => {
            const activo = val === '' ? !estrellas : estrellas === val;
            const count = countPorEstrellas[val] ?? 0;
            return (
              <Link
                key={val || 'todas'}
                href={construirUrlHoteles(currentParams, { estrellas: val || undefined })}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activo ? 'bg-[#001f3f] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {stars > 0 && (
                    <span className="flex gap-0.5">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} size={8} className={activo ? 'text-[#ffd600] fill-[#ffd600]' : 'text-amber-400 fill-amber-400'} />
                      ))}
                    </span>
                  )}
                  {label}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${activo ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </Seccion>

      {/* Tipo de alojamiento */}
      <Seccion titulo="Tipo" icono={<Building2 size={13} />}>
        <div className="flex flex-col gap-0.5">
          {tiposAlojamiento.map(({ val }) => {
            const activo = tipo === val;
            const count = countPorTipo[val] ?? 0;
            return (
              <Link
                key={val}
                href={construirUrlHoteles(currentParams, { tipo: activo ? undefined : val })}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activo ? 'bg-[#001f3f] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={activo ? 'text-[#ffd600]' : 'text-gray-400'}>
                    {ICONO_TIPO[val] ?? <Building2 size={13} />}
                  </span>
                  {val}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${activo ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </Seccion>

      {/* Precio */}
      <Seccion titulo="Precio" icono={<DollarSign size={13} />}>
        <div className="flex flex-col gap-0.5">
          {precioOpciones.map(({ val, label }) => {
            const activo = (precio ?? '') === val;
            return (
              <Link
                key={val || 'cualquier'}
                href={construirUrlHoteles(currentParams, { precio: val || undefined })}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activo ? 'bg-[#ffd600]/15 text-[#001f3f] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activo ? 'bg-[#ffd600]' : 'bg-gray-200'}`} />
                {label}
              </Link>
            );
          })}
        </div>
      </Seccion>

      {/* Destino */}
      <Seccion titulo="Destino" icono={<MapPin size={13} />} defaultOpen={false}>
        {/* Búsqueda de destino */}
        <div className="relative mb-2">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={destSearch}
            onChange={e => setDestSearch(e.target.value)}
            placeholder="Buscar destino..."
            className="w-full pl-7 pr-3 py-1.5 text-[11px] rounded-lg border border-gray-200 focus:outline-none focus:border-[#001f3f] bg-gray-50 placeholder-gray-400 text-[#001f3f]"
          />
        </div>

        {/* Todo el Perú */}
        <Link
          href={construirUrlHoteles(currentParams, { ciudad: undefined })}
          onClick={onClose}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs mb-1.5 transition-all ${
            !ciudad ? 'bg-[#001f3f] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 size={11} className={!ciudad ? 'text-[#ffd600]' : 'text-gray-400'} />
          Todo el Perú
        </Link>

        {/* Árbol de destinos */}
        <div className="max-h-64 overflow-y-auto space-y-0.5 pr-0.5" style={{ scrollbarWidth: 'thin' }}>
          {filteredDeps.map(dep => {
            const ciudadesDep = (ciudadesPorDepartamento[dep] ?? []).filter(
              c => !destSearch || c.toLowerCase().includes(destSearch.toLowerCase())
            );
            const depActivo = ciudad === dep;
            const tieneCiudadActiva = ciudadesDep.includes(ciudad ?? '');
            const collapsed = collapsedDeps.has(dep);

            return (
              <div key={dep}>
                <div className="flex items-center gap-0.5">
                  {ciudadesDep.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleDep(dep)}
                      className="p-1 text-gray-300 hover:text-[#001f3f] transition-colors shrink-0"
                    >
                      <ChevronRight size={11} className={`transition-transform duration-150 ${collapsed ? '' : 'rotate-90'}`} />
                    </button>
                  )}
                  <Link
                    href={construirUrlHoteles(currentParams, { ciudad: dep })}
                    onClick={onClose}
                    className={`flex-1 flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      depActivo ? 'text-[#001f3f] bg-[#ffd600]/10' : 'text-gray-500 hover:text-[#001f3f] hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1 h-1 rounded-full shrink-0 ${depActivo || tieneCiudadActiva ? 'bg-[#ffd600]' : 'bg-gray-200'}`} />
                      {dep}
                    </span>
                  </Link>
                </div>

                {!collapsed && ciudadesDep.length > 0 && (
                  <div className="ml-5 mt-0.5 flex flex-col gap-0.5">
                    {ciudadesDep.map(c => {
                      const count = countPorCiudad[c] ?? 0;
                      return (
                        <Link
                          key={c}
                          href={construirUrlHoteles(currentParams, { ciudad: c })}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                            ciudad === c ? 'bg-[#001f3f] text-white font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-[#001f3f]'
                          }`}
                        >
                          <span>{c}</span>
                          {count > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${ciudad === c ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {filteredDeps.length === 0 && (
            <p className="text-[11px] text-gray-400 text-center py-3">Sin resultados para &ldquo;{destSearch}&rdquo;</p>
          )}
        </div>
      </Seccion>

      {/* Ordenar */}
      <Seccion titulo="Ordenar" icono={<ArrowUpDown size={13} />} defaultOpen={false}>
        <div className="flex flex-col gap-0.5">
          {ordenOpciones.map(({ val, label }) => {
            const activo = (orden ?? '') === val;
            return (
              <Link
                key={val || 'recomendados'}
                href={construirUrlHoteles(currentParams, { orden: val || undefined })}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activo ? 'bg-[#ffd600]/15 text-[#001f3f] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activo ? 'bg-[#ffd600]' : 'bg-gray-200'}`} />
                {label}
              </Link>
            );
          })}
        </div>
      </Seccion>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FiltrosSidebar(props: FiltrosSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — sticky, scrollable internamente */}
      <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <SidebarContenido {...props} />
        </div>
      </aside>

      {/* Tablet (md) — barra horizontal colapsable encima de resultados */}
      <div className="hidden md:flex lg:hidden w-full mb-4 flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón abrir panel */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#001f3f] text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all"
          >
            <SlidersHorizontal size={13} className="text-[#001f3f]" />
            Filtros
            {props.hayFiltros && (
              <span className="w-4 h-4 rounded-full bg-[#ffd600] text-[#001f3f] text-[8px] font-black flex items-center justify-center">
                {props.filtrosActivosCount}
              </span>
            )}
          </button>

          {/* Quick chips de ciudad */}
          <div className="flex items-center gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            <Link
              href={construirUrlHoteles(props.currentParams, { ciudad: undefined })}
              className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-all shrink-0 ${
                !props.ciudad ? 'bg-[#001f3f] text-white border-[#001f3f] font-semibold' : 'border-gray-200 text-gray-500 hover:border-[#001f3f]'
              }`}
            >
              Todos
            </Link>
            {[5, 4, 3].map(n => (
              <Link
                key={n}
                href={construirUrlHoteles(props.currentParams, { estrellas: n.toString() })}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-all shrink-0 ${
                  props.estrellas === n.toString() ? 'bg-[#001f3f] text-white border-[#001f3f] font-semibold' : 'border-gray-200 text-gray-500 hover:border-[#001f3f]'
                }`}
              >
                {n}<Star size={9} className="fill-current" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile — botón flotante */}
      <div className="md:hidden">
        <div className="fixed bottom-6 right-4 z-40">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 bg-[#001f3f] text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-[#002d5a] transition-colors"
          >
            <Filter size={15} />
            Filtros
            {props.hayFiltros && (
              <span className="w-5 h-5 rounded-full bg-[#ffd600] text-[#001f3f] text-[9px] font-black flex items-center justify-center">
                {props.filtrosActivosCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel deslizante — mobile + tablet cuando se abre */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="bg-white rounded-t-2xl shadow-2xl max-h-[88vh] flex flex-col">
          {/* Header del panel */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#001f3f]" />
              <span className="text-sm font-bold text-[#001f3f]">Filtros</span>
              {props.hayFiltros && (
                <span className="w-5 h-5 rounded-full bg-[#ffd600] text-[#001f3f] text-[9px] font-black flex items-center justify-center">
                  {props.filtrosActivosCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {props.hayFiltros && (
                <Link href="/hoteles" onClick={() => setMobileOpen(false)} className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition-colors">
                  Limpiar todo
                </Link>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={13} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenido scrollable */}
          <div className="overflow-y-auto flex-1">
            <SidebarContenido {...props} onClose={() => setMobileOpen(false)} />
          </div>

          {/* Botón aplicar */}
          <div className="px-5 py-4 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-full bg-[#001f3f] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#002d5a] transition-colors"
            >
              Ver resultados
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
