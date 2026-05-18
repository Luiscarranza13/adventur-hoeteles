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
      <section className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-yellow)]/20 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Legal</p>
          <h1 className="heading-hero mb-3">Términos y Condiciones</h1>
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
                titulo: 'Aceptación de los términos',
                texto: 'Al acceder y utilizar la plataforma de Adventur Hoteles, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.',
              },
              {
                num: '02',
                titulo: 'Descripción del servicio',
                texto: 'Adventur Hoteles es una plataforma de intermediación que conecta a usuarios con establecimientos de hospedaje verificados en el Perú. Las reservas se gestionan directamente a través de WhatsApp, sin comisiones adicionales para el usuario.',
              },
              {
                num: '03',
                titulo: 'Reservas y pagos',
                texto: 'Las reservas se confirman directamente con el establecimiento a través de WhatsApp. El precio mostrado en la plataforma es referencial; el precio final y las condiciones de pago son acordadas directamente con el hotel. Adventur Hoteles no procesa pagos ni actúa como intermediario financiero.',
              },
              {
                num: '04',
                titulo: 'Responsabilidad',
                texto: 'Adventur Hoteles actúa como plataforma de conexión y no se hace responsable por la calidad del servicio prestado por los establecimientos, cancelaciones, cambios de precio o cualquier inconveniente surgido durante la estadía. La relación contractual se establece directamente entre el usuario y el establecimiento.',
              },
              {
                num: '05',
                titulo: 'Uso de la plataforma',
                texto: 'El usuario se compromete a utilizar la plataforma de forma lícita y a no realizar acciones que puedan dañar, deshabilitar o sobrecargar los servicios. Queda prohibido el uso de la plataforma para fines fraudulentos o ilegales.',
              },
              {
                num: '06',
                titulo: 'Modificaciones',
                texto: 'Adventur Hoteles se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en la plataforma. El uso continuado del servicio implica la aceptación de los nuevos términos.',
              },
              {
                num: '07',
                titulo: 'Contacto',
                texto: 'Para consultas sobre estos términos, puede contactarnos a través de WhatsApp al +51 958 101 721 o por correo a reservas@adventur.pe.',
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
