import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseEnv } from '@/lib/env';
import { apiError, logApiError, ok } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return apiError('Email y contrasena son requeridos', 400, 'BAD_REQUEST');
    }

    const cookieStore = await cookies();
    const env = getSupabaseEnv();

    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return apiError('Credenciales invalidas', 401, 'UNAUTHENTICATED');
    }

    const { data: usuarioData } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!usuarioData || !['admin', 'colaborador', 'viewer'].includes(usuarioData.rol)) {
      await supabase.auth.signOut();
      return apiError('Tu usuario no tiene permisos para acceder al panel', 403, 'FORBIDDEN');
    }

    return ok({
      message: 'Login exitoso',
      user: { id: data.user.id, email: data.user.email, rol: usuarioData.rol },
    });
  } catch (error) {
    logApiError('POST /api/admin/login', error);
    return apiError('Error interno del servidor', 500, 'INTERNAL_ERROR');
  }
}
