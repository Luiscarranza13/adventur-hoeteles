import Link from 'next/link';
import { Header, Footer } from '@/components/layout/Header';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-[var(--bg-subtle)] flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#001f3f_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--brand-yellow)]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center max-w-lg">
          {/* Número 404 decorativo */}
          <div className="relative mb-10">
            <p className="text-[9rem] sm:text-[11rem] font-black text-[var(--brand-navy)]/[0.04] leading-none select-none tracking-tighter">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-light)] rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,31,63,0.25)]">
                <Search size={36} className="text-[var(--brand-yellow)]" />
              </div>
            </div>
          </div>

          <p className="label-eyebrow mb-3">Error 404</p>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--brand-navy)] mb-4 leading-tight tracking-tight">
            Página no encontrada
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-sm mx-auto">
            La página que buscas no existe o fue movida. Vuelve al inicio para explorar nuestros hoteles.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Home size={16} aria-hidden="true" />
              Ir al inicio
            </Link>
            <Link
              href="/hoteles"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Search size={16} aria-hidden="true" />
              Ver hoteles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
