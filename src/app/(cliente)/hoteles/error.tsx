'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorHoteles({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6 bg-[var(--bg-subtle)] min-h-[60vh]">
      <div className="text-center bg-white border border-gray-100 rounded-3xl shadow-lg p-10 max-w-md w-full">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[var(--brand-navy)] mb-3 tracking-tight">
          No pudimos cargar los hoteles
        </h2>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          Ocurrió un error inesperado al cargar los resultados. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RotateCcw size={15} />
          Reintentar
        </button>
      </div>
    </div>
  );
}
