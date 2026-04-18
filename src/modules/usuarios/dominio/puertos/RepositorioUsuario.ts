import type { Usuario, DatosNuevoUsuario, DatosActualizarUsuario } from '../entidades/Usuario';

export type { Usuario, DatosNuevoUsuario, DatosActualizarUsuario };

export interface RepositorioUsuario {
  buscarPorId(id: string): Promise<Usuario | null>;
  listar(): Promise<Usuario[]>;
  crear(datos: DatosNuevoUsuario): Promise<Usuario>;
  actualizar(id: string, datos: DatosActualizarUsuario): Promise<Usuario>;
  eliminar(id: string): Promise<void>;
}

export interface SesionUsuario {
  usuario: Usuario;
  token: string;
}

export interface CredencialesLogin {
  correo: string;
  contrasena: string;
}

export interface ServicioAutenticacion {
  iniciarSesion(credenciales: CredencialesLogin): Promise<SesionUsuario>;
  cerrarSesion(): Promise<void>;
  obtenerSesionActual(): Promise<Usuario | null>;
}
