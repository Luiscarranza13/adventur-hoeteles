import { Header, Footer } from '@/components/layout/Header';
import { FormularioContacto } from './FormularioContacto';
import { Metadata } from 'next';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto — Adventur Hoteles',
  description: 'Contáctanos para reservas, consultas o información sobre nuestros hoteles en Cajamarca y todo el Perú.',
};

const datos = [
  {
    Icon: MessageCircle,
    titulo: 'WhatsApp',
    valor: '+51 958 101 721',
    sub: 'Respuesta inmediata · La forma más rápida',
    href: 'https://wa.me/51958101721?text=Hola%2C+quiero+consultar+por+un+hotel.',
    externo: true,
    destacado: true,
  },
  {
    Icon: Phone,
    titulo: 'Teléfono',
    valor: '+51 958 101 721',
    sub: 'Lunes a domingo',
    href: 'tel:+51958101721',
    externo: false,
    destacado: false,
  },
  {
    Icon: Mail,
    titulo: 'Correo electrónico',
    valor: 'reservas@adventur.pe',
    sub: 'Respuesta en menos de 24h',
    href: 'mailto:reservas@adventur.pe',
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

export default function PaginaContacto() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-[var(--brand-navy)] pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,var(--brand-yellow)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd600]/30 to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="label-eyebrow mb-3">Estamos aquí para ayudarte</p>
          <h1 className="heading-hero mb-4">Contacto</h1>
          <div className="section-divider" />
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto">
            Todas las reservas y consultas se gestionan directamente por WhatsApp — sin formularios complicados, sin esperas.
          </p>
        </div>
      </section>

      <main className="bg-[var(--bg-subtle)] py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">

            {/* Datos de contacto */}
            <div className="flex flex-col gap-3">
              {datos.map(({ Icon, titulo, valor, sub, href, externo, destacado }) => (
                <div
                  key={titulo}
                  className={`rounded-2xl border p-5 sm:p-6 flex items-center gap-4 transition-all duration-300 ${
                    destacado
                      ? 'bg-[var(--brand-navy)] border-[var(--brand-navy)] shadow-lg shadow-[var(--brand-navy)]/20'
                      : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffd600]/30'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    destacado
                      ? 'bg-[var(--brand-yellow)] shadow-[0_4px_12px_rgba(255,214,0,0.3)]'
                      : 'bg-[var(--bg-subtle)]'
                  }`}>
                    <Icon
                      size={18}
                      className={destacado ? 'text-[var(--brand-navy)]' : 'text-[var(--brand-navy)]'}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${
                      destacado ? 'text-[var(--brand-yellow)]' : 'text-gray-400'
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
                            ? 'text-white hover:text-[var(--brand-yellow)]'
                            : 'text-[var(--brand-navy)] hover:text-[var(--brand-yellow)]'
                        }`}
                      >
                        {valor}
                      </a>
                    ) : (
                      <p className={`text-sm font-bold ${destacado ? 'text-white' : 'text-[var(--brand-navy)]'}`}>{valor}</p>
                    )}
                    <p className={`text-xs mt-0.5 ${destacado ? 'text-white/50' : 'text-gray-400'}`}>{sub}</p>
                  </div>
                  {destacado && (
                    <a
                      href="https://wa.me/51958101721?text=Hola%2C+quiero+consultar+por+un+hotel."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-[var(--brand-yellow)] hover:bg-[var(--brand-yellow-light)] text-[var(--brand-navy)] font-black text-xs px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm whitespace-nowrap"
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
