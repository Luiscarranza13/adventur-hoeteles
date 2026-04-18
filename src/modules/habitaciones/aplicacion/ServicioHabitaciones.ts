import { Habitacion, DatosNuevaHabitacion, DatosActualizarHabitacion } from '../dominio/entidades/Habitacion';
import { RepositorioHabitacion } from '../dominio/puertos/RepositorioHabitacion';

/**
 * Servicio de aplicación para el módulo de habitaciones.
 * Centraliza todos los casos de uso en un único objeto.
 */
export class ServicioHabitaciones {
  constructor(private readonly repositorio: RepositorioHabitacion) {}

  buscarPorId(id: string): Promise<Habitacion | null> {
    return this.repositorio.buscarPorId(id);
  }

  buscarPorHotel(hotelId: string): Promise<Habitacion[]> {
    return this.repositorio.buscarPorHotelId(hotelId);
  }

  listarTodas(): Promise<Habitacion[]> {
    return this.repositorio.listarTodas();
  }

  listarDisponibles(): Promise<Habitacion[]> {
    return this.repositorio.listarDisponibles();
  }

  crear(datos: DatosNuevaHabitacion): Promise<Habitacion> {
    return this.repositorio.crear(datos);
  }

  actualizar(id: string, datos: DatosActualizarHabitacion): Promise<Habitacion> {
    return this.repositorio.actualizar(id, datos);
  }

  eliminar(id: string): Promise<void> {
    return this.repositorio.eliminar(id);
  }
}
