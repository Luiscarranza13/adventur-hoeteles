import { NextRequest, NextResponse } from 'next/server';
import { AdaptadorSupabaseUsuario } from '@/modules/usuarios';
import { createAdminClient } from '@/lib/supabase/admin';
import { requerirAdmin } from '@/lib/admin-auth';
import {
  esquemaUsuarioActualizarAdmin,
  esquemaUsuarioCrearAdmin,
  respuestaErrorValidacion,
} from '@/lib/admin-validaciones';
import { z } from 'zod';
import { getEnv } from '@/lib/env';

const repo = () => new AdaptadorSupabaseUsuario();

export async function GET() {
  try {
    const auth = await requerirAdmin('gestionarUsuarios');
    if (!auth.autorizado) return auth.respuesta;
    const data = await repo().listar();
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarUsuarios');
    if (!auth.autorizado) return auth.respuesta;

    const body = esquemaUsuarioCrearAdmin.parse(await request.json());

    // Verificar si el correo ya existe
    const { data: existente } = await auth.supabase
      .from('usuarios')
      .select('id')
      .eq('correo', body.correo)
      .maybeSingle();

    if (existente) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese correo electrónico' }, { status: 400 });
    }

    let userId: string;
    const serviceKey = Boolean(getEnv().SUPABASE_SERVICE_ROLE_KEY);

    if (serviceKey) {
      // Ruta preferida: service role — crea usuario confirmado directamente
      const supabaseAdmin = createAdminClient();
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: body.correo,
        password: body.contrasena,
        email_confirm: true,
        user_metadata: { nombre_completo: body.nombreCompleto },
      });
      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message ?? 'Error al crear usuario en Auth' },
          { status: 500 },
        );
      }
      userId = authData.user.id;
    } else {
      // Fallback: signUp — funciona si "Confirm email" está desactivado en Supabase Auth settings
      const { data: signUpData, error: signUpError } = await auth.supabase.auth.signUp({
        email: body.correo,
        password: body.contrasena,
      });

      if (signUpError) {
        return NextResponse.json({ error: signUpError.message }, { status: 500 });
      }
      if (!signUpData.user) {
        return NextResponse.json(
          { error: 'No se pudo crear el usuario. Verifica que la confirmación de email esté desactivada en Supabase Auth.' },
          { status: 500 },
        );
      }
      userId = signUpData.user.id;
    }

    // Insertar perfil en tabla usuarios
    const { data, error } = await auth.supabase
      .from('usuarios')
      .insert({
        id: userId,
        nombre_completo: body.nombreCompleto,
        correo: body.correo,
        telefono: body.telefono ?? null,
        rol: body.rol,
        foto_url: body.fotoUrl ?? null,
      })
      .select()
      .single();

    if (error) {
      // Limpiar usuario de Auth si falla el perfil
      if (serviceKey) {
        try { await createAdminClient().auth.admin.deleteUser(userId); } catch { /* ignorar */ }
      }
      return NextResponse.json({ error: `Error al crear perfil: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    }
    console.error('[POST /api/admin/usuarios]', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error al crear usuario' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarUsuarios');
    if (!auth.autorizado) return auth.respuesta;

    const body = esquemaUsuarioActualizarAdmin.parse(await request.json());
    if (body.id === auth.user.id && body.rol !== 'admin') {
      return NextResponse.json({ error: 'No puedes quitarte tu propio rol admin' }, { status: 400 });
    }

    const { count } = await auth.supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'admin');
    const { data: usuarioActual } = await auth.supabase
      .from('usuarios')
      .select('rol')
      .eq('id', body.id)
      .single();

    if (usuarioActual?.rol === 'admin' && body.rol !== 'admin' && (count ?? 0) <= 1) {
      return NextResponse.json({ error: 'Debe existir al menos un administrador' }, { status: 400 });
    }

    const { data, error } = await auth.supabase
      .from('usuarios')
      .update({
        nombre_completo: body.nombreCompleto,
        telefono: body.telefono ?? null,
        rol: body.rol,
        foto_url: body.fotoUrl ?? null,
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarUsuarios');
    if (!auth.autorizado) return auth.respuesta;

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    if (id === auth.user.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propio usuario' }, { status: 400 });
    }

    const { count } = await auth.supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'admin');
    const { data: usuario } = await auth.supabase
      .from('usuarios')
      .select('rol')
      .eq('id', id)
      .single();

    if (usuario?.rol === 'admin' && (count ?? 0) <= 1) {
      return NextResponse.json({ error: 'Debe existir al menos un administrador' }, { status: 400 });
    }

    const { error } = await auth.supabase.from('usuarios').delete().eq('id', id);
    if (error) throw error;

    // Intentar eliminar de Auth si hay service role key
    if (getEnv().SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await createAdminClient().auth.admin.deleteUser(id);
      } catch { /* ignorar si falla — el perfil ya fue eliminado */ }
    }

    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
