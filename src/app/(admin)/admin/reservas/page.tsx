'use client';

import { useState, useEffect } from 'react';
import type { Reserva, EstadoReserva } from '@/modules/reservas_whatsapp';
import type { Habitacion } from '@/modules/habitaciones';
import type { Hotel } from '@/modules/hoteles';
import Swal from 'sweetalert2';
import { MessageCircle, CheckCircle2, XCircle, Clock, RefreshCw, User, Phone, Calendar } from 'lucide-react';

export default function PaginaReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<EstadoReserva | 'todas'>('todas');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const [r, h, ho] = await Promise.all([fetch('/api/admin/reservas'), fetch('/api/admin/habitaciones'), fetch('/api/admin/hoteles')]);
      setReservas(await r.json()); setHabitaciones(await h.json()); setHoteles(await ho.json());
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  };

  const infoHabitacion = (habitacionId: string) => {
    const hab = habitaciones.find(h => h.id === habitacionId);
    if (!hab) return { habitacionNombre: 'Desconocida', hotelNombre: 'Desconocido' };
    return { habitacionNombre: hab.nombre, hotelNombre: hoteles.find(h => h.id === hab.hotelId)?.nombre ?? 'Desconocido' };
  };

  const cambiarEstado = async (id: string, estado: EstadoReserva, nombreCliente: string) => {
    const accion = estado === 'confirmada' ? 'confirmar' : 'cancelar';
    const result = await Swal.fire({
      icon: estado === 'confirmada' ? 'question' : 'warning',
      title: `¿${estado === 'confirmada' ? 'Confirmar' : 'Cancelar'} reserva?`,
      html: `Se ${accion}á la reserva de <strong>${nombreCliente}</strong>.`,
      showCancelButton: true,
      confirmButtonColor: estado === 'confirmada' ? '#16a34a' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'No',
    });
    if (!result.isConfirmed) return;
    try {
      await fetch(`/api/admin/reservas?id=${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
      Swal.fire({ icon: 'success', title: `Reserva ${estado === 'confirmada' ? 'confirmada' : 'cancelada'}`, timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la reserva.', confirmButtonColor: '#001f3f' });
    }
  };

  const badgeEstado = (estado: EstadoReserva) => {
    const config = {
      contacto_whatsapp: { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', Icon: Clock, label: 'Pendiente' },
      confirmada:        { cls: 'bg-green-100 text-green-800 border-green-200',   Icon: CheckCircle2, label: 'Confirmada' },
      cancelada:         { cls: 'bg-red-100 text-red-800 border-red-200',         Icon: XCircle, label: 'Cancelada' },
    };
    const { cls, Icon, label } = config[estado];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cls}`}>
        <Icon size={11} /> {label}
      </span>
    );
  };

  const reservasFiltradas = filtro === 'todas' ? reservas : reservas.filter(r => r.estado === filtro);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#001f3f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando reservas...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001f3f] flex items-center gap-2">
            <MessageCircle size={22} /> Leads WhatsApp
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Solicitudes recibidas — el cliente ya habló con el hotel por WhatsApp</p>
        </div>
        <button onClick={cargar} className="flex items-center gap-2 border border-gray-200 text-gray-600 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all text-sm">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {([
          { val: 'todas',             label: `Todas (${reservas.length})` },
          { val: 'contacto_whatsapp', label: `Pendientes (${reservas.filter(r => r.estado === 'contacto_whatsapp').length})` },
          { val: 'confirmada',        label: `Confirmadas (${reservas.filter(r => r.estado === 'confirmada').length})` },
          { val: 'cancelada',         label: `Canceladas (${reservas.filter(r => r.estado === 'cancelada').length})` },
        ] as const).map(({ val, label }) => (
          <button key={val} onClick={() => setFiltro(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filtro === val ? 'bg-[#001f3f] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Cliente', 'Hotel / Habitación', 'Fechas', 'Estado', 'Acciones'].map(col => (
                  <th key={col} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservasFiltradas.map(r => {
                const info = infoHabitacion(r.habitacionId);
                return (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#001f3f] rounded-full flex items-center justify-center text-[#ffd600] text-xs font-bold flex-shrink-0">
                          {r.nombreCliente[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#001f3f] text-sm flex items-center gap-1"><User size={11} />{r.nombreCliente}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{r.telefonoContacto}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#001f3f]">{info.hotelNombre}</p>
                      <p className="text-xs text-gray-400">{info.habitacionNombre}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar size={11} className="text-gray-400" />
                        {new Date(r.fechaIngreso).toLocaleDateString('es-ES')} → {new Date(r.fechaSalida).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-5 py-4">{badgeEstado(r.estado)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {r.estado !== 'confirmada' && (
                          <button onClick={() => cambiarEstado(r.id, 'confirmada', r.nombreCliente)}
                            className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                            <CheckCircle2 size={12} /> Confirmar
                          </button>
                        )}
                        {r.estado !== 'cancelada' && (
                          <button onClick={() => cambiarEstado(r.id, 'cancelada', r.nombreCliente)}
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                            <XCircle size={12} /> Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {reservasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No hay reservas {filtro !== 'todas' ? `con estado "${filtro}"` : 'aún'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
