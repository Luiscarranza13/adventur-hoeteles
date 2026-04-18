// Barrel export del módulo hoteles
export { ServicioHoteles } from './aplicacion/ServicioHoteles';
export { AdaptadorSupabaseHotel } from './infraestructura/adaptadores/AdaptadorSupabaseHotel';
export type { Hotel, DatosNuevoHotel, DatosActualizarHotel } from './dominio/entidades/Hotel';
export type { RepositorioHotel } from './dominio/puertos/RepositorioHotel';
