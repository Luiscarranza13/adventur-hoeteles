'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';

interface Reserva {
  id: string; nombre_cliente: string; telefono_contacto: string;
  fecha_ingreso: string; fecha_salida: string; estado: string;
  fecha_creacion: string; habitacion_id: string;
}
interface Habitacion { id: string; hotel_id: string; nombre: string; }
interface Hotel { id: string; nombre: string; }

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r, h, ho] = await Promise.all([fetch('/api/admin/reservas'), fetch('/api/admin/habitaciones'), fetch('/api/admin/hoteles')]);
      setReservas(await r.json()); setHabitaciones(await h.json()); setHoteles(await ho.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getInfo = (habitacionId: string) => {
    const hab = habitaciones.find(h => h.id === habitacionId);
    if (!hab) return { habitacionNombre: 'Desconocida', hotelNombre: 'Desconocido' };
    return { habitacionNombre: hab.nombre, hotelNombre: hoteles.find(h => h.id === hab.hotel_id)?.nombre || 'Desconocido' };
  };

  const cambiarEstado = async (id: string, estado: string) => {
    await fetch(`/api/admin/reservas?id=${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
    fetchData();
  };

  const badge = (estado: string) => {
    const s: Record<string, string> = { contacto_whatsapp: 'bg-yellow-100 text-yellow-800', confirmada: 'bg-green-100 text-green-800', cancelada: 'bg-red-100 text-red-800' };
    const l: Record<string, string> = { contacto_whatsapp: 'Contacto WhatsApp', confirmada: 'Confirmada', cancelada: 'Cancelada' };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${s[estado] || 'bg-gray-100 text-gray-800'}`}>{l[estado] || estado}</span>;
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#001f3f] mb-2">Leads / Reservas WhatsApp</h1>
      <p className="text-gray-500 mb-8">Solicitudes recibidas. Confirma o cancela según la conversación en WhatsApp.</p>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Cliente', 'Hotel', 'Habitación', 'Fechas', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-[#001f3f]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservas.map(r => {
              const info = getInfo(r.habitacion_id);
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#001f3f]">{r.nombre_cliente}</p>
                    <p className="text-sm text-gray-500">{r.telefono_contacto}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{info.hotelNombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{info.habitacionNombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(r.fecha_ingreso).toLocaleDateString('es-ES')} → {new Date(r.fecha_salida).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">{badge(r.estado)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {r.estado !== 'confirmada' && <Button size="sm" onClick={() => cambiarEstado(r.id, 'confirmada')}>Confirmar</Button>}
                      {r.estado !== 'cancelada' && <Button size="sm" variant="danger" onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {reservas.length === 0 && <div className="p-8 text-center text-gray-500">No hay reservas aún</div>}
      </div>
    </div>
  );
}
