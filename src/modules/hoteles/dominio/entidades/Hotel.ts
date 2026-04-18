export interface Hotel {
  id: string;
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefonoWhatsapp: string;
  imagenesUrls: string[];
  estrellas: number;
  activo: boolean;
  fechaCreacion: Date;
}

export interface DatosNuevoHotel {
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefonoWhatsapp: string;
  imagenesUrls?: string[];
  estrellas?: number;
}

export interface DatosActualizarHotel {
  nombre?: string;
  descripcion?: string;
  ciudad?: string;
  direccion?: string;
  telefonoWhatsapp?: string;
  imagenesUrls?: string[];
  estrellas?: number;
  activo?: boolean;
}
