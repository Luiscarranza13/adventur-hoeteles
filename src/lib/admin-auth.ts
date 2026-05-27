import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiError } from '@/lib/api-response';

export const ROLES_ADMIN = ['admin', 'colaborador', 'viewer'] as const;
export type RolAdmin = typeof ROLES_ADMIN[number];

export const PERMISOS_ADMIN = {
  verPanel: ['admin', 'colaborador', 'viewer'],
  gestionarContenido: ['admin', 'colaborador'],
  gestionarReservas: ['admin', 'colaborador'],
  gestionarUsuarios: ['admin'],
  gestionarConfiguracion: ['admin'],
} as const satisfies Record<string, readonly RolAdmin[]>;

type PermisoAdmin = keyof typeof PERMISOS_ADMIN;

const ROLES_ADMIN_SET = new Set<string>(ROLES_ADMIN);

// Cache de sesión en memoria para evitar 2 queries por request
// Se invalida automáticamente porque cada request crea un nuevo módulo en dev,
// pero en producción el módulo persiste entre requests del mismo worker.
const sessionCache = new Map<string, { rol: string; ts: number }>();
const CACHE_TTL = 30_000; // 30 segundos

function respuestaNoAutenticado() {
  return apiError('No autenticado', 401, 'UNAUTHENTICATED');
}

function respuestaNoAutorizado() {
  return apiError('No autorizado', 403, 'FORBIDDEN');
}

export async function obtenerAdminActual() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      autorizado: false as const,
      respuesta: respuestaNoAutenticado(),
    };
  }

  // Verificar caché de rol
  const cached = sessionCache.get(user.id);
  let rol: string | undefined;

  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    rol = cached.rol;
  } else {
    const adminClient = createAdminClient();
    const { data: perfil, error: perfilError } = await adminClient
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (perfilError || !perfil) {
      return {
        autorizado: false as const,
        respuesta: respuestaNoAutorizado(),
      };
    }
    rol = perfil.rol;
    if (!rol) {
      return {
        autorizado: false as const,
        respuesta: respuestaNoAutorizado(),
      };
    }
    sessionCache.set(user.id, { rol, ts: Date.now() });
  }

  if (!ROLES_ADMIN_SET.has(rol ?? '')) {
    return {
      autorizado: false as const,
      respuesta: respuestaNoAutorizado(),
    };
  }

  return { autorizado: true as const, supabase, user, rol: rol as RolAdmin };
}

export async function requerirAdmin(permiso: PermisoAdmin = 'verPanel') {
  const auth = await obtenerAdminActual();
  if (!auth.autorizado) return auth;

  if (!(PERMISOS_ADMIN[permiso] as readonly RolAdmin[]).includes(auth.rol)) {
    return {
      autorizado: false as const,
      respuesta: respuestaNoAutorizado(),
    };
  }

  return auth;
}
