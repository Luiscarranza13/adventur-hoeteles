// Barrel export del módulo usuarios
export { ServicioUsuarios } from './aplicacion/ServicioUsuarios';
export { AdaptadorSupabaseUsuario, ServicioSupabaseAutenticacion } from './infraestructura/adaptadores/AdaptadorSupabaseUsuario';
export type { Usuario, DatosNuevoUsuario, DatosActualizarUsuario } from './dominio/entidades/Usuario';
export type { RepositorioUsuario, SesionUsuario, CredencialesLogin } from './dominio/puertos/RepositorioUsuario';
