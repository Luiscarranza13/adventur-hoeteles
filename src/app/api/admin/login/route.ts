import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Crear registro en tabla usuarios si no existe
    const { data: usuarioData } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!usuarioData) {
      await supabase.from('usuarios').insert({
        id: data.user.id,
        nombre_completo: data.user.email?.split('@')[0] || 'Admin',
        correo: data.user.email,
        telefono: null,
        rol: 'admin',
      });
    }

    return NextResponse.json({
      message: 'Login exitoso',
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
