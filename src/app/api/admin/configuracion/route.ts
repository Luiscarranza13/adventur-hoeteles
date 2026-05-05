import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  CONFIGURACION_DEFAULT,
  limpiarConfiguracionInput,
  normalizarConfiguracion,
} from '@/lib/configuracion';

export async function GET() {
  try {
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

    return NextResponse.json(normalizarConfiguracion(data));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener configuracion' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const configuracion = limpiarConfiguracionInput(body);

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
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al guardar configuracion' },
      { status: 500 }
    );
  }
}
