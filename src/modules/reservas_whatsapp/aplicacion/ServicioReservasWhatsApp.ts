import { Reserva, DatosNuevaReserva, DatosActualizarReserva } from '../dominio/entidades/Reserva';
import { RepositorioReserva } from '../dominio/puertos/RepositorioReserva';
import { RepositorioHabitacion } from '../../habitaciones/dominio/puertos/RepositorioHabitacion';
import { RepositorioHotel } from '../../hoteles/dominio/puertos/RepositorioHotel';

export interface ResultadoSolicitudWhatsApp {
  reserva: Reserva;
  urlWhatsApp: string;
}

/**
 * Servicio de aplicación para el módulo de reservas WhatsApp.
 * Encapsula el flujo completo: guardar intención → generar URL de WhatsApp.
 */
export class ServicioReservasWhatsApp {
  constructor(
    private readonly repositorioReserva: RepositorioReserva,
    private readonly repositorioHabitacion: RepositorioHabitacion,
    private readonly repositorioHotel: RepositorioHotel
  ) {}

  listar(): Promise<Reserva[]> {
    return this.repositorioReserva.listar();
  }

  cambiarEstado(id: string, datos: DatosActualizarReserva): Promise<Reserva> {
    return this.repositorioReserva.actualizarEstado(id, datos);
  }

  async procesarSolicitud(datos: DatosNuevaReserva): Promise<ResultadoSolicitudWhatsApp> {
    // 1. Guardar intención en BD con estado 'contacto_whatsapp'
    const reserva = await this.repositorioReserva.crear(datos);

    // 2. Obtener habitación y hotel para construir el mensaje
    const habitacion = await this.repositorioHabitacion.buscarPorId(datos.habitacionId);
    if (!habitacion) throw new Error('Habitación no encontrada');

    const hotel = await this.repositorioHotel.buscarPorId(habitacion.hotelId);
    if (!hotel) throw new Error('Hotel no encontrado');

    // 3. Construir URL de WhatsApp con mensaje pre-formateado
    const mensaje = this.construirMensaje(reserva, hotel.nombre, habitacion.nombre);
    const urlWhatsApp = `https://wa.me/${this.limpiarTelefono(hotel.telefonoWhatsapp)}?text=${encodeURIComponent(mensaje)}`;

    return { reserva, urlWhatsApp };
  }

  private construirMensaje(reserva: Reserva, nombreHotel: string, nombreHabitacion: string): string {
    const ingreso = new Date(reserva.fechaIngreso).toLocaleDateString('es-ES');
    const salida = new Date(reserva.fechaSalida).toLocaleDateString('es-ES');
    return [
      `Hola, soy ${reserva.nombreCliente}.`,
      `Teléfono: ${reserva.telefonoContacto}`,
      `Hotel: ${nombreHotel}`,
      `Habitación: ${nombreHabitacion}`,
      `Fecha de ingreso: ${ingreso}`,
      `Fecha de salida: ${salida}`,
      `ID de seguimiento: ${reserva.id}`,
    ].join('\n');
  }

  private limpiarTelefono(telefono: string): string {
    return telefono.replace(/\D/g, '');
  }
}
