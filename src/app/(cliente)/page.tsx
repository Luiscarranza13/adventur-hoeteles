import { Header, Footer } from '@/components/Header';
import { ImagenSegura } from '@/components/ImagenSegura';
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import Link from 'next/link';
import {
  Search, MapPin, MessageCircle, Star,
  Shield, Zap, BadgeDollarSign, ArrowRight,
  Hotel, Users, Globe
} from 'lucide-react';

async function obtenerHoteles() {
  try {
    return await new ServicioHoteles(new AdaptadorSupabaseHotel()).listarActivos();
  } catch {
    return [];
  }
}

export default async function PaginaInicio() {
  const hoteles = await obtenerHoteles();
  const ciudades = [...new Set(hoteles.map(h => h.ciudad))];

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ── */}
        <section className="bg-[#001f3f] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffd600]/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffd600]/5 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-14">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-2 bg-[#ffd600]/10 border border-[#ffd600]/20 text-[#ffd600] text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-[#ffd600] rounded-full animate-pulse" />
                Plataforma Multihotel · Perú
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-5">
                Hoteles que<br />
                <span className="text-[#ffd600]">te esperan</span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md leading-relaxed">
                Encuentra el hotel perfecto y reserva directamente por WhatsApp. Sin comisiones, sin complicaciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/hoteles"
                  className="flex items-center justify-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all text-sm shadow-lg shadow-[#ffd600]/20"
                >
                  <Search size={16} />
                  Explorar hoteles
                </Link>
                <Link
                  href="#como-funciona"
                  className="flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all text-sm border border-white/20"
                >
                  ¿Cómo funciona?
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-64">
              {[
                { n: hoteles.length,  label: 'Hoteles activos',  Icon: Hotel },
                { n: ciudades.length, label: 'Ciudades',         Icon: Globe },
                { n: '0%',            label: 'Comisiones',       Icon: BadgeDollarSign },
                { n: '24/7',          label: 'Soporte WhatsApp', Icon: MessageCircle },
              ].map(({ n, label, Icon }) => (
                <div key={label} className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-5 text-center border border-white/10 group">
                  <Icon size={20} className="text-[#ffd600] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-extrabold text-white">{n}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="bg-white py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">Simple y rápido</span>
              <h2 className="text-3xl font-extrabold text-[#001f3f] mt-2">¿Cómo funciona?</h2>
              <p className="text-gray-500 text-sm mt-2">Reserva en 3 simples pasos</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { n: '01', Icon: Search,         titulo: 'Elige tu hotel',         desc: 'Explora el catálogo y selecciona la habitación que más te guste.' },
                { n: '02', Icon: Users,           titulo: 'Llena el formulario',    desc: 'Ingresa tu nombre, teléfono y fechas de estadía en segundos.' },
                { n: '03', Icon: MessageCircle,   titulo: 'Confirma por WhatsApp',  desc: 'Te redirigimos directo a WhatsApp del hotel para confirmar.' },
              ].map(({ n, Icon, titulo, desc }) => (
                <div key={n} className="relative bg-gray-50 hover:bg-[#001f3f]/5 transition-colors rounded-2xl p-8 text-center group border border-transparent hover:border-[#ffd600]/20">
                  <div className="w-14 h-14 bg-[#001f3f] group-hover:bg-[#ffd600] transition-colors rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-white group-hover:text-[#001f3f] transition-colors" />
                  </div>
                  <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">{n}</span>
                  <h3 className="font-bold text-[#001f3f] text-lg mt-1 mb-2">{titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DESTINOS ── */}
        {ciudades.length > 0 && (
          <section id="destinos" className="bg-gray-50 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">Explora</span>
                  <h2 className="text-3xl font-extrabold text-[#001f3f] mt-1">Destinos Populares</h2>
                </div>
                <Link href="/hoteles" className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#001f3f] hover:text-[#ffd600] transition-colors">
                  Ver todos <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ciudades.map(ciudad => {
                  const hotelCiudad = hoteles.find(h => h.ciudad === ciudad);
                  const cantidad = hoteles.filter(h => h.ciudad === ciudad).length;
                  return (
                    <Link key={ciudad} href={`/hoteles?ciudad=${encodeURIComponent(ciudad)}`}>
                      <div className="relative h-56 rounded-2xl overflow-hidden group bg-[#001f3f] cursor-pointer">
                        <div className="absolute inset-0">
                          <ImagenSegura
                            src={hotelCiudad?.imagenesUrls[0] ?? ''}
                            alt={ciudad}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MapPin size={12} className="text-[#ffd600]" />
                            <h3 className="text-xl font-bold text-white">{ciudad}</h3>
                          </div>
                          <p className="text-[#ffd600] text-xs font-semibold">
                            {cantidad} {cantidad === 1 ? 'hotel disponible' : 'hoteles disponibles'}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 bg-[#ffd600] text-[#001f3f] text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 flex items-center gap-1">
                          Explorar <ArrowRight size={10} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── HOTELES ── */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[#ffd600] text-xs font-bold uppercase tracking-widest">Alojamientos</span>
                <h2 className="text-3xl font-extrabold text-[#001f3f] mt-1">Nuestros Hoteles</h2>
              </div>
              <Link href="/hoteles" className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#001f3f] hover:text-[#ffd600] transition-colors">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hoteles.map(hotel => (
                <Link key={hotel.id} href={`/hoteles/${hotel.id}`}>
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col cursor-pointer">
                    <div className="relative h-52 bg-[#001f3f] overflow-hidden flex-shrink-0">
                      <ImagenSegura
                        src={hotel.imagenesUrls[0] ?? ''}
                        alt={hotel.nombre}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#001f3f]/80 backdrop-blur-sm text-[#ffd600] text-xs font-bold px-2.5 py-1 rounded-lg">
                        <Star size={10} className="fill-[#ffd600]" />
                        {hotel.estrellas}
                      </div>
                      <div className="absolute top-3 right-3 bg-[#ffd600] text-[#001f3f] text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                        Ver <ArrowRight size={10} />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 mb-1.5">
                        <MapPin size={11} className="text-[#ffd600] flex-shrink-0" />
                        <p className="text-[#ffd600] text-xs font-bold uppercase tracking-wider">{hotel.ciudad}</p>
                      </div>
                      <h3 className="text-lg font-bold text-[#001f3f] mb-2 group-hover:text-[#ffd600] transition-colors leading-snug">{hotel.nombre}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">{hotel.descripcion}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400 truncate max-w-[65%]">{hotel.direccion}</span>
                        <span className="text-xs font-bold text-[#001f3f] group-hover:text-[#ffd600] transition-colors whitespace-nowrap flex items-center gap-0.5">
                          Ver habitaciones <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
              {hoteles.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <Hotel size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No hay hoteles disponibles aún</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── CONFIANZA ── */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { Icon: Shield,          titulo: 'Reserva segura',       desc: 'Tu información va directo al hotel, sin intermediarios.' },
              { Icon: Zap,             titulo: 'Respuesta inmediata',   desc: 'WhatsApp garantiza respuesta rápida del equipo de recepción.' },
              { Icon: BadgeDollarSign, titulo: 'Mejor precio',          desc: 'Al reservar directo obtienes el precio real sin comisiones.' },
            ].map(({ Icon, titulo, desc }) => (
              <div key={titulo} className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#ffd600]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#001f3f] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#ffd600]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#001f3f] mb-1">{titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
