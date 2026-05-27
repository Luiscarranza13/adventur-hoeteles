'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getSortedRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAdminStore } from '@/store/adminStore';
import type { Reserva, EstadoReserva } from '@/modules/reservas_whatsapp';
import type { Habitacion } from '@/modules/habitaciones';
import type { Hotel } from '@/modules/hoteles';
import Swal from 'sweetalert2';
import {
  MessageCircle, CheckCircle2, XCircle, Clock, RefreshCw,
  User, Phone, Calendar, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Download
} from 'lucide-react';

type FilaReserva = Reserva & { habitacionNombre: string; hotelNombre: string; moneda: 'PEN' | 'USD' };

export default function PaginaReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { filtroReservas, setFiltroReservas } = useAdminStore();

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const [reservasRes, datosRes] = await Promise.all([
        fetch('/api/admin/reservas'),
        fetch('/api/admin/datos'),
      ]);
      const [reservasData, { hoteles: hotelsData, habitaciones: habsData }] = await Promise.all([
        reservasRes.ok ? reservasRes.json() : Promise.resolve([]),
        datosRes.ok ? datosRes.json() : Promise.resolve({ hoteles: [], habitaciones: [] }),
      ]);
      setReservas(reservasData ?? []);
      setHabitaciones(habsData ?? []);
      setHoteles(hotelsData ?? []);
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  };

  const filas: FilaReserva[] = useMemo(() => {
    return reservas.map(r => {
      const hab = habitaciones.find(h => h.id === r.habitacionId);
      return {
        ...r,
        habitacionNombre: hab?.nombre ?? 'Desconocida',
        hotelNombre: hoteles.find(h => h.id === hab?.hotelId)?.nombre ?? 'Desconocido',
        moneda: (hab?.moneda ?? 'USD') as 'PEN' | 'USD',
      };
    });
  }, [reservas, habitaciones, hoteles]);

  const filasFiltradas = useMemo(() =>
    filtroReservas === 'todas' ? filas : filas.filter(r => r.estado === filtroReservas),
    [filas, filtroReservas]
  );

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
      await fetch(`/api/admin/reservas?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, fecha_confirmacion: estado === 'confirmada' ? new Date().toISOString() : undefined }),
      });
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

  const columnas: ColumnDef<FilaReserva>[] = useMemo(() => [
    {
      id: 'cliente',
      header: 'Cliente',
      accessorFn: r => r.nombreCliente,
      cell: ({ row: { original: r } }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#001f3f] rounded-full flex items-center justify-center text-[#ffd600] text-xs font-bold flex-shrink-0">
            {r.nombreCliente[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#001f3f] text-sm flex items-center gap-1"><User size={11} />{r.nombreCliente}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{r.telefonoContacto}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'alojamiento',
      header: 'Hotel / Habitación',
      accessorFn: r => r.hotelNombre,
      cell: ({ row: { original: r } }) => (
        <div>
          <p className="text-sm font-medium text-[#001f3f]">{r.hotelNombre}</p>
          <p className="text-xs text-gray-400">{r.habitacionNombre}</p>
        </div>
      ),
    },
    {
      id: 'fechas',
      header: 'Fechas',
      accessorFn: r => r.fechaIngreso,
      cell: ({ row: { original: r } }) => (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Calendar size={11} className="text-gray-400" />
          {format(new Date(r.fechaIngreso), 'dd MMM', { locale: es })} →{' '}
          {format(new Date(r.fechaSalida), 'dd MMM yyyy', { locale: es })}
        </div>
      ),
    },
    {
      id: 'precio',
      header: 'Precio',
      accessorFn: r => r.precioTotal,
      cell: ({ getValue, row }) => (
        <span className="text-sm font-bold text-[#ffd600]">
          {getValue() ? `${row.original.moneda === 'PEN' ? 'S/' : '$'}${(getValue() as number).toFixed(2)}` : '—'}
        </span>
      ),
    },
    {
      id: 'metodoPago',
      header: 'Método',
      accessorFn: r => r.metodoPago,
      cell: ({ getValue }) => (
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">
          {(getValue() as string) || 'Pendiente'}
        </span>
      ),
    },
    {
      id: 'estado',
      header: 'Estado',
      accessorFn: r => r.estado,
      cell: ({ getValue }) => badgeEstado(getValue() as EstadoReserva),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <div className="flex gap-2">
          {r.estado !== 'confirmada' && (
            <button
              onClick={() => cambiarEstado(r.id, 'confirmada', r.nombreCliente)}
              className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              <CheckCircle2 size={12} /> Confirmar
            </button>
          )}
          {r.estado !== 'cancelada' && (
            <button
              onClick={() => cambiarEstado(r.id, 'cancelada', r.nombreCliente)}
              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              <XCircle size={12} /> Cancelar
            </button>
          )}
        </div>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [habitaciones, hoteles]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const tabla = useReactTable({
    data: filasFiltradas,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

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
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/reservas?format=csv"
            className="flex items-center gap-2 border border-gray-200 text-gray-600 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            <Download size={14} /> CSV
          </a>
          <button onClick={cargar} className="flex items-center gap-2 border border-gray-200 text-gray-600 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all text-sm">
            <RefreshCw size={14} /> Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {([
          { val: 'todas',             label: `Todas (${reservas.length})` },
          { val: 'contacto_whatsapp', label: `Pendientes (${reservas.filter(r => r.estado === 'contacto_whatsapp').length})` },
          { val: 'confirmada',        label: `Confirmadas (${reservas.filter(r => r.estado === 'confirmada').length})` },
          { val: 'cancelada',         label: `Canceladas (${reservas.filter(r => r.estado === 'cancelada').length})` },
        ] as const).map(({ val, label }) => (
          <button key={val} onClick={() => setFiltroReservas(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filtroReservas === val ? 'bg-[#001f3f] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tabla con TanStack */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {tabla.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="bg-gray-50 border-b border-gray-100">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider select-none"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          header.column.getIsSorted() === 'asc' ? <ChevronUp size={12} className="text-[#001f3f]" /> :
                          header.column.getIsSorted() === 'desc' ? <ChevronDown size={12} className="text-[#001f3f]" /> :
                          <ChevronsUpDown size={12} className="text-gray-300" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tabla.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No hay reservas {filtroReservas !== 'todas' ? `con estado "${filtroReservas}"` : 'aún'}</p>
          </div>
        )}

        {/* Paginación */}
        {filasFiltradas.length > 10 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Página {tabla.getState().pagination.pageIndex + 1} de {tabla.getPageCount()} · {filasFiltradas.length} registros
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => tabla.previousPage()}
                disabled={!tabla.getCanPreviousPage()}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => tabla.nextPage()}
                disabled={!tabla.getCanNextPage()}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
