import { createClient } from '@/lib/supabase/server';
import { createBrowserClient } from '@supabase/ssr';
import { RepositorioUsuario, ServicioAutenticacion, SesionUsuario, CredencialesLogin } from '../../dominio/puertos/RepositorioUsuario';
import { Usuario, DatosNuevoUsuario, DatosActualizarUsuario } from '../../dominio/entidades/Usuario';
import type { SupabaseClient } from '@supabase/supabase-js';

interface UsuarioDb {
  id: string;
  nombre_completo: string;
  correo: string;
  telefono: string | null;
  rol: string;
  fecha_creacion: string;
}

function mapDbToDomain(row: UsuarioDb): Usuario {
  return {
    id: row.id,
    nombreCompleto: row.nombre_completo,
    correo: row.correo,
    telefono: row.telefono || undefined,
    rol: row.rol as Usuario['rol'],
    fechaCreacion: new Date(row.fecha_creacion),
  };
}

export class AdaptadorSupabaseUsuario implements RepositorioUsuario {
  private async getCliente(): Promise<SupabaseClient> {
    return createClient();
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbToDomain(data as UsuarioDb);
  }

  async listar(): Promise<Usuario[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('usuarios')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as UsuarioDb[]).map(mapDbToDomain);
  }

  async crear(datos: DatosNuevoUsuario): Promise<Usuario> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('usuarios')
      .insert({
        nombre_completo: datos.nombreCompleto,
        correo: datos.correo,
        telefono: datos.telefono || null,
        rol: datos.rol || 'recepcionista',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as UsuarioDb);
  }

  async actualizar(id: string, datos: DatosActualizarUsuario): Promise<Usuario> {
    const cliente = await this.getCliente();
    const updateData: Record<string, unknown> = {};
    if (datos.nombreCompleto !== undefined) updateData.nombre_completo = datos.nombreCompleto;
    if (datos.telefono !== undefined) updateData.telefono = datos.telefono;

    const { data, error } = await cliente
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as UsuarioDb);
  }

  async eliminar(id: string): Promise<void> {
    const cliente = await this.getCliente();
    const { error } = await cliente.from('usuarios').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export class ServicioSupabaseAutenticacion implements ServicioAutenticacion {
  private repositorioUsuario: AdaptadorSupabaseUsuario;

  constructor() {
    this.repositorioUsuario = new AdaptadorSupabaseUsuario();
  }

  async iniciarSesion(credenciales: CredencialesLogin): Promise<SesionUsuario> {
    const browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await browserClient.auth.signInWithPassword({
      email: credenciales.correo,
      password: credenciales.contrasena,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Credenciales inválidas');
    }

    const usuario = await this.repositorioUsuario.buscarPorId(data.user.id);
    if (!usuario) throw new Error('Usuario no encontrado');

    return { usuario, token: data.session?.access_token || '' };
  }

  async cerrarSesion(): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async obtenerSesionActual(): Promise<Usuario | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return this.repositorioUsuario.buscarPorId(user.id);
  }
}
