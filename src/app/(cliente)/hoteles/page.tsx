import { Header, Footer } from '@/components/layout/Header';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Hotel, Search, LayoutGrid, List } from 'lucide-react';

async function obtenerHoteles(ciudad?: string, estrellas?: number) {
  try {
    const servicio = new ServicioHoteles(new AdaptadorSupabaseHotel());
    let hoteles = ciudad ? await servicio.buscarPorCiudad(ciudad) : await servicio.listarActivos();
    if (estrellas) hoteles = hoteles.filter(h => h.estrellas === estrellas);
    return hoteles;
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ ciudad?: string; estrellas?: string; orden?: string; vista?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { ciudad, estrellas } = await searchParams;
  const title = ciudad
    ? `Hoteles en ${ciudad} — Adventur Hoteles`
    : estrellas
    ? `Hoteles ${estrellas} estrellas en Perú — Adventur Hoteles`
    : 'Hoteles en Perú — Adventur Hoteles';
  const description = ciudad
    ? `Encuentra los mejores hoteles en ${ciudad}, Perú. Reserva directa por WhatsApp, sin comisiones.`
    : 'Hoteles verificados en todo el Perú. Reserva directa por WhatsApp, sin comisiones.';
  return { title, description, openGraph: { title, description, type: 'website' } };
}

export default async function PaginaHoteles({ searchParams }: PageProps) {
  const { ciudad, estrellas, orden, vista = 'grid' } = await searchParams;
  let hoteles = await obtenerHoteles(ciudad, estrellas ? Number(estrellas) : undefined);

  if (orden === 'nombre') hoteles = [...hoteles].sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (orden === 'estrellas_asc') hoteles = [...hoteles].sort((a, b) => a.estrellas - b.estrellas);
  if (orden === 'estrellas_desc') hoteles = [...hoteles].sort((a, b) => b.estrellas - a.estrellas);

  const ciudadesUnicas = [...new Set(hoteles.map(h => h.ciudad))];

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (ciudad) params.set('ciudad', ciudad);
    if (estrellas) params.set('estrellas', estrellas);
    if (orden) params.set('orden', orden);
    if (vista !== 'grid') params.set('vista', vista);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === '') params.delete(k);
      else params.set(k, v);
    });
    const q = params.toString();
    return `/hoteles${q ? `?${q}` : ''}`;
  };

  // Shared pill classes
  const pillActive = 'bg-[#001f3f] text-white rounded-lg px-3 py-1.5 text-xs font-medium';
  const pillInactive = 'text-gray-500 hover:text-[#001f3f] rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors';
  const sectionLabel = 'text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2';

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-[#001f3f] pt-20 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-[Montserrat]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#ffd600_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-[#ffd600] uppercase tracking-widest mb-2">
              Explora el Perú
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {ciudad ? `Hoteles en ${ciudad}` : 'Nuestros Destinos'}
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-medium">
              <span className="text-white font-bold">{hoteles.length}</span> alojamientos verificados
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-white/60 hover:text-white transition-colors shrink-0"
          >
            ← Volver al inicio
          </Link>
        </div>
      </section>

      <main className="bg-gray-50 min-h-screen font-[Montserrat]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {/* Mobile filter pills — visible only below lg */}
          <div className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto">
            <div className="flex items-center gap-2 w-max pb-1">
              {/* Ciudad pills */}
              <Link href={buildUrl({ ciudad: undefined })} className={!ciudad ? pillActive : pillInactive}>
                Todos
              </Link>
              {ciudadesUnicas.map(c => (
                <Link key={c} href={buildUrl({ ciudad: c })} className={ciudad === c ? pillActive : pillInactive}>
                  {c}
                </Link>
              ))}

              {/* Divider */}
              <span className="w-px h-5 bg-gray-200 mx-1 shrink-0" />

              {/* Estrellas pills */}
              <Link href={buildUrl({ estrellas: undefined })} className={!estrellas ? pillActive : pillInactive}>
                Todas
              </Link>
              {[5, 4, 3].map(n => (
                <Link
                  key={n}
                  href={buildUrl({ estrellas: n.toString() })}
                  className={estrellas === n.toString() ? pillActive : pillInactive}
                >
                  {n}★
                </Link>
              ))}

              {/* Divider */}
              <span className="w-px h-5 bg-gray-200 mx-1 shrink-0" />

              {/* Orden pills */}
              {[
                { val: undefined, label: 'Recomendados' },
                { val: 'estrellas_desc', label: 'Mayor categoría' },
                { val: 'nombre', label: 'A–Z' },
              ].map(({ val, label }) => (
                <Link
                  key={label}
                  href={buildUrl({ orden: val })}
                  className={(orden ?? '') === (val ?? '') ? pillActive : pillInactive}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Desktop sidebar — hidden on mobile */}
            <aside className="hidden lg:block w-full lg:w-52 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-[#001f3f]">Filtros</span>
                  {(ciudad || estrellas) && (
                    <Link
                      href="/hoteles"
                      className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition-colors"
                    >
                      Limpiar
                    </Link>
                  )}
                </div>

                {/* Destino */}
                <div className="mb-4">
                  <p className={sectionLabel}>Destino</p>
                  <div className="flex flex-col gap-0.5">
                    <Link href={buildUrl({ ciudad: undefined })} className={!ciudad ? pillActive : pillInactive}>
                      Todos
                    </Link>
                    {ciudadesUnicas.map(c => (
                      <Link
                        key={c}
                        href={buildUrl({ ciudad: c })}
                        className={`${ciudad === c ? pillActive : pillInactive} truncate`}
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-4" />

                {/* Categoría */}
                <div className="mb-4">
                  <p className={sectionLabel}>Categoría</p>
                  <div className="flex flex-col gap-0.5">
                    <Link href={buildUrl({ estrellas: undefined })} className={!estrellas ? pillActive : pillInactive}>
                      Todas
                    </Link>
                    {[5, 4, 3].map(n => (
                      <Link
                        key={n}
                        href={buildUrl({ estrellas: n.toString() })}
                        className={`${estrellas === n.toString() ? pillActive : pillInactive} flex items-center gap-1.5`}
                      >
                        <span>{n} Estrellas</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-4" />

                {/* Ordenar */}
                <div>
                  <p className={sectionLabel}>Ordenar</p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { val: undefined, label: 'Recomendados' },
                      { val: 'estrellas_desc', label: 'Mayor categoría' },
                      { val: 'nombre', label: 'Alfabético' },
                    ].map(({ val, label }) => (
                      <Link
                        key={label}
                        href={buildUrl({ orden: val })}
                        className={(orden ?? '') === (val ?? '') ? pillActive : pillInactive}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-gray-500">
                  <span className="font-bold text-[#001f3f]">{hoteles.length}</span>{' '}
                  {hoteles.length === 1 ? 'resultado' : 'resultados'}
                </p>
                {(ciudad || estrellas) && (
                  <Link
                    href="/hoteles"
                    className="text-[10px] font-semibold text-gray-400 hover:text-[#001f3f] transition-colors uppercase tracking-widest"
                  >
                    Ver todos
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {hoteles.map((hotel, i) => (
                  <AnimarAlEntrar key={hotel.id} delay={i * 0.05}>
                    <Link href={`/hoteles/${hotel.id}`} className="block h-full">
                      <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group h-full flex flex-col">

                        {/* Image */}
                        <div className="relative h-40 sm:h-44 shrink-0 overflow-hidden bg-gray-100">
                          <ImagenSegura
                            src={hotel.imagenesUrls[0] ?? ''}
                            alt={`Hotel ${hotel.nombre}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Stars badge */}
                          <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded-lg flex items-center gap-0.5 shadow-sm">
                            {Array.from({ length: hotel.estrellas }).map((_, j) => (
                              <Star key={j} size={9} className="text-[#ffd600] fill-[#ffd600]" />
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-center gap-1 mb-1.5">
                            <MapPin size={11} className="text-[#ffd600] shrink-0" />
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide truncate">
                              {hotel.ciudad}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-[#001f3f] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#ffd600] transition-colors">
                            {hotel.nombre}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-3">
                            {hotel.descripcion}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                              Ver detalles
                            </span>
                            <div className="w-6 h-6 rounded-full bg-gray-50 group-hover:bg-[#ffd600] flex items-center justify-center transition-colors">
                              <ArrowRight size={11} className="text-gray-400 group-hover:text-[#001f3f]" />
                            </div>
                          </div>
                        </div>

                      </article>
                    </Link>
                  </AnimarAlEntrar>
                ))}

                {hoteles.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-100 p-8">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Hotel size={24} />
                    </div>
                    <h2 className="text-base font-bold text-[#001f3f] mb-1">Sin resultados</h2>
                    <p className="text-gray-400 text-xs mb-5 font-medium">Prueba ajustando los filtros.</p>
                    <Link
                      href="/hoteles"
                      className="inline-flex items-center gap-2 bg-[#001f3f] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#002d5a] transition-all"
                    >
                      <Search size={12} />
                      Quitar filtros
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: ciudad ? `Hoteles en ${ciudad}` : 'Hoteles en Perú',
            numberOfItems: hoteles.length,
            itemListElement: hoteles.map((hotel, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Hotel',
                name: hotel.nombre,
                address: { '@type': 'PostalAddress', addressLocality: hotel.ciudad, addressCountry: 'PE' },
                starRating: { '@type': 'Rating', ratingValue: hotel.estrellas },
                url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hoteles.adventur.pe'}/hoteles/${hotel.id}`,
              },
            })),
          }),
        }}
      />
    </>
  );
}
