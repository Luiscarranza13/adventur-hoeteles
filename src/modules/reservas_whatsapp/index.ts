// Barrel export del módulo reservas_whatsapp
export { ServicioReservasWhatsApp } from './aplicacion/ServicioReservasWhatsApp';
export { AdaptadorSupabaseReserva } from './infraestructura/adaptadores/AdaptadorSupabaseReserva';
export type { Reserva, DatosNuevaReserva, DatosActualizarReserva } from './dominio/entidades/Reserva';
export type { RepositorioReserva } from './dominio/puertos/RepositorioReserva';
export type { ResultadoSolicitudWhatsApp } from './aplicacion/ServicioReservasWhatsApp';
