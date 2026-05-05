import { Header, Footer } from '@/components/layout/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Adventur Hoteles',
  description: 'Términos y condiciones del servicio de Adventur Hoteles.',
};

export default function PaginaTerminos() {
  return (
    <>
      <Header />
      <section className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Legal</p>
          <h1 className="heading-hero mb-3">Términos y Condiciones</h1>
          <p className="text-gray-400 text-sm">Última actualización: enero 2025</p>
        </div>
      </section>
      <main className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-sm prose-gray">
          <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">1. Aceptación de los términos</h2>
              <p>Al acceder y utilizar la plataforma de Adventur Hoteles, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">2. Descripción del servicio</h2>
              <p>Adventur Hoteles es una plataforma de intermediación que conecta a usuarios con establecimientos de hospedaje verificados en el Perú. Las reservas se gestionan directamente a través de WhatsApp, sin comisiones adicionales para el usuario.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">3. Reservas y pagos</h2>
              <p>Las reservas se confirman directamente con el establecimiento a través de WhatsApp. El precio mostrado en la plataforma es referencial; el precio final y las condiciones de pago son acordadas directamente con el hotel. Adventur Hoteles no procesa pagos ni actúa como intermediario financiero.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">4. Responsabilidad</h2>
              <p>Adventur Hoteles actúa como plataforma de conexión y no se hace responsable por la calidad del servicio prestado por los establecimientos, cancelaciones, cambios de precio o cualquier inconveniente surgido durante la estadía. La relación contractual se establece directamente entre el usuario y el establecimiento.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">5. Uso de la plataforma</h2>
              <p>El usuario se compromete a utilizar la plataforma de forma lícita y a no realizar acciones que puedan dañar, deshabilitar o sobrecargar los servicios. Queda prohibido el uso de la plataforma para fines fraudulentos o ilegales.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">6. Modificaciones</h2>
              <p>Adventur Hoteles se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en la plataforma. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--brand-navy)] mb-3">7. Contacto</h2>
              <p>Para consultas sobre estos términos, puede contactarnos a través de WhatsApp al <strong>+51 958 101 721</strong> o por correo a <strong>reservas@adventur.pe</strong>.</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
