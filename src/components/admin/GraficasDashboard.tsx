'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { Hotel, BedDouble, MapPin, Star, DollarSign, Users } from 'lucide-react';

interface HotelData {
  activo: boolean;
  estrellas: number;
  ciudad: string;
}

interface HabitacionData {
  estaDisponible: boolean;
  precioNoche: number;
  capacidadPersonas: number;
  estadoMantenimiento?: string;
}

interface Props {
  hoteles: HotelData[];
  habitaciones: HabitacionData[];
}

// Tooltip personalizado
const TooltipCustom = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      {label && <p className="font-bold text-[#001f3f] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-[#001f3f]">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function GraficasDashboard({ hoteles, habitaciones }: Props) {

  // Hoteles por ciudad
  const dataCiudades = useMemo(() => {
    const grupos: Record<string, number> = {};
    hoteles.forEach(h => { grupos[h.ciudad] = (grupos[h.ciudad] ?? 0) + 1; });
    return Object.entries(grupos)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([ciudad, cantidad]) => ({ ciudad, cantidad }));
  }, [hoteles]);

  // Hoteles por estrellas
  const dataEstrellas = useMemo(() => {
    const grupos: Record<number, number> = {};
    hoteles.forEach(h => { grupos[h.estrellas] = (grupos[h.estrellas] ?? 0) + 1; });
    return Object.entries(grupos)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([estrellas, cantidad]) => ({ label: `${estrellas} ★`, cantidad }));
  }, [hoteles]);

  // Estado habitaciones
  const estadoHabs = useMemo(() => {
    const disponibles = habitaciones.filter(h => h.estadoMantenimiento === 'disponible').length;
    const mantenimiento = habitaciones.filter(h => h.estadoMantenimiento === 'mantenimiento').length;
    const bloqueadas = habitaciones.filter(h => h.estadoMantenimiento === 'bloqueado').length;
    return [
      { name: 'Disponibles', value: disponibles, color: '#10b981' },
      { name: 'Mantenimiento', value: mantenimiento, color: '#f59e0b' },
      { name: 'Bloqueadas', value: bloqueadas, color: '#ef4444' },
    ].filter(d => d.value > 0);
  }, [habitaciones]);

  // Precios por rango
  const dataPrecios = useMemo(() => {
    const rangos = [
      { label: '$0–50', min: 0, max: 50 },
      { label: '$51–100', min: 51, max: 100 },
      { label: '$101–200', min: 101, max: 200 },
      { label: '$201–500', min: 201, max: 500 },
      { label: '$500+', min: 501, max: Infinity },
    ];
    return rangos
      .map(r => ({
        rango: r.label,
        cantidad: habitaciones.filter(h => h.precioNoche >= r.min && h.precioNoche <= r.max).length,
      }))
      .filter(d => d.cantidad > 0);
  }, [habitaciones]);

  // Capacidad
  const dataCapacidad = useMemo(() => {
    const grupos: Record<number, number> = {};
    habitaciones.forEach(h => { grupos[h.capacidadPersonas] = (grupos[h.capacidadPersonas] ?? 0) + 1; });
    return Object.entries(grupos)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([p, cantidad]) => ({ label: `${p} pers.`, cantidad }));
  }, [habitaciones]);

  // Activos vs inactivos
  const activos = hoteles.filter(h => h.activo).length;
  const inactivos = hoteles.length - activos;

  const totalHabs = habitaciones.length;
  const disponiblesCount = habitaciones.filter(h => h.estadoMantenimiento === 'disponible').length;
  const pctDisponible = totalHabs ? Math.round((disponiblesCount / totalHabs) * 100) : 0;

  return (
    <div className="space-y-5">

      {/* Fila 1: Hoteles por ciudad (ancho) + Estado habitaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Hoteles por ciudad */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <MapPin size={14} className="text-[#ffd600]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001f3f] text-sm">Hoteles por ciudad</h3>
              <p className="text-xs text-gray-400">Distribución geográfica</p>
            </div>
          </div>

          {dataCiudades.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataCiudades} margin={{ top: 16, right: 8, left: -24, bottom: 0 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="ciudad"
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<TooltipCustom />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="cantidad" name="Hoteles" radius={[8, 8, 0, 0]}>
                  {dataCiudades.map((_, i) => {
                    const colors = ['#001f3f', '#ffd600', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
                    return <Cell key={i} fill={colors[i % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={<MapPin size={24} />} text="Sin hoteles registrados" />
          )}
        </div>

        {/* Estado habitaciones */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <BedDouble size={14} className="text-[#ffd600]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001f3f] text-sm">Estado habitaciones</h3>
              <p className="text-xs text-gray-400">Disponibilidad actual</p>
            </div>
          </div>

          {estadoHabs.length > 0 ? (
            <>
              {/* Porcentaje central */}
              <div className="flex items-center justify-center my-2">
                <div className="relative">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie
                        data={estadoHabs}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {estadoHabs.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[#001f3f]">{pctDisponible}%</span>
                    <span className="text-[10px] text-gray-400">disponible</span>
                  </div>
                </div>
              </div>
              {/* Leyenda */}
              <div className="space-y-1.5 mt-1">
                {estadoHabs.map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
                      <span className="text-gray-600">{e.name}</span>
                    </div>
                    <span className="font-bold text-[#001f3f]">{e.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState icon={<BedDouble size={24} />} text="Sin habitaciones" />
          )}
        </div>
      </div>

      {/* Fila 2: Categorías + Precios + Capacidad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Hoteles por categoría */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <Star size={14} className="text-[#ffd600]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001f3f] text-sm">Por categoría</h3>
              <p className="text-xs text-gray-400">Clasificación ★</p>
            </div>
          </div>

          {dataEstrellas.length > 0 ? (
            <div className="space-y-2.5">
              {dataEstrellas.map((d, i) => {
                const pct = hoteles.length ? Math.round((d.cantidad / hoteles.length) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-700">{d.label}</span>
                      <span className="font-bold text-[#001f3f]">{d.cantidad} hotel{d.cantidad !== 1 ? 'es' : ''}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#ffd600] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={<Star size={24} />} text="Sin hoteles" />
          )}
        </div>

        {/* Precios por rango */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <DollarSign size={14} className="text-[#ffd600]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001f3f] text-sm">Precios por rango</h3>
              <p className="text-xs text-gray-400">Precio/noche</p>
            </div>
          </div>

          {dataPrecios.length > 0 ? (
            <div className="space-y-2.5">
              {dataPrecios.map((d, i) => {
                const pct = habitaciones.length ? Math.round((d.cantidad / habitaciones.length) * 100) : 0;
                const colors = ['#001f3f', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-700">{d.rango}</span>
                      <span className="font-bold text-[#001f3f]">{d.cantidad} hab.</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: colors[i % colors.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={<DollarSign size={24} />} text="Sin habitaciones" />
          )}
        </div>

        {/* Capacidad */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <Users size={14} className="text-[#ffd600]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001f3f] text-sm">Capacidad</h3>
              <p className="text-xs text-gray-400">Personas por habitación</p>
            </div>
          </div>

          {dataCapacidad.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={dataCapacidad} margin={{ top: 8, right: 8, left: -28, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<TooltipCustom />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="cantidad" name="Habitaciones" fill="#001f3f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={<Users size={24} />} text="Sin habitaciones" />
          )}
        </div>
      </div>

      {/* Fila 3: Actividad hoteles (tarjeta simple) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <Hotel size={14} className="text-[#ffd600]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001f3f] text-sm">Actividad de hoteles</h3>
              <p className="text-xs text-gray-400">Activos vs inactivos</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Barra horizontal */}
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                {hoteles.length > 0 && (
                  <>
                    <div
                      className="h-full bg-[#001f3f] transition-all duration-700"
                      style={{ width: `${(activos / hoteles.length) * 100}%` }}
                    />
                    <div
                      className="h-full bg-gray-300 transition-all duration-700"
                      style={{ width: `${(inactivos / hoteles.length) * 100}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-[#001f3f]" />
                  <span className="text-gray-600">Activos</span>
                  <span className="font-black text-[#001f3f] text-base ml-1">{activos}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-gray-600">Inactivos</span>
                  <span className="font-black text-gray-500 text-base ml-1">{inactivos}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen rápido */}
        <div className="bg-[#001f3f] rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-4">Resumen del inventario</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total hoteles', valor: hoteles.length, sub: `${activos} activos` },
              { label: 'Total habitaciones', valor: habitaciones.length, sub: `${disponiblesCount} disponibles` },
              { label: 'Ciudades', valor: new Set(hoteles.map(h => h.ciudad)).size, sub: 'destinos' },
              { label: 'Disponibilidad', valor: `${pctDisponible}%`, sub: 'del inventario' },
            ].map(({ label, valor, sub }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-black text-[#ffd600]">{valor}</p>
                <p className="text-xs font-semibold text-white mt-0.5">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="h-32 flex flex-col items-center justify-center gap-2 text-gray-300">
      {icon}
      <p className="text-xs text-gray-400">{text}</p>
    </div>
  );
}
