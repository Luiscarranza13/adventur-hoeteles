'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import type { Hotel } from '@/modules/hoteles';

type FormData = {
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefono_whatsapp: string;
  estrellas: number;
};

const formVacio: FormData = { nombre: '', descripcion: '', ciudad: '', direccion: '', telefono_whatsapp: '', estrellas: 3 };

export default function HotelesPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(formVacio);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch('/api/admin/hoteles');
      setHoteles(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    await fetch('/api/admin/hoteles', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingId(null);
    setForm(formVacio);
    cargar();
  };

  const editar = (h: Hotel) => {
    setForm({ nombre: h.nombre, descripcion: h.descripcion, ciudad: h.ciudad, direccion: h.direccion, telefono_whatsapp: h.telefonoWhatsapp, estrellas: h.estrellas });
    setEditingId(h.id);
    setShowForm(true);
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este hotel?')) return;
    await fetch(`/api/admin/hoteles?id=${id}`, { method: 'DELETE' });
    cargar();
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#001f3f]">Gestionar Hoteles</h1>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(formVacio); }}>
          + Nuevo Hotel
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#001f3f] mb-4">{editingId ? 'Editar Hotel' : 'Nuevo Hotel'}</h2>
          <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            <Input label="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} required />
            <Input label="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} required />
            <Input label="Teléfono WhatsApp" value={form.telefono_whatsapp} onChange={e => setForm({ ...form, telefono_whatsapp: e.target.value })} placeholder="5215512345678" required />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ffd600]" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} required />
            </div>
            <Input label="Estrellas" type="number" min={1} max={5} value={form.estrellas} onChange={e => setForm({ ...form, estrellas: parseInt(e.target.value) })} />
            <div className="flex items-end gap-4">
              <Button type="submit" className="flex-1">{editingId ? 'Actualizar' : 'Crear'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hoteles.map(h => (
          <div key={h.id} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#001f3f]">{h.nombre}</h3>
            <p className="text-gray-600 text-sm mt-2">{h.descripcion}</p>
            <p className="text-sm text-gray-500 mt-2">{h.ciudad} — {h.direccion}</p>
            <p className="text-sm text-gray-500 mt-1">📱 <span className="font-mono">{h.telefonoWhatsapp}</span></p>
            <p className="text-sm text-[#ffd600] mt-2">{'★'.repeat(h.estrellas)}</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => editar(h)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => eliminar(h.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
        {hoteles.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">No hay hoteles</p>}
      </div>
    </div>
  );
}
