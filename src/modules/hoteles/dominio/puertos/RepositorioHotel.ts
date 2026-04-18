import { Hotel, DatosNuevoHotel, DatosActualizarHotel } from '../entidades/Hotel';

export interface RepositorioHotel {
  buscarPorId(id: string): Promise<Hotel | null>;
  buscarPorCiudad(ciudad: string): Promise<Hotel[]>;
  listarActivos(): Promise<Hotel[]>;
  listarTodos(): Promise<Hotel[]>;
  crear(datos: DatosNuevoHotel): Promise<Hotel>;
  actualizar(id: string, datos: DatosActualizarHotel): Promise<Hotel>;
  eliminar(id: string): Promise<void>;
}
