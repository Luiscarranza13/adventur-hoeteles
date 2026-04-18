'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Habitacion {
  id: string; hotel_id: string; nombre: string; descripcion: string;
  capacidad_personas: number; precio_noche: number; esta_disponible: boolean;
}
interface Hotel { id: string; nombre: string; }

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ hotel_id: '', nombre: '', descripcion: '', capacidad_personas: 2, precio_noche: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [habRes, hotelRes] = await Promise.all([fetch('/api/admin/habitaciones'), fetch('/api/admin/hoteles')]);
      const habData = await habRes.json();
      const hotelData = await hotelRes.json();
      setHabitaciones(habData); setHoteles(hotelData);
      if (hotelData.length > 0) setFormData(p => ({ ...p, hotel_id: p.hotel_id || hotelData[0].id }));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...formData, id: editingId } : formData;
    await fetch('/api/admin/habitaciones', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setEditingId(null);
    setFormData({ hotel_id: hoteles[0]?.id || '', nombre: '', descripcion: '', capacidad_personas: 2, precio_noche: 0 });
    fetchData();
  };

  const handleEdit = (h: Habitacion) => {
    setFormData({ hotel_id: h.hotel_id, nombre: h.nombre, descripcion: h.descripcion, capacidad_personas: h.capacidad_personas, precio_noche: h.precio_noche });
    setEditingId(h.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta habitación?')) return;
    await fetch(`/api/admin/habitaciones?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getHotelName = (id: string) => hoteles.find(h => h.id === id)?.nombre || 'Desconocido';

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#001f3f]">Gestionar Habitaciones</h1>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ hotel_id: hoteles[0]?.id || '', nombre: '', descripcion: '', capacidad_personas: 2, precio_noche: 0 }); }}>
          + Nueva Habitación
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#001f3f] mb-4">{editingId ? 'Editar Habitación' : 'Nueva Habitación'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ffd600]" value={formData.hotel_id} onChange={e => setFormData({ ...formData, hotel_id: e.target.value })} required>
                {hoteles.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
              </select>
            </div>
            <Input label="Nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
            <Input label="Capacidad (personas)" type="number" min={1} value={formData.capacidad_personas} onChange={e => setFormData({ ...formData, capacidad_personas: parseInt(e.target.value) })} />
            <Input label="Precio por noche" type="number" min={0} step={0.01} value={formData.precio_noche} onChange={e => setFormData({ ...formData, precio_noche: parseFloat(e.target.value) })} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ffd600]" rows={3} value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
            </div>
            <div className="flex gap-4 md:col-span-2">
              <Button type="submit" className="flex-1">{editingId ? 'Actualizar' : 'Crear'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitaciones.map(h => (
          <div key={h.id} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#001f3f]">{h.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1">Hotel: {getHotelName(h.hotel_id)}</p>
            <p className="text-sm text-gray-600 mt-2">{h.descripcion}</p>
            <p className="text-lg font-bold text-[#ffd600] mt-2">${h.precio_noche}/noche</p>
            <p className="text-sm text-gray-500">Capacidad: {h.capacidad_personas} personas</p>
            <p className="text-sm text-gray-500">{h.esta_disponible ? '✅ Disponible' : '❌ No disponible'}</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => handleEdit(h)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(h.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
        {habitaciones.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">No hay habitaciones</p>}
      </div>
    </div>
  );
}
