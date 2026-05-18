import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  CONFIGURACION_DEFAULT,
  normalizarConfiguracion,
} from '@/lib/configuracion';
import { requerirAdmin } from '@/lib/admin-auth';
import { esquemaConfiguracionAdmin, respuestaErrorValidacion } from '@/lib/admin-validaciones';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    const auth = await requerirAdmin('gestionarConfiguracion');
    if (!auth.autorizado) return auth.respuesta;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error) {
      console.error('[configuracion:GET]', error);
      return NextResponse.json(CONFIGURACION_DEFAULT);
    }

    revalidateTag('configuracion', { expire: 0 });
    return NextResponse.json(normalizarConfiguracion(data));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener configuracion' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requerirAdmin('gestionarConfiguracion');
    if (!auth.autorizado) return auth.respuesta;
    const supabase = await createClient();
    const configuracion = esquemaConfiguracionAdmin.parse(await request.json());

    const { data, error } = await supabase
      .from('configuracion')
      .upsert(
        {
          id: 'global',
          ...configuracion,
          actualizado_en: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('[configuracion:PUT]', error);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(normalizarConfiguracion(data));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(respuestaErrorValidacion(e), { status: 400 });
    }
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al guardar configuracion' },
      { status: 500 }
    );
  }
}
