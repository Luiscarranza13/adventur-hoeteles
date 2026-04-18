import { NextResponse } from 'next/server';
import { AdaptadorSupabaseUsuario } from '@/modules/usuarios';

export async function GET() {
  try {
    return NextResponse.json(await new AdaptadorSupabaseUsuario().listar());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}
