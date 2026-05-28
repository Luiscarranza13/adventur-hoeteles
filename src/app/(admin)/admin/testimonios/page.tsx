'use client';

import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { FormDrawer } from '@/components/admin/FormDrawer';
import Swal from 'sweetalert2';
import {
  Plus, Pencil, Trash2, Star, Save, Loader2,
  MessageSquare, CheckCircle2, XCircle, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { COLORES_TESTIMONIO } from '@/lib/admin-validaciones';

interface Testimonio {
  id: string;
  nombre: string;
  origen: string;
  cargo: string;
  calificacion: number;
  texto: string;
  color: string;
  orden: number;
  activo: boolean;
  creado_en: string;
}

type FormData = {
  nombre: string;
  origen: string;
  cargo: string;
  calificacion: number;
  texto: string;
  color: string;
  orden: number;
  activo: boolean;
};

const FORM_VACIO: FormData = {
  nombre: '',
  origen: '',
  cargo: '',
  calificacion: 5,
  texto: '',
  color: '#2563EB',
  orden: 0,
  activo: true,
};

function Avatar({ nombre, color }: { nombre: string; color: string }) {
  const inicial = nombre.trim().charAt(0).toUpperCase() || '?';
  return (
    <div
      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-black text-sm ring-2 ring-white shadow"
      style={{ background: color }}
    >
      {inicial}
    </div>
  );
}

function Estrellas({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < n ? 'fill-current' : 'text-gray-200 fill-current'} />
      ))}
    </span>
  );
}

