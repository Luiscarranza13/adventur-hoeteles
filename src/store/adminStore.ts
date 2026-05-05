import { create } from 'zustand';

interface AdminStore {
  filtroReservas: 'todas' | 'contacto_whatsapp' | 'confirmada' | 'cancelada';
  busquedaHoteles: string;
  busquedaHabitaciones: string;
  setFiltroReservas: (f: AdminStore['filtroReservas']) => void;
  setBusquedaHoteles: (q: string) => void;
  setBusquedaHabitaciones: (q: string) => void;
}

export const useAdminStore = create<AdminStore>(set => ({
  filtroReservas: 'todas',
  busquedaHoteles: '',
  busquedaHabitaciones: '',
  setFiltroReservas: f => set({ filtroReservas: f }),
  setBusquedaHoteles: q => set({ busquedaHoteles: q }),
  setBusquedaHabitaciones: q => set({ busquedaHabitaciones: q }),
}));
