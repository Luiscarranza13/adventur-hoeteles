'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
      <section className="max-w-[420px] w-full text-center bg-white border border-[#e2e8f0] rounded-3xl px-8 py-10 shadow-[0_20px_40px_-8px_rgba(0,31,63,0.12)]">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-600" />
        </div>

        <h1 className="text-2xl font-black text-[#001f3f] mb-3 tracking-tight leading-tight">
          Algo salió mal
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          La aplicación encontró un problema inesperado. Intenta recargar esta vista.
        </p>

        {error.digest && (
          <p className="mb-5 text-[11px] text-slate-400 font-mono bg-[#f8fafc] px-3 py-2 rounded-lg">
            Ref: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-[#ffd600] hover:bg-[#ffdf33] text-[#001f3f] font-black text-[13px] uppercase tracking-widest px-7 py-3.5 rounded-full border-none cursor-pointer transition-all shadow-[0_4px_14px_rgba(255,214,0,0.35)] hover:shadow-[0_6px_20px_rgba(255,214,0,0.45)] hover:-translate-y-0.5 active:scale-95"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reintentar
        </button>
      </section>
    </main>
  );
}
