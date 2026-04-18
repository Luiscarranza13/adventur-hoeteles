import { Hotel, DatosNuevoHotel, DatosActualizarHotel } from '../dominio/entidades/Hotel';
import { RepositorioHotel } from '../dominio/puertos/RepositorioHotel';

/**
 * Servicio de aplicación para el módulo de hoteles.
 * Centraliza todos los casos de uso en un único objeto.
 */
export class ServicioHoteles {
  constructor(private readonly repositorio: RepositorioHotel) {}

  listarActivos(): Promise<Hotel[]> {
    return this.repositorio.listarActivos();
  }

  listarTodos(): Promise<Hotel[]> {
    return this.repositorio.listarTodos();
  }

  buscarPorId(id: string): Promise<Hotel | null> {
    return this.repositorio.buscarPorId(id);
  }

  buscarPorCiudad(ciudad: string): Promise<Hotel[]> {
    return this.repositorio.buscarPorCiudad(ciudad);
  }

  crear(datos: DatosNuevoHotel): Promise<Hotel> {
    return this.repositorio.crear(datos);
  }

  actualizar(id: string, datos: DatosActualizarHotel): Promise<Hotel> {
    return this.repositorio.actualizar(id, datos);
  }

  eliminar(id: string): Promise<void> {
    return this.repositorio.eliminar(id);
  }
}
