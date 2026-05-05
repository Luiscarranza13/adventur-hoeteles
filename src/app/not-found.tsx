import Link from 'next/link';
import { Header, Footer } from '@/components/layout/Header';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          {/* Número 404 */}
          <div className="relative mb-8">
            <p className="text-[10rem] font-black text-[#001f3f]/5 leading-none select-none">404</p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#001f3f] rounded-3xl flex items-center justify-center shadow-2xl">
                <Search size={40} className="text-[#ffd600]" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-[#001f3f] mb-3">Página no encontrada</h1>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            La página que buscas no existe o fue movida. Vuelve al inicio para explorar nuestros hoteles.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-[#001f3f] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#002d5a] transition-all text-sm"
            >
              <Home size={16} /> Ir al inicio
            </Link>
            <Link
              href="/hoteles"
              className="flex items-center justify-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all text-sm"
            >
              <ArrowLeft size={16} /> Ver hoteles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
