export interface Habitacion {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion?: string;
  capacidadPersonas: number;
  precioNoche: number;
  imagenesUrls: string[];
  estaDisponible: boolean;
  fechaCreacion: Date;
}

export interface DatosNuevaHabitacion {
  hotelId: string;
  nombre: string;
  descripcion?: string;
  capacidadPersonas: number;
  precioNoche: number;
  imagenesUrls?: string[];
  estaDisponible?: boolean;
}

export interface DatosActualizarHabitacion {
  nombre?: string;
  descripcion?: string;
  capacidadPersonas?: number;
  precioNoche?: number;
  imagenesUrls?: string[];
  estaDisponible?: boolean;
}
