import { NextRequest, NextResponse } from 'next/server';
import { AdaptadorSupabaseUsuario } from '@/modules/usuarios';
import { createClient } from '@/lib/supabase/server';

const repo = () => new AdaptadorSupabaseUsuario();

export async function GET() {
  try {
    return NextResponse.json(await repo().listar());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreCompleto, correo, contrasena, telefono, rol } = body;

    if (!nombreCompleto || !correo || !contrasena) {
      return NextResponse.json({ error: 'Nombre, correo y contraseña son requeridos' }, { status: 400 });
    }

    // Crear usuario en Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.admin
      ? await (await import('@/lib/supabase/admin')).createAdminClient().auth.admin.createUser({
          email: correo,
          password: contrasena,
          email_confirm: true,
        })
      : { data: null, error: new Error('Admin client no disponible') };

    if (authError || !authData?.user) {
      return NextResponse.json({ error: authError?.message ?? 'Error al crear usuario en Auth' }, { status: 500 });
    }

    // Insertar en tabla usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        nombre_completo: nombreCompleto,
        correo,
        telefono: telefono || null,
        rol: rol || 'recepcionista',
        foto_url: body.fotoUrl || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nombreCompleto, telefono, rol } = body;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre_completo: nombreCompleto,
        telefono: telefono || null,
        rol,
        foto_url: body.fotoUrl || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const supabase = await createClient();
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
