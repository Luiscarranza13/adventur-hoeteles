export type TipoHabitacion = 'estandar' | 'doble' | 'suite' | 'presidencial';
export type EstadoMantenimiento = 'disponible' | 'mantenimiento' | 'bloqueado';
export type Moneda = 'USD' | 'PEN';

export interface Habitacion {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion?: string;
  numeroHabitacion?: string;
  tipoHabitacion: TipoHabitacion;
  capacidadPersonas: number;
  cantidadCamas: number;
  precioNoche: number;
  moneda: Moneda;
  amenidades: string[];
  imagenesUrls: string[];
  estaDisponible: boolean;
  estadoMantenimiento: EstadoMantenimiento;
  fechaCreacion: Date;
}

export interface DatosNuevaHabitacion {
  hotelId: string;
  nombre: string;
  descripcion?: string;
  numeroHabitacion?: string;
  tipoHabitacion?: TipoHabitacion;
  capacidadPersonas: number;
  cantidadCamas?: number;
  precioNoche: number;
  moneda?: Moneda;
  amenidades?: string[];
  imagenesUrls?: string[];
  estaDisponible?: boolean;
  estadoMantenimiento?: EstadoMantenimiento;
}

export interface DatosActualizarHabitacion {
  nombre?: string;
  descripcion?: string;
  numeroHabitacion?: string;
  tipoHabitacion?: TipoHabitacion;
  capacidadPersonas?: number;
  cantidadCamas?: number;
  precioNoche?: number;
  moneda?: Moneda;
  amenidades?: string[];
  imagenesUrls?: string[];
  estaDisponible?: boolean;
  estadoMantenimiento?: EstadoMantenimiento;
}
