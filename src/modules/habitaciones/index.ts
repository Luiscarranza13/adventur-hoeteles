// Barrel export del módulo habitaciones
export { ServicioHabitaciones } from './aplicacion/ServicioHabitaciones';
export { AdaptadorSupabaseHabitacion } from './infraestructura/adaptadores/AdaptadorSupabaseHabitacion';
export type { Habitacion, DatosNuevaHabitacion, DatosActualizarHabitacion, TipoHabitacion, EstadoMantenimiento, TipoCama, RegimeAlimentacion, Moneda } from './dominio/entidades/Habitacion';
export { ETIQUETAS_TIPO_HABITACION, ETIQUETAS_TIPO_CAMA, ETIQUETAS_REGIMEN } from './dominio/entidades/Habitacion';
export type { RepositorioHabitacion } from './dominio/puertos/RepositorioHabitacion';
