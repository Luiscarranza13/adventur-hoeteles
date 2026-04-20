'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/Input';
import { FormDrawer } from '@/components/admin/FormDrawer';
import { SubidorImagenes } from '@/components/admin/SubidorImagenes';
import type { Hotel } from '@/modules/hoteles';
import Swal from 'sweetalert2';
import {
  Plus, Pencil, Trash2, Hotel as HotelIcon,
  MapPin, Phone, Star, Save, Loader2, Building2,
  ImageIcon, Search, LayoutGrid, List, Filter
} from 'lucide-react';
import Image from 'next/image';

type FormData = {
  nombre: string; descripcion: string; ciudad: string;
  direccion: string; telefono_whatsapp: string; estrellas: number;
  imagenes_urls: string[]; activo: boolean;
};
const formVacio: FormData = { nombre: '', descripcion: '', ciudad: '', direccion: '', telefono_whatsapp: '', estrellas: 3, imagenes_urls: [], activo: true };

export default function HotelesPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [vistaLista, setVistaLista] = useState(false);
  const [filtroEstrellas, setFiltroEstrellas] = useState(0);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch('/api/admin/hoteles');
      setHoteles(await res.json());
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  };

  const hotelesFiltrados = useMemo(() => {
    return hoteles.filter(h => {
      const coincideBusqueda = !busqueda || h.nombre.toLowerCase().includes(busqueda.toLowerCase()) || h.ciudad.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstrellas = !filtroEstrellas || h.estrellas === filtroEstrellas;
      return coincideBusqueda && coincideEstrellas;
    });
  }, [hoteles, busqueda, filtroEstrellas]);

  const abrirNuevo = () => { setForm(formVacio); setEditingId(null); setDrawerOpen(true); };
  const abrirEditar = (h: Hotel) => {
    setForm({ nombre: h.nombre, descripcion: h.descripcion, ciudad: h.ciudad, direccion: h.direccion, telefono_whatsapp: h.telefonoWhatsapp, estrellas: h.estrellas, imagenes_urls: h.imagenesUrls ?? [], activo: h.activo });
    setEditingId(h.id); setDrawerOpen(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch('/api/admin/hoteles', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      setDrawerOpen(false);
      await Swal.fire({ icon: 'success', title: editingId ? '¡Hotel actualizado!' : '¡Hotel creado!', timer: 1500, showConfirmButton: false, timerProgressBar: true });
      setForm(formVacio); setEditingId(null); cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el hotel.', confirmButtonColor: '#001f3f' });
    } finally { setGuardando(false); }
  };

  const eliminar = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      icon: 'warning', title: '¿Eliminar hotel?',
      html: `Se eliminará <strong>${nombre}</strong> y todas sus habitaciones.<br><small class="text-gray-500">Esta acción no se puede deshacer.</small>`,
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await fetch(`/api/admin/hoteles?id=${id}`, { method: 'DELETE' });
      Swal.fire({ icon: 'success', title: 'Hotel eliminado', timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el hotel.', confirmButtonColor: '#001f3f' });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#001f3f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando hoteles...</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#001f3f] flex items-center gap-2">
              <HotelIcon size={22} /> Gestionar Hoteles
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {hotelesFiltrados.length} de {hoteles.length} hoteles
            </p>
          </div>
          <button onClick={abrirNuevo}
            className="flex items-center gap-2 bg-[#001f3f] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#002d5a] active:scale-95 transition-all text-sm shadow-sm">
            <Plus size={16} /> Nuevo Hotel
          </button>
        </div>

        {/* Barra de herramientas */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 focus-within:border-[#ffd600] transition-colors">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none w-full"
            />
          </div>

          {/* Filtro estrellas */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Filter size={13} className="text-gray-400 mr-1" />
            {[0,1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setFiltroEstrellas(n === filtroEstrellas ? 0 : n)}
                className={`text-xs px-2 py-0.5 rounded-lg transition-all ${filtroEstrellas === n && n > 0 ? 'bg-[#ffd600] text-[#001f3f] font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
                {n === 0 ? 'Todos' : `${n}★`}
              </button>
            ))}
          </div>

          {/* Toggle vista */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button onClick={() => setVistaLista(false)}
              className={`p-1.5 rounded-lg transition-all ${!vistaLista ? 'bg-[#001f3f] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setVistaLista(true)}
              className={`p-1.5 rounded-lg transition-all ${vistaLista ? 'bg-[#001f3f] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Vista Grid */}
        {!vistaLista && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotelesFiltrados.map(h => (
              <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group">
                <div className="relative h-44 bg-gradient-to-br from-[#001f3f] to-[#002d5a] overflow-hidden">
                  {h.imagenesUrls?.[0] ? (
                    <Image src={h.imagenesUrls[0]} alt={h.nombre} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon size={32} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-0.5 mb-1">
                      {Array.from({ length: h.estrellas }).map((_, i) => <Star key={i} size={10} className="text-[#ffd600] fill-[#ffd600]" />)}
                    </div>
                    <p className="text-white font-bold text-sm">{h.nombre}</p>
                    <p className="text-gray-300 text-xs flex items-center gap-1"><MapPin size={9} />{h.ciudad}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => abrirEditar(h)} className="p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-lg shadow-sm"><Pencil size={13} /></button>
                    <button onClick={() => eliminar(h.id, h.nombre)} className="p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-lg shadow-sm"><Trash2 size={13} /></button>
                  </div>
                  {h.imagenesUrls?.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      +{h.imagenesUrls.length - 1}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{h.descripcion}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={10} className="text-green-500" />
                      <span className="font-mono text-xs">{h.telefonoWhatsapp}</span>
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {h.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {hotelesFiltrados.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HotelIcon size={28} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">{busqueda ? 'No se encontraron hoteles' : 'No hay hoteles registrados'}</p>
              </div>
            )}
          </div>
        )}

        {/* Vista Lista */}
        {vistaLista && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Hotel', 'Ciudad', 'Categoría', 'WhatsApp', 'Estado', 'Acciones'].map(col => (
                    <th key={col} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hotelesFiltrados.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#001f3f] flex-shrink-0 relative">
                          {h.imagenesUrls?.[0]
                            ? <Image src={h.imagenesUrls[0]} alt={h.nombre} fill className="object-cover" sizes="40px" />
                            : <Building2 size={16} className="text-[#ffd600] absolute inset-0 m-auto" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#001f3f]">{h.nombre}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{h.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{h.ciudad}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: h.estrellas }).map((_, i) => <Star key={i} size={11} className="text-[#ffd600] fill-[#ffd600]" />)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">{h.telefonoWhatsapp}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {h.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => abrirEditar(h)} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"><Pencil size={13} /></button>
                        <button onClick={() => eliminar(h.id, h.nombre)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hotelesFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No se encontraron hoteles</div>
            )}
          </div>
        )}
      </div>

      {/* Drawer */}
      <FormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Editar Hotel' : 'Nuevo Hotel'}
        subtitle={editingId ? 'Modifica los datos del hotel' : 'Completa la información del hotel'}
        icon={<HotelIcon size={15} className="text-[#001f3f]" />}>
        <form onSubmit={guardar} className="space-y-5">
          <SubidorImagenes bucket="imagenes" carpeta="hoteles" imagenesActuales={form.imagenes_urls} onChange={urls => setForm(f => ({ ...f, imagenes_urls: urls }))} maxImagenes={5} />
          <Input label="Nombre del hotel" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Hotel Costa del Sol" icon={<HotelIcon size={15} />} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} placeholder="Ej: Lima" icon={<MapPin size={15} />} required />
            <Input label="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Av. Principal 123" required />
          </div>
          <Input label="Teléfono WhatsApp" value={form.telefono_whatsapp} onChange={e => setForm({ ...form, telefono_whatsapp: e.target.value })} placeholder="5215512345678" icon={<Phone size={15} />} hint="Incluye el código de país sin el +" required />
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descripción <span className="text-red-400">*</span></label>
            <textarea className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Describe el hotel..." required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categoría de estrellas</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm({ ...form, estrellas: n })}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${form.estrellas >= n ? 'border-[#ffd600] bg-[#ffd600]/10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                  <Star size={16} className={form.estrellas >= n ? 'fill-[#ffd600] text-[#ffd600]' : 'text-gray-300'} />
                  <span className={`text-xs font-bold ${form.estrellas >= n ? 'text-[#001f3f]' : 'text-gray-300'}`}>{n}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Toggle activo */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#001f3f]">Hotel activo</p>
              <p className="text-xs text-gray-400 mt-0.5">Los hoteles inactivos no aparecen en el catálogo público</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, activo: !f.activo }))}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${form.activo ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.activo ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={guardando} className="flex-1 flex items-center justify-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold py-3 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-60 text-sm">
              {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingId ? 'Guardar cambios' : 'Crear Hotel'}
            </button>
            <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 border border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm">
              Cancelar
            </button>
          </div>
        </form>
      </FormDrawer>
    </>
  );
}
