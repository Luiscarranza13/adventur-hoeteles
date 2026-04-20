export type RolUsuario = 'admin' | 'cliente';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  rol: RolUsuario;
  fotoUrl?: string;
  fechaCreacion: Date;
}

export interface DatosNuevoUsuario {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  rol?: RolUsuario;
  fotoUrl?: string;
}

export interface DatosActualizarUsuario {
  nombreCompleto?: string;
  telefono?: string;
  rol?: RolUsuario;
  fotoUrl?: string;
}
