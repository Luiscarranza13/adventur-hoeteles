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
      <section className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Legal</p>
          <h1 className="heading-hero mb-3">Políticas de Privacidad</h1>
          <p className="text-gray-400 text-sm">Última actualización: enero 2025</p>
        </div>
      </section>
      <main className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">1. Responsable del tratamiento</h2>
              <p>HORIZONTE ANDINO COMPANY E.I.R.L., con RUC 20612408255, con domicilio en Jr. Amazonas 1079, Cajamarca, Perú, es responsable del tratamiento de sus datos personales conforme a la Ley N° 29733 — Ley de Protección de Datos Personales del Perú.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">2. Datos que recopilamos</h2>
              <p>Recopilamos únicamente los datos que usted nos proporciona voluntariamente al contactarnos por WhatsApp o a través de nuestros formularios: nombre, número de teléfono, correo electrónico y detalles de su consulta o reserva.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">3. Finalidad del tratamiento</h2>
              <p>Sus datos se utilizan exclusivamente para: gestionar su reserva o consulta, coordinar el servicio con el establecimiento, enviar información relevante sobre su estadía y mejorar nuestros servicios. No utilizamos sus datos para fines publicitarios sin su consentimiento.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">4. Compartición de datos</h2>
              <p>Sus datos pueden ser compartidos con el establecimiento de hospedaje seleccionado, únicamente para gestionar su reserva. No vendemos, alquilamos ni cedemos sus datos a terceros con fines comerciales.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">5. Conservación de datos</h2>
              <p>Conservamos sus datos durante el tiempo necesario para cumplir con la finalidad para la que fueron recopilados y para cumplir con las obligaciones legales aplicables.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">6. Sus derechos</h2>
              <p>Conforme a la Ley N° 29733, usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contáctenos a <strong>reservas@adventur.pe</strong> o al <strong>+51 958 101 721</strong>.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">7. Seguridad</h2>
              <p>Implementamos medidas técnicas y organizativas para proteger sus datos contra acceso no autorizado, pérdida o alteración. La comunicación a través de WhatsApp está protegida por el cifrado de extremo a extremo de la plataforma.</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
