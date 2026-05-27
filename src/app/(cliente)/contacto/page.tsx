import { Header, Footer } from '@/components/layout/Header';
import { FormularioContacto } from './FormularioContacto';
import { obtenerConfiguracionPublica } from '@/lib/configuracion-consultas';
import { crearUrlWhatsApp } from '@/lib/configuracion';
import { Metadata } from 'next';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto — Adventur Hoteles',
  description: 'Contáctanos para reservas, consultas o información sobre nuestros hoteles en Cajamarca y todo el Perú.',
};

export default async function PaginaContacto() {
  const config = await obtenerConfiguracionPublica();
  const whatsappUrl = crearUrlWhatsApp(config.whatsapp_numero, 'Hola, quiero consultar por un hotel.');
  const telefonoDisplay = config.telefono_principal || '+51 958 101 721';
  const telefonoTel = telefonoDisplay.replace(/\s/g, '');
  const emailContacto = config.email_contacto || 'hoteles@adventur.pe';

  const datos = [
    {
      Icon: MessageCircle,
      titulo: 'WhatsApp',
      valor: telefonoDisplay,
      sub: 'Respuesta inmediata · La forma más rápida',
      href: whatsappUrl,
      externo: true,
      destacado: true,
    },
    {
      Icon: Phone,
      titulo: 'Teléfono',
      valor: telefonoDisplay,
      sub: 'Lunes a domingo',
      href: `tel:${telefonoTel}`,
      externo: false,
      destacado: false,
    },
    {
      Icon: Mail,
      titulo: 'Correo electrónico',
      valor: emailContacto,
      sub: 'Respuesta en menos de 24h',
      href: `mailto:${emailContacto}`,
      externo: false,
      destacado: false,
    },
    {
      Icon: MapPin,
      titulo: 'Dirección',
      valor: 'Jr. Amazonas 1079, Cajamarca',
      sub: 'Perú',
      href: null,
      externo: false,
      destacado: false,
    },
    {
      Icon: Clock,
      titulo: 'Horario',
      valor: 'Lunes – Domingo, 8am – 10pm',
      sub: 'Atención todos los días',
      href: null,
      externo: false,
      destacado: false,
    },
  ];
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-(--brand-navy) pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] bg-size-[28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#ffd600]/30 to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Estamos aquí para ayudarte</p>
          <h1 className="heading-hero mb-4">Contacto</h1>
          <div className="section-divider" />
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto">
            Todas las reservas y consultas se gestionan directamente por WhatsApp — sin formularios complicados, sin esperas.
          </p>
        </div>
      </section>

      <main className="bg-(--bg-subtle) py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">

            {/* Datos de contacto */}
            <div className="flex flex-col gap-3">
              {datos.map(({ Icon, titulo, valor, sub, href, externo, destacado }) => (
                <div
                  key={titulo}
                  className={`rounded-2xl border p-5 sm:p-6 flex items-center gap-4 transition-all duration-300 ${
                    destacado
                      ? 'bg-(--brand-navy) border-(--brand-navy) shadow-lg shadow-(--brand-navy)/20'
                      : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffd600]/30'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    destacado
                      ? 'bg-(--brand-yellow) shadow-[0_4px_12px_rgba(255,214,0,0.3)]'
                      : 'bg-(--bg-subtle)'
                  }`}>
                    <Icon
                      size={18}
                      className={destacado ? 'text-(--brand-navy)' : 'text-(--brand-navy)'}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${
                      destacado ? 'text-(--brand-yellow)' : 'text-gray-400'
                    }`}>
                      {titulo}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={externo ? '_blank' : undefined}
                        rel={externo ? 'noopener noreferrer' : undefined}
                        className={`text-sm font-bold transition-colors break-all ${
                          destacado
                            ? 'text-white hover:text-(--brand-yellow)'
                            : 'text-(--brand-navy) hover:text-(--brand-yellow)'
                        }`}
                      >
                        {valor}
                      </a>
                    ) : (
                      <p className={`text-sm font-bold ${destacado ? 'text-white' : 'text-(--brand-navy)'}`}>{valor}</p>
                    )}
                    <p className={`text-xs mt-0.5 ${destacado ? 'text-white/50' : 'text-gray-400'}`}>{sub}</p>
                  </div>
                  {destacado && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-(--brand-yellow) hover:bg-(--brand-yellow-light) text-(--brand-navy) font-black text-xs px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm whitespace-nowrap"
                    >
                      Escribir
                    </a>
                  )}
                </div>
              ))}
            </div>

            <FormularioContacto />

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
