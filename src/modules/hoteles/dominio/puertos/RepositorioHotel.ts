import { Hotel, DatosNuevoHotel, DatosActualizarHotel, TipoAlojamiento } from '../entidades/Hotel';

export interface RepositorioHotel {
  buscarPorId(id: string): Promise<Hotel | null>;
  buscarPorCiudad(ciudad: string): Promise<Hotel[]>;
  buscarPorTipo(tipo: TipoAlojamiento): Promise<Hotel[]>;
  listarActivos(): Promise<Hotel[]>;
  listarTodos(): Promise<Hotel[]>;
  crear(datos: DatosNuevoHotel): Promise<Hotel>;
  actualizar(id: string, datos: DatosActualizarHotel): Promise<Hotel>;
  eliminar(id: string): Promise<void>;
}
