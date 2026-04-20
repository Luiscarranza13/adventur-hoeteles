import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';
import { ServicioHabitaciones, AdaptadorSupabaseHabitacion } from '@/modules/habitaciones';
import Link from 'next/link';
import {
  Hotel, BedDouble, Users, ArrowRight,
  Plus, TrendingUp, MapPin, Star
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

async function getDatos() {
  try {
    const [hoteles, habitaciones] = await Promise.all([
      new ServicioHoteles(new AdaptadorSupabaseHotel()).listarTodos(),
      new ServicioHabitaciones(new AdaptadorSupabaseHabitacion()).listarTodas(),
    ]);
    return { hoteles, habitaciones };
  } catch {
    return { hoteles: [], habitaciones: [] };
  }
}

async function getNombreUsuario() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Admin';
    const { data } = await supabase.from('usuarios').select('nombre_completo').eq('id', user.id).single();
    return data?.nombre_completo?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'Admin';
  } catch {
    return 'Admin';
  }
}

export default async function DashboardPage() {
  const [{ hoteles, habitaciones }, nombre] = await Promise.all([getDatos(), getNombreUsuario()]);

  const hotelActivos = hoteles.filter(h => h.activo).length;
  const habDisponibles = habitaciones.filter(h => h.estaDisponible).length;

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-6">

      {/* Bienvenida */}
      <div className="bg-[#001f3f] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd600]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-400 text-sm">{saludo},</p>
            <h1 className="text-2xl font-extrabold text-white mt-0.5">{nombre} 👋</h1>
            <p className="text-gray-400 text-sm mt-1">
              Tienes <span className="text-[#ffd600] font-bold">{hotelActivos} hoteles activos</span> y{' '}
              <span className="text-[#ffd600] font-bold">{habDisponibles} habitaciones disponibles</span>
            </p>
          </div>
          <Link
            href="/admin/hoteles"
            className="flex items-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all text-sm shadow-lg shadow-[#ffd600]/20"
          >
            <Plus size={15} /> Nuevo Hotel
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hoteles',      valor: hoteles.length,       sub: `${hotelActivos} activos`,       Icon: Hotel,    color: 'bg-[#001f3f]', href: '/admin/hoteles' },
          { label: 'Habitaciones',       valor: habitaciones.length,  sub: `${habDisponibles} disponibles`, Icon: BedDouble, color: 'bg-blue-600',  href: '/admin/habitaciones' },
          { label: 'Ciudades',           valor: new Set(hoteles.map(h => h.ciudad)).size, sub: 'destinos cubiertos', Icon: MapPin, color: 'bg-purple-600', href: '/admin/hoteles' },
          { label: 'Promedio Estrellas', valor: hoteles.length ? (hoteles.reduce((a, h) => a + h.estrellas, 0) / hoteles.length).toFixed(1) : '—', sub: 'calidad promedio', Icon: Star, color: 'bg-amber-500', href: '/admin/hoteles' },
        ].map(({ label, valor, sub, Icon, color, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <TrendingUp size={13} className="text-green-400 mt-1" />
              </div>
              <p className="text-2xl font-extrabold text-[#001f3f]">{valor}</p>
              <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Hoteles recientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-[#001f3f] text-sm flex items-center gap-2">
              <Hotel size={15} className="text-[#ffd600]" /> Hoteles Recientes
            </h3>
            <Link href="/admin/hoteles" className="text-xs text-gray-400 hover:text-[#ffd600] transition-colors flex items-center gap-1">
              Ver todos <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {hoteles.slice(0, 5).map(h => (
              <div key={h.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-9 h-9 bg-[#001f3f] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Hotel size={14} className="text-[#ffd600]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#001f3f] truncate">{h.nombre}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={10} /> {h.ciudad}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: h.estrellas }).map((_, i) => (
                    <Star key={i} size={9} className="text-[#ffd600] fill-[#ffd600]" />
                  ))}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${h.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {h.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
            {hoteles.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No hay hoteles registrados aún
              </div>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-[#001f3f] text-sm mb-4 flex items-center gap-2">
            <ArrowRight size={15} className="text-[#ffd600]" /> Accesos Rápidos
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Gestionar Hoteles',      desc: 'Configura y edita hoteles',    Icon: Hotel,    href: '/admin/hoteles',      color: 'bg-[#001f3f]' },
              { label: 'Gestionar Habitaciones', desc: 'Administra el catálogo',       Icon: BedDouble, href: '/admin/habitaciones', color: 'bg-blue-600' },
              { label: 'Gestionar Usuarios',     desc: 'Administradores del sistema',  Icon: Users,    href: '/admin/usuarios',     color: 'bg-purple-600' },
            ].map(({ label, desc, Icon, href, color }) => (
              <Link key={label} href={href}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`${color} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon size={15} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#001f3f] group-hover:text-[#ffd600] transition-colors">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-[#ffd600] transition-colors ml-auto flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          {/* Tip */}
          <div className="mt-4 bg-[#ffd600]/10 border border-[#ffd600]/20 rounded-xl p-3">
            <p className="text-xs font-semibold text-[#001f3f] mb-0.5">💡 Tip</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Agrega imágenes a tus hoteles para mejorar la conversión de reservas por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
