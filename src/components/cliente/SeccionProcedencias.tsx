import { ChevronDown, MapPin } from 'lucide-react';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { crearUrlWhatsApp } from '@/lib/configuracion';
import type { DestinoProcedencia } from '@/lib/destinos';

interface SeccionProcedenciasProps {
  principales: DestinoProcedencia[];
  restantes: DestinoProcedencia[];
  whatsappNumero: string;
}

function hrefProcedencia(destino: DestinoProcedencia, whatsappNumero: string) {
  if (destino.hayOfertaDirecta) {
    return `/hoteles?ciudad=${encodeURIComponent(destino.nombre)}`;
  }

  return crearUrlWhatsApp(
    whatsappNumero,
    `Hola, vengo de ${destino.nombre} y quiero consultar alojamientos disponibles.`,
  );
}

function atributosLinkProcedencia(destino: DestinoProcedencia) {
  if (destino.hayOfertaDirecta) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

function TarjetaProcedencia({
  destino,
  whatsappNumero,
  delay,
}: {
  destino: DestinoProcedencia;
  whatsappNumero: string;
  delay: number;
}) {
  return (
    <AnimarAlEntrar delay={delay}>
      <a
        href={hrefProcedencia(destino, whatsappNumero)}
        {...atributosLinkProcedencia(destino)}
        className="block h-full"
      >
        <article className="group h-full min-h-28 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:border-[var(--brand-yellow)]/50 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-yellow)] truncate">
                {destino.departamento}
              </p>
              <h3 className="mt-2 text-sm sm:text-base font-black text-[var(--brand-navy)] leading-tight group-hover:text-[var(--brand-yellow-light)] transition-colors">
                {destino.nombre}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] group-hover:bg-[var(--brand-navy)] flex items-center justify-center shrink-0 transition-colors">
              <MapPin size={16} className="text-[var(--brand-navy)] group-hover:text-[var(--brand-yellow)] transition-colors" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            {destino.hayOfertaDirecta ? `Ver hoteles en ${destino.nombre}` : 'Consultar por WhatsApp'}
          </p>
        </article>
      </a>
    </AnimarAlEntrar>
  );
}

function ChipProcedencia({ destino }: { destino: DestinoProcedencia }) {
  return (
    <a
      href={`/hoteles?ciudad=${encodeURIComponent(destino.nombre)}`}
      className="rounded-full bg-[var(--bg-subtle)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--brand-navy)] hover:text-white transition-colors"
    >
      {destino.nombre}
    </a>
  );
}

export function SeccionProcedencias({
  principales,
  restantes,
  whatsappNumero,
}: SeccionProcedenciasProps) {
  if (!principales.length) return null;

  return (
    <section id="destinos" className="section-padding bg-[var(--bg-base)]">
      <div className="container-site">
        <AnimarAlEntrar className="text-center mb-16">
          <p className="label-eyebrow mb-2">Lugares de procedencia</p>
          <h2 className="heading-section mb-4">
            Atendemos viajeros de todo el Perú
          </h2>
          <p className="body-text max-w-2xl mx-auto">
            Selecciona tu ciudad, distrito o zona de procedencia para consultar alojamientos disponibles por WhatsApp.
          </p>
        </AnimarAlEntrar>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {principales.map((destino, index) => (
            <TarjetaProcedencia
              key={destino.slug}
              destino={destino}
              whatsappNumero={whatsappNumero}
              delay={(index % 10) * 0.03}
            />
          ))}
        </div>

        {restantes.length > 0 && (
          <details className="max-w-5xl mx-auto mb-8 sm:mb-10 lg:mb-14">
            <summary className="mx-auto flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[var(--border-base)] bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--brand-navy)] hover:border-[var(--brand-yellow)] transition-colors">
              Ver más procedencias
              <ChevronDown size={15} aria-hidden="true" />
            </summary>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {restantes.map((destino) => (
                <ChipProcedencia
                  key={destino.slug}
                  destino={destino}
                />
              ))}
            </div>
          </details>
        )}


      </div>
    </section>
  );
}
