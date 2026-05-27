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
      <section className="bg-(--brand-navy) pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] bg-size-[28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--brand-yellow)/20 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Atención al consumidor</p>
          <h1 className="heading-hero mb-3">Libro de Reclamaciones</h1>
          <div className="section-divider" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
            Conforme al Art. 150 del Código de Protección y Defensa del Consumidor (Ley N° 29571).
          </p>
        </div>
      </section>
      <main className="bg-(--bg-subtle) py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-(--brand-navy)/5 border border-(--brand-navy)/10 rounded-2xl p-5 sm:p-6 mb-6">
            <p className="text-xs text-gray-600 leading-relaxed">
              La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. El proveedor debe dar respuesta al reclamo en un plazo no mayor a <strong className="text-(--brand-navy)">30 días calendario</strong>.
            </p>
          </div>
          <FormularioReclamacion />
        </div>
      </main>
      <Footer />
    </>
  );
}
