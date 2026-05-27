'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { FormDrawer } from '@/components/admin/FormDrawer';
import { SubidorImagenes } from '@/components/admin/SubidorImagenes';
import { BarraFiltros } from '@/components/admin/BarraFiltros';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import type { Habitacion, EstadoMantenimiento, Moneda, RegimeAlimentacion, TipoCama, TipoHabitacion } from '@/modules/habitaciones/dominio/entidades/Habitacion';
import { ETIQUETAS_TIPO_HABITACION } from '@/modules/habitaciones/dominio/entidades/Habitacion';
import type { Hotel } from '@/modules/hoteles';
import Swal from 'sweetalert2';
import {
  Plus, Pencil, Trash2, BedDouble, Users,
  Save, Loader2, CheckCircle2, XCircle, AlertCircle,
  Hotel as HotelIcon, ImageIcon
} from 'lucide-react';

type FormHabitacion = {
  hotelId: string; nombre: string; descripcion: string;
  numeroHabitacion?: string; tipoHabitacion: TipoHabitacion;
  tipoCama?: TipoCama | '';
  regimenAlimentacion?: RegimeAlimentacion | '';
  capacidadPersonas: number; cantidadCamas: number;
  precioNoche: number; moneda: Moneda; amenidades: string[];
  imagenes_urls: string[];
  estaDisponible: boolean;
  estadoMantenimiento: EstadoMantenimiento;
};

const formVacio: FormHabitacion = {
  hotelId: '', nombre: '', descripcion: '',
  numeroHabitacion: '', tipoHabitacion: 'DBL',
  tipoCama: '', regimenAlimentacion: '',
  capacidadPersonas: 1, cantidadCamas: 1,
  precioNoche: 1, moneda: 'USD', amenidades: [], imagenes_urls: [],
  estaDisponible: true,
  estadoMantenimiento: 'disponible',
};

