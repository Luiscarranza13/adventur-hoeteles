export interface Hotel {
  id: string;
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefonoWhatsapp: string;
  emailContacto?: string;
  imagenesUrls: string[];
  estrellas: number;
  latitud?: number;
  longitud?: number;
  horarioApertura?: string;
  horarioCierre?: string;
  activo: boolean;
  fechaCreacion: Date;
}

export interface DatosNuevoHotel {
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefonoWhatsapp: string;
  emailContacto?: string;
  imagenesUrls?: string[];
  estrellas?: number;
  latitud?: number;
  longitud?: number;
  horarioApertura?: string;
  horarioCierre?: string;
}

export interface DatosActualizarHotel {
  nombre?: string;
  descripcion?: string;
  ciudad?: string;
  direccion?: string;
  telefonoWhatsapp?: string;
  emailContacto?: string;
  imagenesUrls?: string[];
  estrellas?: number;
  latitud?: number;
  longitud?: number;
  horarioApertura?: string;
  horarioCierre?: string;
  activo?: boolean;
}
