import { Habitacion, DatosNuevaHabitacion, DatosActualizarHabitacion } from '../entidades/Habitacion';

export interface RepositorioHabitacion {
  buscarPorId(id: string): Promise<Habitacion | null>;
  buscarPorHotelId(hotelId: string): Promise<Habitacion[]>;
  listarTodas(): Promise<Habitacion[]>;
  listarDisponibles(): Promise<Habitacion[]>;
  crear(datos: DatosNuevaHabitacion): Promise<Habitacion>;
  actualizar(id: string, datos: DatosActualizarHabitacion): Promise<Habitacion>;
  eliminar(id: string): Promise<void>;
}
