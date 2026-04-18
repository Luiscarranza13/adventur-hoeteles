import { Usuario } from '../dominio/entidades/Usuario';
import { RepositorioUsuario, ServicioAutenticacion, CredencialesLogin, SesionUsuario } from '../dominio/puertos/RepositorioUsuario';

/**
 * Servicio de aplicación para el módulo de usuarios.
 * Centraliza gestión de usuarios y autenticación.
 */
export class ServicioUsuarios {
  constructor(
    private readonly repositorio: RepositorioUsuario,
    private readonly autenticacion: ServicioAutenticacion
  ) {}

  listar(): Promise<Usuario[]> {
    return this.repositorio.listar();
  }

  buscarPorId(id: string): Promise<Usuario | null> {
    return this.repositorio.buscarPorId(id);
  }

  iniciarSesion(credenciales: CredencialesLogin): Promise<SesionUsuario> {
    return this.autenticacion.iniciarSesion(credenciales);
  }

  cerrarSesion(): Promise<void> {
    return this.autenticacion.cerrarSesion();
  }

  obtenerSesionActual(): Promise<Usuario | null> {
    return this.autenticacion.obtenerSesionActual();
  }
}
