'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorAdmin({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-md">
        <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#001f3f] mb-3">Algo salio mal</h2>
        <p className="text-gray-500 mb-6 text-sm">Ocurrio un error al cargar esta seccion del panel.</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-[#ffd600] text-[#001f3f] font-black px-6 py-3 rounded-xl hover:bg-yellow-300"
        >
          <RotateCcw size={16} />
          Reintentar
        </button>
      </div>
    </div>
  );
}
