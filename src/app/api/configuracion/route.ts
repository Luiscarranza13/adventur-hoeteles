import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CONFIGURACION_DEFAULT, normalizarConfiguracion } from '@/lib/configuracion';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error) {
      console.error('[configuracion-publica:GET]', error);
      return NextResponse.json(CONFIGURACION_DEFAULT);
    }

    return NextResponse.json(normalizarConfiguracion(data));
  } catch (e) {
    console.error(e);
    return NextResponse.json(CONFIGURACION_DEFAULT);
  }
}
