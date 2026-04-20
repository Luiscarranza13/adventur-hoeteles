'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/Input';
import { FormDrawer } from '@/components/admin/FormDrawer';
import { SubidorImagenes } from '@/components/admin/SubidorImagenes';
import type { Habitacion } from '@/modules/habitaciones';
import type { Hotel } from '@/modules/hoteles';
import Swal from 'sweetalert2';
import {
  Plus, Pencil, Trash2, BedDouble, Users,
  DollarSign, Save, Loader2, CheckCircle2, XCircle,
  Hotel as HotelIcon, ImageIcon
} from 'lucide-react';
import Image from 'next/image';

type FormHabitacion = {
  hotelId: string; nombre: string; descripcion: string;
  capacidadPersonas: number; precioNoche: number;
  imagenes_urls: string[]; estaDisponible: boolean;
};

const formVacio: FormHabitacion = {
  hotelId: '', nombre: '', descripcion: '',
  capacidadPersonas: 1, precioNoche: 1, imagenes_urls: [], estaDisponible: true,
};

export default function PaginaHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormHabitacion>(formVacio);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const [habRes, hotelRes] = await Promise.all([fetch('/api/admin/habitaciones'), fetch('/api/admin/hoteles')]);
      const habs: Habitacion[] = await habRes.json();
      const hotels: Hotel[] = await hotelRes.json();
      setHabitaciones(habs); setHoteles(hotels);
      if (hotels.length > 0) setForm(f => ({ ...f, hotelId: f.hotelId || hotels[0].id }));
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  };

  const abrirNuevo = () => {
    setForm({ ...formVacio, hotelId: hoteles[0]?.id || '' });
    setEditandoId(null); setDrawerOpen(true);
  };
  const abrirEditar = (h: Habitacion) => {
    setForm({
      hotelId: h.hotelId, nombre: h.nombre, descripcion: h.descripcion ?? '',
      capacidadPersonas: h.capacidadPersonas, precioNoche: h.precioNoche,
      imagenes_urls: h.imagenesUrls ?? [], estaDisponible: h.estaDisponible,
    });
    setEditandoId(h.id); setDrawerOpen(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const method = editandoId ? 'PUT' : 'POST';
      const body = editandoId
        ? { id: editandoId, hotel_id: form.hotelId, nombre: form.nombre, descripcion: form.descripcion, capacidad_personas: form.capacidadPersonas, precio_noche: form.precioNoche, imagenes_urls: form.imagenes_urls, esta_disponible: form.estaDisponible }
        : { hotel_id: form.hotelId, nombre: form.nombre, descripcion: form.descripcion, capacidad_personas: form.capacidadPersonas, precio_noche: form.precioNoche, imagenes_urls: form.imagenes_urls, esta_disponible: form.estaDisponible };
      const res = await fetch('/api/admin/habitaciones', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      setDrawerOpen(false);
      await Swal.fire({ icon: 'success', title: editandoId ? '¡Habitación actualizada!' : '¡Habitación creada!', timer: 1500, showConfirmButton: false, timerProgressBar: true });
      setForm({ ...formVacio, hotelId: hoteles[0]?.id || '' }); setEditandoId(null);
      cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la habitación.', confirmButtonColor: '#001f3f' });
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
      await fetch(`/api/admin/habitaciones?id=${id}`, { method: 'DELETE' });
      Swal.fire({ icon: 'success', title: 'Habitación eliminada', timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.', confirmButtonColor: '#001f3f' });
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
            <p className="text-gray-500 text-sm mt-0.5">{habitaciones.length} habitaciones registradas</p>
          </div>
          <button onClick={abrirNuevo}
            className="flex items-center gap-2 bg-[#001f3f] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#002d5a] active:scale-95 transition-all text-sm shadow-sm">
            <Plus size={16} /> Nueva Habitación
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {habitaciones.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group">
              {/* Imagen */}
              <div className="relative h-36 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
                {h.imagenesUrls?.[0] ? (
                  <Image
                    src={h.imagenesUrls[0]}
                    alt={h.nombre}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    sizes="400px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon size={28} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirEditar(h)} className="p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-lg transition-colors shadow-sm">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => eliminar(h.id, h.nombre)} className="p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-lg transition-colors shadow-sm">
                    <Trash2 size={13} />
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
                    {h.estaDisponible
                      ? <><CheckCircle2 size={12} className="text-green-500" /><span className="text-green-600">Disponible</span></>
                      : <><XCircle size={12} className="text-red-400" /><span className="text-red-500">No disponible</span></>}
                  </span>
                </div>
                {h.descripcion && <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{h.descripcion}</p>}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1 text-sm font-bold text-[#001f3f]">
                    <DollarSign size={13} className="text-[#ffd600]" />{h.precioNoche}
                    <span className="text-xs font-normal text-gray-400">/noche</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={12} />{h.capacidadPersonas} personas
                  </span>
                </div>
              </div>
            </div>
          ))}
          {habitaciones.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BedDouble size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No hay habitaciones registradas</p>
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
            bucket="imagenes"
            carpeta="habitaciones"
            imagenesActuales={form.imagenes_urls}
            onChange={urls => setForm(f => ({ ...f, imagenes_urls: urls }))}
            maxImagenes={4}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Hotel <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <HotelIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
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
              label="Capacidad (personas)"
              type="number" min={1} max={20}
              value={form.capacidadPersonas}
              onChange={e => setForm({ ...form, capacidadPersonas: Math.max(1, parseInt(e.target.value) || 1) })}
              icon={<Users size={15} />}
              hint="Mínimo 1 persona"
            />
            <Input
              label="Precio por noche ($)"
              type="number" min={1} step={0.01}
              value={form.precioNoche}
              onChange={e => setForm({ ...form, precioNoche: Math.max(0.01, parseFloat(e.target.value) || 1) })}
              icon={<DollarSign size={15} />}
              hint="Debe ser mayor a 0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none"
              rows={3}
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe la habitación, sus comodidades..."
            />
          </div>

          {/* Toggle disponibilidad */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#001f3f]">Habitación disponible</p>
              <p className="text-xs text-gray-400 mt-0.5">Las habitaciones no disponibles no aparecen en el catálogo</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, estaDisponible: !f.estaDisponible }))}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${form.estaDisponible ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.estaDisponible ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
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
