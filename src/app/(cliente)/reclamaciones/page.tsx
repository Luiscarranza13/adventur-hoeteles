import { Header, Footer } from '@/components/layout/Header';
import { FormularioReclamacion } from './FormularioReclamacion';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones — Adventur Hoteles',
  description: 'Presenta tu queja o reclamo a Adventur Hoteles conforme al Código de Protección al Consumidor.',
};

export default function PaginaReclamaciones() {
  return (
    <>
      <Header />
      <section className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Atención al consumidor</p>
          <h1 className="heading-hero mb-3">Libro de Reclamaciones</h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Conforme al Art. 150 del Código de Protección y Defensa del Consumidor (Ley N° 29571).
          </p>
        </div>
      </section>
      <main className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <p className="text-xs text-gray-500 leading-relaxed">
              La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. El proveedor debe dar respuesta al reclamo en un plazo no mayor a <strong>30 días calendario</strong>.
            </p>
          </div>
          <FormularioReclamacion />
        </div>
      </main>
      <Footer />
    </>
  );
}
