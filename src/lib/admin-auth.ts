import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ROLES_ADMIN = new Set(['admin', 'colaborador']);

// Cache de sesión en memoria para evitar 2 queries por request
// Se invalida automáticamente porque cada request crea un nuevo módulo en dev,
// pero en producción el módulo persiste entre requests del mismo worker.
const sessionCache = new Map<string, { rol: string; ts: number }>();
const CACHE_TTL = 30_000; // 30 segundos

export async function requerirAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      autorizado: false as const,
      respuesta: NextResponse.json({ error: 'No autenticado' }, { status: 401 }),
    };
  }

  // Verificar caché de rol
  const cached = sessionCache.get(user.id);
  let rol: string | undefined;

  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    rol = cached.rol;
  } else {
    const { data: perfil, error: perfilError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (perfilError || !perfil) {
      return {
        autorizado: false as const,
        respuesta: NextResponse.json({ error: 'No autorizado' }, { status: 403 }),
      };
    }
    rol = perfil.rol;
    if (!rol) {
      return {
        autorizado: false as const,
        respuesta: NextResponse.json({ error: 'No autorizado' }, { status: 403 }),
      };
    }
    sessionCache.set(user.id, { rol, ts: Date.now() });
  }

  if (!ROLES_ADMIN.has(rol ?? '')) {
    return {
      autorizado: false as const,
      respuesta: NextResponse.json({ error: 'No autorizado' }, { status: 403 }),
    };
  }

  return { autorizado: true as const, supabase, user };
}
