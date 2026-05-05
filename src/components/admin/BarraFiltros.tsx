'use client';

import { Search, X } from 'lucide-react';

interface BarraFiltrosProps {
  busqueda: string;
  onBusqueda: (v: string) => void;
  placeholder?: string;
  total: number;
  filtrado: number;
  children?: React.ReactNode;
  onLimpiar?: () => void;
  hayFiltrosActivos?: boolean;
}

export function BarraFiltros({
  busqueda,
  onBusqueda,
  placeholder = 'Buscar...',
  total,
  filtrado,
  children,
  onLimpiar,
  hayFiltrosActivos,
}: BarraFiltrosProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Buscador */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 focus-within:border-[#ffd600] focus-within:bg-white transition-all">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder={placeholder}
            value={busqueda}
            onChange={e => onBusqueda(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
          />
          {busqueda && (
            <button onClick={() => onBusqueda('')} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filtros adicionales */}
        {children}

        {/* Limpiar filtros */}
        {hayFiltrosActivos && onLimpiar && (
          <button
            onClick={onLimpiar}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-xl hover:bg-red-50 transition-all border border-red-100"
          >
            <X size={12} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Contador de resultados */}
      {(busqueda || hayFiltrosActivos) && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-gray-500">
            Mostrando <span className="font-bold text-[#001f3f]">{filtrado}</span> de <span className="font-bold">{total}</span> resultados
          </span>
          {filtrado === 0 && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Sin resultados
            </span>
          )}
        </div>
      )}
    </div>
  );
}
