export type RolUsuario = 'admin' | 'recepcionista';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  rol: RolUsuario;
  fechaCreacion: Date;
}

export interface DatosNuevoUsuario {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  rol?: RolUsuario;
}

export interface DatosActualizarUsuario {
  nombreCompleto?: string;
  telefono?: string;
}