const TIPOS_HABITACION = Object.entries(ETIQUETAS_TIPO_HABITACION) as [TipoHabitacion, string][];
export default function PaginaHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormHabitacion>(formVacio);
  const [, setErrores] = useState<Partial<Record<keyof FormHabitacion, string>>>({});
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroHotel, setFiltroHotel] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMoneda, setFiltroMoneda] = useState('');

  const cargar = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/datos');
      if (!res.ok) throw new Error('No autorizado');
      const { hoteles: hotels, habitaciones: habs } = await res.json();
      setHabitaciones(habs ?? []); setHoteles(hotels ?? []);
      if (hotels?.length > 0) setForm(f => ({ ...f, hotelId: f.hotelId || hotels[0].id }));
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar(); }, [cargar]);

  const habitacionesFiltradas = useMemo(() => {
    return habitaciones.filter(h => {
      const q = busqueda.toLowerCase();
      const nombreHotel = hoteles.find(ho => ho.id === h.hotelId)?.nombre ?? '';
      const coincideBusqueda = !busqueda ||
        h.nombre.toLowerCase().includes(q) ||
        nombreHotel.toLowerCase().includes(q) ||
        (h.descripcion ?? '').toLowerCase().includes(q);
      const coincideHotel = !filtroHotel || h.hotelId === filtroHotel;
      const coincideTipo = !filtroTipo || h.tipoHabitacion === filtroTipo;
      const coincideEstado = !filtroEstado || h.estadoMantenimiento === filtroEstado;
      const coincideMoneda = !filtroMoneda || (h.moneda ?? 'USD') === filtroMoneda;
      return coincideBusqueda && coincideHotel && coincideTipo && coincideEstado && coincideMoneda;
    });
  }, [habitaciones, hoteles, busqueda, filtroHotel, filtroTipo, filtroEstado, filtroMoneda]);

  const hayFiltros = !!(busqueda || filtroHotel || filtroTipo || filtroEstado || filtroMoneda);
  const limpiarFiltros = () => { setBusqueda(''); setFiltroHotel(''); setFiltroTipo(''); setFiltroEstado(''); setFiltroMoneda(''); };

  const abrirNuevo = () => {
    setForm({ ...formVacio, hotelId: hoteles[0]?.id || '' });
    setErrores({});
    setEditandoId(null); setDrawerOpen(true);
  };
  const abrirEditar = (h: Habitacion) => {
    setForm({
      hotelId: h.hotelId, nombre: h.nombre, descripcion: h.descripcion ?? '',
      numeroHabitacion: h.numeroHabitacion,
      tipoHabitacion: h.tipoHabitacion,
      tipoCama: h.tipoCama ?? '',
      regimenAlimentacion: h.regimenAlimentacion ?? '',
      capacidadPersonas: h.capacidadPersonas, cantidadCamas: h.cantidadCamas,
      precioNoche: h.precioNoche,
      moneda: h.moneda ?? 'USD',
      amenidades: h.amenidades,
      imagenes_urls: h.imagenesUrls ?? [],
      estaDisponible: h.estaDisponible,
      estadoMantenimiento: h.estadoMantenimiento,
    });
    setErrores({});
    setEditandoId(h.id); setDrawerOpen(true);
  };

  const validarHabitacion = (): boolean => {
    const e: Partial<Record<keyof FormHabitacion, string>> = {};
    if (!form.hotelId) e.hotelId = 'Selecciona un hotel';
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    else if (form.nombre.trim().length > 140) e.nombre = 'Máximo 140 caracteres';
    if (form.capacidadPersonas < 1 || form.capacidadPersonas > 20) e.capacidadPersonas = 'Entre 1 y 20 personas';
    if (form.cantidadCamas < 1 || form.cantidadCamas > 10) e.cantidadCamas = 'Entre 1 y 10 camas';
    if (!form.precioNoche || form.precioNoche <= 0) e.precioNoche = 'El precio debe ser mayor a 0';
    else if (form.precioNoche > 999999) e.precioNoche = 'Precio demasiado alto';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarHabitacion()) return;
    setGuardando(true);
     try {
       const method = editandoId ? 'PUT' : 'POST';
       const datos = { hotel_id: form.hotelId, nombre: form.nombre, descripcion: form.descripcion, numero_habitacion: form.numeroHabitacion, tipo_habitacion: form.tipoHabitacion, tipo_cama: form.tipoCama, regimen_alimentacion: form.regimenAlimentacion, capacidad_personas: form.capacidadPersonas, cantidad_camas: form.cantidadCamas, precio_noche: form.precioNoche, moneda: form.moneda, amenidades: form.amenidades, imagenes_urls: form.imagenes_urls, esta_disponible: form.estaDisponible, estado_mantenimiento: form.estadoMantenimiento };
       const body = editandoId ? { id: editandoId, ...datos } : datos;
       const res = await fetch('/api/admin/habitaciones', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detalles?.[0]?.mensaje ?? data?.error ?? 'No se pudo guardar la habitacion.');
      }
      setDrawerOpen(false);
      await Swal.fire({ icon: 'success', title: editandoId ? '¡Habitación actualizada!' : '¡Habitación creada!', timer: 1500, showConfirmButton: false, timerProgressBar: true });
      setForm({ ...formVacio, hotelId: hoteles[0]?.id || '' }); setEditandoId(null);
      cargar();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error instanceof Error ? error.message : 'No se pudo guardar la habitacion.', confirmButtonColor: '#001f3f' });
    } finally { setGuardando(false); }
  };

  const eliminar = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      icon: 'warning', title: '¿Eliminar habitación?',
      html: `Se eliminará <strong>${nombre}</strong>.<br><small class="text-gray-500">Esta acción no se puede deshacer.</small>`,
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/admin/habitaciones?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'No se pudo eliminar.');
      }
      Swal.fire({ icon: 'success', title: 'Habitación eliminada', timer: 1200, showConfirmButton: false });
      cargar();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error instanceof Error ? error.message : 'No se pudo eliminar.', confirmButtonColor: '#001f3f' });
    }
  };

  const nombreHotel = (hotelId: string) => hoteles.find(h => h.id === hotelId)?.nombre ?? 'Desconocido';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#001f3f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando habitaciones...</p>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#001f3f] flex items-center gap-2">
              <BedDouble size={22} /> Gestionar Habitaciones
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{habitacionesFiltradas.length} de {habitaciones.length} habitaciones</p>
          </div>
          <button onClick={abrirNuevo}
            className="flex items-center gap-2 bg-[#001f3f] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#002d5a] active:scale-95 transition-all text-sm shadow-sm">
            <Plus size={16} /> Nueva Habitación
          </button>
        </div>

        {/* Filtros */}
        <BarraFiltros busqueda={busqueda} onBusqueda={setBusqueda} placeholder="Buscar por nombre, hotel o descripción..." total={habitaciones.length} filtrado={habitacionesFiltradas.length} hayFiltrosActivos={hayFiltros} onLimpiar={limpiarFiltros}>
          {/* Hotel */}
          <select aria-label="Filtrar por hotel" value={filtroHotel} onChange={e => setFiltroHotel(e.target.value)} className={`text-xs px-3 py-2 rounded-xl border transition-all focus:outline-none ${filtroHotel ? 'border-[#ffd600] bg-yellow-50 text-[#001f3f] font-bold' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
            <option value="">Todos los hoteles</option>
            {hoteles.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
          </select>

          {/* Tipo */}
          <select aria-label="Filtrar por tipo de habitacion" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className={`text-xs px-3 py-2 rounded-xl border transition-all focus:outline-none ${filtroTipo ? 'border-[#ffd600] bg-yellow-50 text-[#001f3f] font-bold' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
            <option value="">Todos los tipos</option>
            {TIPOS_HABITACION.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          {/* Estado */}
          <select aria-label="Filtrar por estado" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={`text-xs px-3 py-2 rounded-xl border transition-all focus:outline-none ${filtroEstado ? 'border-[#ffd600] bg-yellow-50 text-[#001f3f] font-bold' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="bloqueado">Bloqueado</option>
          </select>

          {/* Moneda */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5">
            {[{ val: '', label: 'Todas' }, { val: 'USD', label: '$ USD' }, { val: 'PEN', label: 'S/ PEN' }].map(({ val, label }) => (
              <button key={val} type="button" aria-label={`Filtrar por moneda ${label}`} onClick={() => setFiltroMoneda(val)}
                className={`text-xs px-2.5 py-0.5 rounded-lg transition-all font-medium ${filtroMoneda === val ? 'bg-[#001f3f] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {label}
              </button>
            ))}
          </div>
        </BarraFiltros>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {habitacionesFiltradas.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group">
              {/* Imagen */}
              <div className="relative h-36 bg-linear-to-br from-blue-900 to-blue-700 overflow-hidden">
                {h.imagenesUrls?.[0] ? (
                  <ImagenSegura
                    src={h.imagenesUrls[0]}
                    alt={h.nombre}
                    fill
                    className="opacity-80 group-hover:scale-105 transition-transform duration-500"
                    sizes="400px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon size={28} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" aria-label={`Editar habitacion ${h.nombre}`} onClick={() => abrirEditar(h)} className="p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-lg transition-colors shadow-sm">
                    <Pencil size={13} aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={`Eliminar habitacion ${h.nombre}`} onClick={() => eliminar(h.id, h.nombre)} className="p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-lg transition-colors shadow-sm">
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#001f3f] truncate">{h.nombre}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{nombreHotel(h.hotelId)}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs">
                    {h.estadoMantenimiento === 'disponible'
                      ? <><CheckCircle2 size={12} className="text-green-500" /><span className="text-green-600">Disponible</span></>
                      : h.estadoMantenimiento === 'mantenimiento'
                      ? <><AlertCircle size={12} className="text-yellow-500" /><span className="text-yellow-600">Mantenimiento</span></>
                      : <><XCircle size={12} className="text-red-400" /><span className="text-red-500">Bloqueado</span></>}
                  </span>
                </div>
                {h.descripcion && <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{h.descripcion}</p>}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1 text-sm font-bold text-[#001f3f]">
                    <span className="text-[#ffd600] text-xs font-bold">{h.moneda === 'PEN' ? 'S/' : '$'}</span>
                    {h.precioNoche}
                    <span className="text-xs font-normal text-gray-400">/noche</span>
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                    {h.moneda ?? 'USD'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={12} />{h.capacidadPersonas} personas
                  </span>
                </div>
              </div>
            </div>
          ))}
          {habitacionesFiltradas.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BedDouble size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No se encontraron habitaciones</p>
              {hayFiltros && <button onClick={limpiarFiltros} className="mt-3 text-sm text-[#ffd600] hover:underline">Limpiar filtros</button>}
            </div>
          )}
        </div>
      </div>

      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editandoId ? 'Editar Habitación' : 'Nueva Habitación'}
        subtitle={editandoId ? 'Modifica los datos de la habitación' : 'Agrega una nueva habitación al hotel'}
        icon={<BedDouble size={16} className="text-[#001f3f]" />}
      >
        <form onSubmit={guardar} className="space-y-5">
          <SubidorImagenes
            key={`habitacion-${editandoId ?? 'nuevo'}-${form.imagenes_urls.join('|')}`}
            bucket="imagenes"
            carpeta="habitaciones"
            imagenesActuales={form.imagenes_urls}
            onChange={urls => setForm(f => ({ ...f, imagenes_urls: urls }))}
            maxImagenes={4}
          />

          <div>
            <label htmlFor="habitacion-hotel" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Hotel <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <HotelIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                id="habitacion-hotel"
                className="w-full pl-10 pr-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 appearance-none"
                value={form.hotelId}
                onChange={e => setForm({ ...form, hotelId: e.target.value })}
                required
              >
                {hoteles.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
              </select>
            </div>
          </div>

          <Input
            label="Nombre de la habitación"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Suite Presidencial"
            icon={<BedDouble size={15} />}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Número de habitación"
              value={form.numeroHabitacion || ''}
              onChange={e => setForm({ ...form, numeroHabitacion: e.target.value })}
              placeholder="Ej: 101"
              hint="Opcional"
            />
            <div>
              <label htmlFor="habitacion-tipo" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tipo de habitación
              </label>
              <select
                id="habitacion-tipo"
                className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 appearance-none"
                value={form.tipoHabitacion}
                onChange={e => setForm({ ...form, tipoHabitacion: e.target.value as TipoHabitacion })}
              >
                {TIPOS_HABITACION.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacidad (personas)"
              type="number" min={1} max={20}
              value={form.capacidadPersonas}
              onChange={e => setForm({ ...form, capacidadPersonas: Math.max(1, parseInt(e.target.value) || 1) })}
              icon={<Users size={15} />}
              hint="Mínimo 1 persona"
            />
            <Input
              label="Cantidad de camas"
              type="number" min={1} max={10}
              value={form.cantidadCamas}
              onChange={e => setForm({ ...form, cantidadCamas: Math.max(1, parseInt(e.target.value) || 1) })}
              hint="Mínimo 1 cama"
            />
          </div>

          {/* Precio + Moneda */}
          <div>
            <label htmlFor="habitacion-precio" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Precio por noche
            </label>
            <div className="flex gap-2">
              {/* Selector de moneda */}
              <div className="flex rounded-t-lg border-0 border-b-2 border-gray-200 bg-gray-50 overflow-hidden focus-within:border-[#ffd600]">
                {(['USD', 'PEN'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, moneda: m }))}
                    className={`px-3 py-3 text-xs font-bold transition-all ${
                      form.moneda === m
                        ? 'bg-[#001f3f] text-[#ffd600]'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {m === 'USD' ? '$ USD' : 'S/ PEN'}
                  </button>
                ))}
              </div>
              {/* Input precio */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">
                  {form.moneda === 'USD' ? '$' : 'S/'}
                </span>
                <input
                  id="habitacion-precio"
                  type="number"
                  min={1}
                  step={0.01}
                  value={form.precioNoche}
                  onChange={e => setForm({ ...form, precioNoche: Math.max(0.01, parseFloat(e.target.value) || 1) })}
                  className="w-full pl-7 pr-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Debe ser mayor a 0</p>
          </div>

          <div>
            <label id="habitacion-amenidades-label" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Amenidades
            </label>
            <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="habitacion-amenidades-label">
              {['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi', 'Balcón'].map(amenidad => (
                <label key={amenidad} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.amenidades.includes(amenidad)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(f => ({ ...f, amenidades: [...f.amenidades, amenidad] }));
                      } else {
                        setForm(f => ({ ...f, amenidades: f.amenidades.filter(a => a !== amenidad) }));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#ffd600] focus:ring-[#ffd600]"
                  />
                  <span className="text-sm text-gray-600">{amenidad}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="habitacion-descripcion" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Descripción
            </label>
            <textarea
              id="habitacion-descripcion"
              className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none"
              rows={3}
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe la habitación, sus comodidades..."
            />
          </div>

          <div>
            <label htmlFor="habitacion-estado" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Estado <span className="text-red-400">*</span>
            </label>
            <select
              id="habitacion-estado"
              className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 appearance-none"
              value={form.estadoMantenimiento}
              onChange={e => setForm({ ...form, estadoMantenimiento: e.target.value as EstadoMantenimiento })}
            >
              <option value="disponible">Disponible</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={guardando}
              className="flex-1 flex items-center justify-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold py-3 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-60 text-sm shadow-sm shadow-[#ffd600]/30">
              {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editandoId ? 'Guardar cambios' : 'Crear Habitación'}
            </button>
            <button type="button" onClick={() => setDrawerOpen(false)}
              className="px-5 border border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm">
              Cancelar
            </button>
          </div>
        </form>
      </FormDrawer>
    </>
  );
}
