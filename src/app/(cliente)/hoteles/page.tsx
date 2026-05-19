import { Header, Footer } from '@/components/layout/Header';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import { obtenerDestinos } from '@/lib/destinos';
import { anexarPreciosMinimos, obtenerHotelesBase } from '@/lib/hoteles-consultas';
import { CATEGORIA_OPCIONES, ORDEN_OPCIONES, PRECIO_OPCIONES, TIPOS_ALOJAMIENTO, construirUrlHoteles } from '@/lib/hoteles-opciones';
import { getPublicEnv } from '@/lib/env';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Hotel, Search, X, LayoutGrid, List } from 'lucide-react';
import FiltrosSidebar from './FiltrosSidebar';

// ─── Data fetching ────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{
    ciudad?: string;
    estrellas?: string;
    orden?: string;
    q?: string;
    tipo?: string;
    precio?: string;
    vista?: string;
  }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { ciudad, estrellas } = await searchParams;
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  const title = ciudad
    ? `Hoteles en ${ciudad} — Adventur Hoteles`
    : estrellas
    ? `Hoteles ${estrellas} estrellas en Perú — Adventur Hoteles`
    : 'Hoteles en Perú — Adventur Hoteles';
  const description = ciudad
    ? `Encuentra los mejores hoteles en ${ciudad}, Perú. Reserva directa por WhatsApp, sin comisiones.`
    : 'Hoteles verificados en todo el Perú. Reserva directa por WhatsApp, sin comisiones.';
  const url = ciudad
    ? `${siteUrl}/hoteles?ciudad=${encodeURIComponent(ciudad)}`
    : `${siteUrl}/hoteles`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: 'website', url },
    twitter: { card: 'summary_large_image', title, description },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PaginaHoteles({ searchParams }: PageProps) {
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  const { ciudad, estrellas, orden, q, tipo, precio, vista = 'grid' } = await searchParams;

  const [hotelesRaw, destinos] = await Promise.all([
    obtenerHotelesBase(ciudad),
    obtenerDestinos(),
  ]);
  const hotelesConPrecio = await anexarPreciosMinimos(hotelesRaw);

  // ── Client-side filters applied server-side ──────────────────────────────
  let hoteles = [...hotelesConPrecio];

  if (estrellas) {
    hoteles = hoteles.filter((h) => h.estrellas === Number(estrellas));
  }

  // Filter by search query
  if (q) {
    const qLower = q.toLowerCase();
    hoteles = hoteles.filter(
      (h) =>
        h.nombre.toLowerCase().includes(qLower) ||
        h.descripcion.toLowerCase().includes(qLower) ||
        h.ciudad.toLowerCase().includes(qLower),
    );
  }

  // Filter by tipo
  if (tipo) {
    hoteles = hoteles.filter((h) => h.tipoAlojamiento === tipo);
  }

  if (precio === 'hasta100') {
    hoteles = hoteles.filter((h) => h.precioMinimo !== null && h.precioMinimo <= 100);
  } else if (precio === '100a300') {
    hoteles = hoteles.filter((h) => h.precioMinimo !== null && h.precioMinimo >= 100 && h.precioMinimo <= 300);
  } else if (precio === 'mas300') {
    hoteles = hoteles.filter((h) => h.precioMinimo !== null && h.precioMinimo > 300);
  }

  // ── Sorting ──────────────────────────────────────────────────────────────
  if (orden === 'nombre') hoteles.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  if (orden === 'estrellas_asc') hoteles.sort((a, b) => a.estrellas - b.estrellas);
  if (orden === 'estrellas_desc') hoteles.sort((a, b) => b.estrellas - a.estrellas);
  if (orden === 'precio_asc') {
    hoteles.sort((a, b) => (a.precioMinimo ?? Number.MAX_SAFE_INTEGER) - (b.precioMinimo ?? Number.MAX_SAFE_INTEGER));
  }
  if (orden === 'precio_desc') {
    hoteles.sort((a, b) => (b.precioMinimo ?? -1) - (a.precioMinimo ?? -1));
  }

  // ── Destination tree ─────────────────────────────────────────────────────
  const departamentos = [
    ...new Set(destinos.map((d) => d.departamento)),
  ].sort((a, b) => a.localeCompare(b, 'es'));

  const ciudadesPorDepartamento = departamentos.reduce<Record<string, string[]>>((acc, dep) => {
    acc[dep] = destinos
      .filter((d) => d.departamento === dep && d.tipo !== 'departamento')
      .map((d) => d.nombre);
    return acc;
  }, {});

  // ── Counts per filter option ─────────────────────────────────────────────
  const countPorEstrellas = CATEGORIA_OPCIONES.reduce<Record<string, number>>((acc, opt) => {
    acc[opt.val] = opt.val === '' ? hotelesConPrecio.length : hotelesConPrecio.filter((h) => h.estrellas === Number(opt.val)).length;
    return acc;
  }, {});

  const countPorTipo = TIPOS_ALOJAMIENTO.reduce<Record<string, number>>((acc, opt) => {
    acc[opt.val] = hotelesConPrecio.filter((h) => h.tipoAlojamiento === opt.val).length;
    return acc;
  }, {});

  const countPorCiudad = destinos.reduce<Record<string, number>>((acc, d) => {
    acc[d.nombre] = hotelesConPrecio.filter((h) => h.ciudad === d.nombre).length;
    return acc;
  }, {});

  // ── Active filters ────────────────────────────────────────────────────────
  const filtrosActivos: { key: string; label: string; clearParam: Record<string, string | undefined> }[] = [];
  if (q) filtrosActivos.push({ key: 'q', label: `"${q}"`, clearParam: { q: undefined } });
  if (estrellas) {
    const cat = CATEGORIA_OPCIONES.find((c) => c.val === estrellas);
    filtrosActivos.push({ key: 'estrellas', label: `${estrellas}★ ${cat?.label ?? ''}`, clearParam: { estrellas: undefined } });
  }
  if (tipo) filtrosActivos.push({ key: 'tipo', label: tipo, clearParam: { tipo: undefined } });
  if (precio) {
    const p = PRECIO_OPCIONES.find((o) => o.val === precio);
    filtrosActivos.push({ key: 'precio', label: p?.label ?? precio, clearParam: { precio: undefined } });
  }
  if (ciudad) filtrosActivos.push({ key: 'ciudad', label: ciudad, clearParam: { ciudad: undefined } });

  const hayFiltros = filtrosActivos.length > 0;

  // ── buildUrl helper ───────────────────────────────────────────────────────
  const buildUrl = (updates: Record<string, string | undefined>) => {
    return construirUrlHoteles({ ciudad, estrellas, orden, q, tipo, precio, vista }, updates);
  };

  // ── Active filter summary text ────────────────────────────────────────────
  const resumenFiltros = filtrosActivos.map((f) => f.label).join(', ');

  return (
    <>
      <Header />

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <section className="bg-[#001f3f] pt-20 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,#ffd600_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd600]/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-[#ffd600] uppercase tracking-[0.3em] mb-3">
              Explora el Perú
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              {ciudad ? `Hoteles en ${ciudad}` : 'Todos los Destinos'}
            </h1>
            <p className="text-gray-400 text-sm mt-2.5 flex items-center gap-2">
              <span className="text-white font-bold text-base">{hoteles.length}</span>
              <span>alojamientos encontrados</span>
              {hayFiltros && (
                <span className="text-[#ffd600]/60 text-xs">· {resumenFiltros}</span>
              )}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white transition-colors shrink-0 border border-white/10 hover:border-white/30 px-4 py-2 rounded-full"
          >
            ← Volver al inicio
          </Link>
        </div>
      </section>

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar (client component for mobile toggle + dest search) ── */}
          <FiltrosSidebar
            hayFiltros={hayFiltros}
            filtrosActivosCount={filtrosActivos.length}
            ciudad={ciudad}
            estrellas={estrellas}
            orden={orden}
            q={q}
            tipo={tipo}
            precio={precio}
            currentParams={{ ciudad, estrellas, orden, q, tipo, precio }}
            categoriaOpciones={CATEGORIA_OPCIONES}
            tiposAlojamiento={TIPOS_ALOJAMIENTO}
            precioOpciones={PRECIO_OPCIONES}
            ordenOpciones={ORDEN_OPCIONES}
            departamentos={departamentos}
            ciudadesPorDepartamento={ciudadesPorDepartamento}
            countPorEstrellas={countPorEstrellas}
            countPorTipo={countPorTipo}
            countPorCiudad={countPorCiudad}
          />

          {/* ── Results area ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {hayFiltros && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {filtrosActivos.map((f) => (
                  <Link
                    key={f.key}
                    href={buildUrl(f.clearParam)}
                    className="inline-flex items-center gap-1.5 bg-[#001f3f] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#002d5a] transition-colors"
                  >
                    {f.label}
                    <X size={10} />
                  </Link>
                ))}
                <Link
                  href="/hoteles"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-600 transition-colors ml-1"
                >
                  <X size={10} />
                  Limpiar todo
                </Link>
              </div>
            )}

            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-[#001f3f]">{hoteles.length}</span>{' '}
                {hoteles.length === 1 ? 'resultado' : 'resultados'}
                {ciudad && (
                  <span className="text-gray-400"> en <span className="font-semibold text-[#001f3f]">{ciudad}</span></span>
                )}
              </p>
              <div className="flex items-center gap-3">
                {hayFiltros && (
                  <Link href="/hoteles" className="text-[10px] font-semibold text-gray-400 hover:text-[#001f3f] transition-colors uppercase tracking-widest flex items-center gap-1">
                    <X size={10} />
                    Ver todos
                  </Link>
                )}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
                  <Link
                    href={buildUrl({ vista: 'grid' })}
                    className={`p-1.5 rounded-lg transition-all ${vista === 'grid' ? 'bg-white shadow-sm text-[#001f3f]' : 'text-gray-400 hover:text-[#001f3f]'}`}
                    aria-label="Vista cuadrícula"
                  >
                    <LayoutGrid size={14} />
                  </Link>
                  <Link
                    href={buildUrl({ vista: 'lista' })}
                    className={`p-1.5 rounded-lg transition-all ${vista === 'lista' ? 'bg-white shadow-sm text-[#001f3f]' : 'text-gray-400 hover:text-[#001f3f]'}`}
                    aria-label="Vista lista"
                  >
                    <List size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile quick-filter chips */}
            <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
              <div className="flex items-center gap-2 w-max pb-1">
                <Link
                  href={buildUrl({ ciudad: undefined })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                    !ciudad
                      ? 'bg-[#001f3f] text-white border-[#001f3f] font-semibold'
                      : 'border-gray-200 text-gray-500 hover:border-[#001f3f]'
                  }`}
                >
                  Todos
                </Link>
                {[...new Set(hotelesRaw.map((h) => h.ciudad))].map((c) => (
                  <Link
                    key={c}
                    href={buildUrl({ ciudad: c })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                      ciudad === c
                        ? 'bg-[#001f3f] text-white border-[#001f3f] font-semibold'
                        : 'border-gray-200 text-gray-500 hover:border-[#001f3f]'
                    }`}
                  >
                    {c}
                  </Link>
                ))}
                <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
                {[5, 4, 3, 2, 1].map((n) => (
                  <Link
                    key={n}
                    href={buildUrl({ estrellas: n.toString() })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                      estrellas === n.toString()
                        ? 'bg-[#001f3f] text-white border-[#001f3f] font-semibold'
                        : 'border-gray-200 text-gray-500 hover:border-[#001f3f]'
                    }`}
                  >
                    {n}★
                  </Link>
                ))}
              </div>
            </div>

            {/* Hotel cards grid / list */}
            <div className={vista === 'lista' ? 'flex flex-col gap-3' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'}>
              {hoteles.map((hotel, i) => (
                <AnimarAlEntrar key={hotel.id} delay={i * 0.04}>
                  <Link href={`/hoteles/${hotel.id}`} className="block h-full">

                    {vista === 'lista' ? (
                      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-row">
                        <div className="relative w-40 sm:w-52 shrink-0 overflow-hidden bg-gray-100">
                          <ImagenSegura
                            src={hotel.imagenesUrls[0] ?? ''}
                            alt={`Hotel ${hotel.nombre}`}
                            fill
                            sizes="(max-width: 640px) 160px, 208px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-0.5 shadow-sm">
                            {Array.from({ length: hotel.estrellas }).map((_, j) => (
                              <Star key={j} size={10} className="text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <MapPin size={11} className="text-[#ffd600] shrink-0" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{hotel.ciudad}</span>
                            {hotel.tipoAlojamiento && (
                              <span className="ml-auto text-[10px] font-semibold text-[#001f3f] bg-[#ffd600]/15 px-2.5 py-0.5 rounded-full shrink-0">
                                {hotel.tipoAlojamiento}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#001f3f] leading-snug mb-1.5 line-clamp-1 group-hover:text-[#001f3f] transition-colors">
                            {hotel.nombre}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-3">
                            {hotel.descripcion}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              {hotel.precioMinimo ? (
                                <>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Desde</p>
                                  <p className="text-lg font-black text-[#001f3f] leading-none">S/{hotel.precioMinimo}</p>
                                </>
                              ) : (
                                <span className="text-xs font-semibold text-gray-400">Ver detalles</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#001f3f] group-hover:bg-[#ffd600] text-white group-hover:text-[#001f3f] px-3 py-1.5 rounded-full transition-all duration-300 text-[10px] font-black uppercase tracking-widest">
                              <ArrowRight size={11} />
                              <span>Ver</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ) : (
                      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group h-full flex flex-col">
                        <div className="relative h-44 sm:h-48 shrink-0 overflow-hidden bg-gray-100">
                          <ImagenSegura
                            src={hotel.imagenesUrls[0] ?? ''}
                            alt={`Hotel ${hotel.nombre}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Overlay gradiente en hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-0.5 shadow-sm">
                            {Array.from({ length: hotel.estrellas }).map((_, j) => (
                              <Star key={j} size={10} className="text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          {hotel.tipoAlojamiento && (
                            <div className="absolute top-3 right-3 bg-[#001f3f]/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] font-bold text-white shadow-sm">
                              {hotel.tipoAlojamiento}
                            </div>
                          )}
                          {/* Precio sobre la imagen */}
                          {hotel.precioMinimo && (
                            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md">
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Desde</p>
                              <p className="text-base font-black text-[#001f3f] leading-none">S/{hotel.precioMinimo}</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-1.5 mb-2">
                            <MapPin size={11} className="text-[#ffd600] shrink-0" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{hotel.ciudad}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-[#001f3f] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#001f3f] transition-colors">
                            {hotel.nombre}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-4">{hotel.descripcion}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-[10px] font-semibold text-gray-400">
                              {hotel.precioMinimo ? 'Precio disponible' : 'Consultar precio'}
                            </span>
                            <div className="flex items-center gap-1.5 bg-[#001f3f] group-hover:bg-[#ffd600] text-white group-hover:text-[#001f3f] px-3 py-1.5 rounded-full transition-all duration-300 text-[10px] font-black uppercase tracking-widest">
                              <ArrowRight size={11} />
                              <span>Ver hotel</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    )}

                  </Link>
                </AnimarAlEntrar>
              ))}

              {hoteles.length === 0 && (
                <div className={`${vista === 'lista' ? '' : 'col-span-full'} py-16 text-center bg-white rounded-xl border border-gray-100 p-8`}>
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Hotel size={24} />
                  </div>
                  <h2 className="text-base font-bold text-[#001f3f] mb-1">Sin resultados</h2>
                  <p className="text-gray-400 text-xs mb-5">
                    Prueba con otro destino o categoría.
                  </p>
                  <Link
                    href="/hoteles"
                    className="inline-flex items-center gap-2 bg-[#001f3f] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#002d5a] transition-all"
                  >
                    <Search size={12} />
                    Ver todos los hoteles
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* JSON-LD */}
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
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: hotel.ciudad,
                  addressCountry: 'PE',
                },
                starRating: { '@type': 'Rating', ratingValue: hotel.estrellas },
                url: `${siteUrl}/hoteles/${hotel.id}`,
              },
            })),
          }),
        }}
      />
    </>
  );
}
