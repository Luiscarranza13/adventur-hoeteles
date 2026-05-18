import { Header, Footer } from '@/components/layout/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Políticas de Privacidad — Adventur Hoteles',
  description: 'Políticas de privacidad y tratamiento de datos personales de Adventur Hoteles.',
};

export default function PaginaPrivacidad() {
  return (
    <>
      <Header />
      <section className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-yellow)]/20 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Legal</p>
          <h1 className="heading-hero mb-3">Políticas de Privacidad</h1>
          <div className="section-divider" />
          <p className="text-gray-400 text-sm mt-4">Última actualización: enero 2025</p>
        </div>
      </section>
      <main className="bg-[var(--bg-subtle)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: '01',
                titulo: 'Responsable del tratamiento',
                texto: 'HORIZONTE ANDINO COMPANY E.I.R.L., con RUC 20612408255, con domicilio en Jr. Amazonas 1079, Cajamarca, Perú, es responsable del tratamiento de sus datos personales conforme a la Ley N° 29733 — Ley de Protección de Datos Personales del Perú.',
              },
              {
                num: '02',
                titulo: 'Datos que recopilamos',
                texto: 'Recopilamos únicamente los datos que usted nos proporciona voluntariamente al contactarnos por WhatsApp o a través de nuestros formularios: nombre, número de teléfono, correo electrónico y detalles de su consulta o reserva.',
              },
              {
                num: '03',
                titulo: 'Finalidad del tratamiento',
                texto: 'Sus datos se utilizan exclusivamente para: gestionar su reserva o consulta, coordinar el servicio con el establecimiento, enviar información relevante sobre su estadía y mejorar nuestros servicios. No utilizamos sus datos para fines publicitarios sin su consentimiento.',
              },
              {
                num: '04',
                titulo: 'Compartición de datos',
                texto: 'Sus datos pueden ser compartidos con el establecimiento de hospedaje seleccionado, únicamente para gestionar su reserva. No vendemos, alquilamos ni cedemos sus datos a terceros con fines comerciales.',
              },
              {
                num: '05',
                titulo: 'Conservación de datos',
                texto: 'Conservamos sus datos durante el tiempo necesario para cumplir con la finalidad para la que fueron recopilados y para cumplir con las obligaciones legales aplicables.',
              },
              {
                num: '06',
                titulo: 'Sus derechos',
                texto: 'Conforme a la Ley N° 29733, usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contáctenos a reservas@adventur.pe o al +51 958 101 721.',
              },
              {
                num: '07',
                titulo: 'Seguridad',
                texto: 'Implementamos medidas técnicas y organizativas para proteger sus datos contra acceso no autorizado, pérdida o alteración. La comunicación a través de WhatsApp está protegida por el cifrado de extremo a extremo de la plataforma.',
              },
            ].map(({ num, titulo, texto }) => (
              <div key={num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md hover:border-[var(--brand-yellow)]/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <span className="text-[10px] font-black text-[var(--brand-yellow)] tabular-nums shrink-0 mt-1 bg-[var(--brand-yellow)]/10 px-2 py-1 rounded-lg">{num}</span>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[var(--brand-navy)] mb-2">{titulo}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{texto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
