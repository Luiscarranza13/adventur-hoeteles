import { Reserva, DatosNuevaReserva, DatosActualizarReserva } from '../entidades/Reserva';

export interface RepositorioReserva {
  buscarPorId(id: string): Promise<Reserva | null>;
  listar(): Promise<Reserva[]>;
  crear(datos: DatosNuevaReserva): Promise<Reserva>;
  actualizarEstado(id: string, datos: DatosActualizarReserva): Promise<Reserva>;
}