export default function TestimoniosPage() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(FORM_VACIO);
  const [errores, setErrores] = useState<Partial<Record<keyof FormData, string>>>({});
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonios');
      if (!res.ok) throw new Error();
      setTestimonios(await res.json());
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const validar = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.origen.trim()) e.origen = 'Requerido';
    if (!form.cargo.trim()) e.cargo = 'Requerido';
    if (!form.texto.trim()) e.texto = 'Requerido';
    else if (form.texto.trim().length > 600) e.texto = 'Máximo 600 caracteres';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const abrirCrear = () => {
    setEditingId(null);
    setForm({ ...FORM_VACIO, orden: testimonios.length + 1 });
    setErrores({});
    setDrawerOpen(true);
  };

  const abrirEditar = (t: Testimonio) => {
    setEditingId(t.id);
    setForm({
      nombre: t.nombre,
      origen: t.origen,
      cargo: t.cargo,
      calificacion: t.calificacion,
      texto: t.texto,
      color: t.color,
      orden: t.orden,
      activo: t.activo,
    });
    setErrores({});
    setDrawerOpen(true);
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      const url = '/api/admin/testimonios';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...form, id: editingId } : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Error al guardar');
      }

      setDrawerOpen(false);
      await cargar();
      Swal.fire({ icon: 'success', title: editingId ? 'Testimonio actualizado' : 'Testimonio creado', timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: e instanceof Error ? e.message : 'Error al guardar', confirmButtonColor: '#001f3f' });
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar testimonio?',
      text: `Se eliminará el testimonio de "${nombre}". Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/testimonios?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await cargar();
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar', confirmButtonColor: '#001f3f' });
    }
  };

  const toggleActivo = async (t: Testimonio) => {
    try {
      const res = await fetch('/api/admin/testimonios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, activo: !t.activo }),
      });
      if (!res.ok) throw new Error();
      await cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado', confirmButtonColor: '#001f3f' });
    }
  };

  const set = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrores(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#001f3f] flex items-center gap-2">
            <MessageSquare size={20} />
            Testimonios
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {testimonios.length} testimonio{testimonios.length !== 1 ? 's' : ''} · {testimonios.filter(t => t.activo).length} activos
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#ffd600] hover:bg-[#ffdf33] text-[#001f3f] font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Plus size={16} />
          Nuevo testimonio
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={28} className="animate-spin mr-3" />
          Cargando…
        </div>
      ) : testimonios.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <MessageSquare size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 font-medium">No hay testimonios aún</p>
          <button onClick={abrirCrear} className="mt-4 text-sm font-bold text-[#001f3f] hover:underline">
            + Agregar el primero
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Autor</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Testimonio</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Cal.</th>
                <th className="px-4 py-3 text-center">Orden</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {testimonios.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar nombre={t.nombre} color={t.color} />
                      <div className="min-w-0">
                        <p className="font-bold text-[#001f3f] truncate">{t.nombre}</p>
                        <p className="text-xs text-gray-400 truncate">{t.cargo} · {t.origen}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-xs">
                    <p className="text-gray-600 text-xs line-clamp-2">{t.texto}</p>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <Estrellas n={t.calificacion} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {t.orden}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActivo(t)}
                      title={t.activo ? 'Desactivar' : 'Activar'}
                      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                    >
                      {t.activo ? (
                        <>
                          <ToggleRight size={20} className="text-emerald-500" />
                          <span className="text-emerald-600 hidden sm:inline">Activo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={20} className="text-gray-400" />
                          <span className="text-gray-400 hidden sm:inline">Inactivo</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => abrirEditar(t)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => eliminar(t.id, t.nombre)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer formulario */}
      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Editar testimonio' : 'Nuevo testimonio'}
        footer={
          <button
            onClick={guardar}
            disabled={guardando}
            className="w-full flex items-center justify-center gap-2 bg-[#001f3f] hover:bg-[#002d5a] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {editingId ? 'Guardar cambios' : 'Crear testimonio'}
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nombre *</label>
              <Input
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                placeholder="Ej: María García"
                error={errores.nombre}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Ciudad / Origen *</label>
              <Input
                value={form.origen}
                onChange={e => set('origen', e.target.value)}
                placeholder="Ej: Lima"
                error={errores.origen}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Cargo / Tipo de viaje *</label>
            <Input
              value={form.cargo}
              onChange={e => set('cargo', e.target.value)}
              placeholder="Ej: Viajera frecuente, Grupo familiar, Reserva corporativa"
              error={errores.cargo}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Testimonio *</label>
            <textarea
              value={form.texto}
              onChange={e => set('texto', e.target.value)}
              rows={4}
              maxLength={600}
              placeholder="Escribe el testimonio del cliente…"
              className={`w-full px-3 py-2 text-sm border rounded-xl resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffd600] ${
                errores.texto ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errores.texto ? <p className="text-xs text-red-500">{errores.texto}</p> : <span />}
              <p className="text-xs text-gray-400">{form.texto.length}/600</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Calificación</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('calificacion', n)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={n <= form.calificacion ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Orden</label>
              <Input
                type="number"
                min={0}
                max={9999}
                value={form.orden}
                onChange={e => set('orden', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Color del avatar</label>
            <div className="flex flex-wrap gap-2">
              {COLORES_TESTIMONIO.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  className={`w-9 h-9 rounded-full transition-all ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ background: c }}
                  title={c}
                >
                  {form.color === c && (
                    <CheckCircle2 size={14} className="mx-auto text-white" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Avatar nombre={form.nombre || 'A'} color={form.color} />
              <p className="text-xs text-gray-500">Vista previa del avatar</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-bold text-gray-700">Visible en la web</p>
              <p className="text-xs text-gray-400">Solo los testimonios activos se muestran en la home</p>
            </div>
            <button
              type="button"
              onClick={() => set('activo', !form.activo)}
              className="flex items-center gap-1.5 transition-colors"
            >
              {form.activo ? (
                <><ToggleRight size={32} className="text-emerald-500" /><span className="text-xs font-bold text-emerald-600">Activo</span></>
              ) : (
                <><ToggleLeft size={32} className="text-gray-400" /><span className="text-xs font-bold text-gray-400">Inactivo</span></>
              )}
            </button>
          </div>
        </div>
      </FormDrawer>
    </div>
  );
}
