import Link from 'next/link';
import {
  Hotel, BedDouble, Users, ArrowRight,
  Plus, MapPin, Star, MessageCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { GraficasDashboard } from '@/components/admin/GraficasDashboard';
import { AnimarAlEntrar } from '@/components/ui/AnimarAlEntrar';
import type { Hotel as HotelType } from '@/modules/hoteles';
import type { Habitacion } from '@/modules/habitaciones';

async function getDatosDashboard() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [hotelesRes, habitacionesRes, perfilRes] = await Promise.all([
      supabase.from('hoteles').select('*').order('fecha_creacion', { ascending: false }),
      supabase.from('habitaciones').select('id, hotel_id, esta_disponible, precio_noche, moneda, estado_mantenimiento, capacidad_personas').order('fecha_creacion', { ascending: false }),
      user ? supabase.from('usuarios').select('nombre_completo').eq('id', user.id).single() : Promise.resolve({ data: null }),
    ]);

    const hoteles = (hotelesRes.data ?? []) as HotelType[];
    const habitaciones = (habitacionesRes.data ?? []).map((h) => ({
      id: h.id,
      hotelId: h.hotel_id,
      precioNoche: Number(h.precio_noche ?? 0),
      moneda: h.moneda ?? 'USD',
      estaDisponible: Boolean(h.esta_disponible),
      estadoMantenimiento: h.estado_mantenimiento ?? 'disponible',
      capacidadPersonas: Number(h.capacidad_personas ?? 0),
    })) as Pick<Habitacion, 'id' | 'hotelId' | 'precioNoche' | 'moneda' | 'estaDisponible' | 'estadoMantenimiento' | 'capacidadPersonas'>[];
    const nombre = perfilRes.data?.nombre_completo?.split(' ')[0]
      ?? user?.email?.split('@')[0]
      ?? 'Admin';

    return { hoteles, habitaciones, nombre };
  } catch {
    return { hoteles: [], habitaciones: [], nombre: 'Admin' };
  }
}

export default async function DashboardPage() {
  const { hoteles, habitaciones, nombre } = await getDatosDashboard();

  const hotelActivos = hoteles.filter(h => h.activo).length;
  const habDisponibles = habitaciones.filter(h => h.estaDisponible).length;
  const ciudades = new Set(hoteles.map(h => h.ciudad)).size;

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-6">

      {/* Bienvenida */}
      <AnimarAlEntrar direction="none" className="bg-(--brand-navy) rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-(--brand-yellow)/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none blur-3xl" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{saludo},</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-0.5">{nombre} 👋</h1>
            <p className="text-gray-400 text-base mt-2">
              Actualmente gestionas <span className="text-(--brand-yellow) font-black">{hotelActivos} hoteles</span> y{' '}
              <span className="text-(--brand-yellow) font-black">{habDisponibles} habitaciones disponibles</span>.
            </p>
          </div>
          <Link
            href="/admin/hoteles"
            className="btn-primary !shadow-yellow-500/10"
          >
            <Plus size={18} /> Nuevo Hotel
          </Link>
        </div>
      </AnimarAlEntrar>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Hoteles',   valor: hoteles.length,      sub: `${hotelActivos} activos`,       Icon: Hotel,     color: 'bg-(--brand-navy)', href: '/admin/hoteles' },
          { label: 'Habitaciones',    valor: habitaciones.length, sub: `${habDisponibles} disponibles`, Icon: BedDouble, color: 'bg-blue-600',  href: '/admin/habitaciones' },
          { label: 'Ciudades',        valor: ciudades,            sub: 'destinos cubiertos',            Icon: MapPin,    color: 'bg-purple-600',href: '/admin/hoteles' },
          { label: 'Promedio ★',      valor: hoteles.length ? (hoteles.reduce((a, h) => a + h.estrellas, 0) / hoteles.length).toFixed(1) : '—', sub: 'calidad promedio', Icon: Star, color: 'bg-amber-500', href: '/admin/hoteles' },
        ].map(({ label, valor, sub, Icon, color, href }, i) => (
          <AnimarAlEntrar key={label} delay={0.1 * i}>
          <Link href={href}>
            <div className="card-premium p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Icon size={16} className="text-gray-300" />
                </div>
              </div>
              <p className="text-3xl font-black text-(--brand-navy)">{valor}</p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
              <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>
            </div>
          </Link>
          </AnimarAlEntrar>
        ))}
      </div>

      {/* Gráficas con recharts */}
      <GraficasDashboard hoteles={hoteles} habitaciones={habitaciones} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hoteles recientes */}
        <div className="lg:col-span-2 card-premium !p-0">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="font-black text-(--brand-navy) text-base flex items-center gap-3">
              <Hotel size={18} className="text-(--brand-yellow)" /> Hoteles Recientes
            </h3>
            <Link href="/admin/hoteles" className="text-xs font-black text-gray-400 hover:text-(--brand-yellow) transition-colors flex items-center gap-2 uppercase tracking-widest">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {hoteles.slice(0, 5).map(h => (
              <div key={h.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 bg-(--brand-navy) rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Hotel size={16} className="text-(--brand-yellow)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-(--brand-navy) truncate uppercase tracking-tight">{h.nombre}</p>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-(--brand-yellow)" /> {h.ciudad}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {Array.from({ length: h.estrellas }).map((_, i) => (
                    <Star key={i} size={10} className="text-(--brand-yellow) fill-(--brand-yellow)" />
                  ))}
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest flex-shrink-0 ${h.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {h.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
            {hoteles.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400 text-sm font-medium">No hay hoteles registrados aún</div>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="card-premium p-6">
          <h3 className="font-black text-(--brand-navy) text-base mb-6 flex items-center gap-3">
            <ArrowRight size={18} className="text-(--brand-yellow)" /> Accesos Rápidos
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Gestionar Hoteles',      desc: 'Configura y edita hoteles',    Icon: Hotel,         href: '/admin/hoteles',      color: 'bg-(--brand-navy)' },
              { label: 'Gestionar Habitaciones', desc: 'Administra el catálogo',       Icon: BedDouble,     href: '/admin/habitaciones', color: 'bg-blue-600' },
              { label: 'Ver Reservas',           desc: 'Leads de WhatsApp',            Icon: MessageCircle, href: '/admin/reservas',     color: 'bg-green-600' },
              { label: 'Gestionar Usuarios',     desc: 'Administradores del sistema',  Icon: Users,         href: '/admin/usuarios',     color: 'bg-purple-600' },
            ].map(({ label, desc, Icon, href, color }) => (
              <Link key={label} href={href}>
                <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                  <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-(--brand-navy) group-hover:text-(--brand-yellow) transition-colors uppercase tracking-tight">{label}</p>
                    <p className="text-xs text-gray-400 font-medium">{desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-(--brand-yellow) transition-all ml-auto flex-shrink-0 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
