export type EstadoReserva = 'contacto_whatsapp' | 'confirmada' | 'cancelada';

export interface Reserva {
  id: string;
  habitacionId: string;
  nombreCliente: string;
  telefonoContacto: string;
  fechaIngreso: Date;
  fechaSalida: Date;
  estado: EstadoReserva;
  fechaCreacion: Date;
}

export interface DatosNuevaReserva {
  habitacionId: string;
  nombreCliente: string;
  telefonoContacto: string;
  fechaIngreso: Date;
  fechaSalida: Date;
}

export interface DatosActualizarReserva {
  estado?: EstadoReserva;
}
