export type EstadoReserva = 'contacto_whatsapp' | 'confirmada' | 'cancelada';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'pendiente';

export interface Reserva {
  id: string;
  habitacionId: string;
  nombreCliente: string;
  telefonoContacto: string;
  fechaIngreso: Date;
  fechaSalida: Date;
  notasCliente?: string;
  cantidadHuespedes?: number;
  precioTotal?: number;
  estado: EstadoReserva;
  fechaConfirmacion?: Date;
  metodoPago?: MetodoPago;
  fechaCreacion: Date;
}

export interface DatosNuevaReserva {
  habitacionId: string;
  nombreCliente: string;
  telefonoContacto: string;
  fechaIngreso: Date;
  fechaSalida: Date;
  notasCliente?: string;
  cantidadHuespedes?: number;
  precioTotal?: number;
  metodoPago?: MetodoPago;
}

export interface DatosActualizarReserva {
  estado?: EstadoReserva;
  notasCliente?: string;
  cantidadHuespedes?: number;
  precioTotal?: number;
  fechaConfirmacion?: Date;
  metodoPago?: MetodoPago;
}
