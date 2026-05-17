import { NextResponse } from 'next/server';
import { createReadonlyClient } from '@/lib/supabase/readonly';
import { CONFIGURACION_DEFAULT, normalizarConfiguracion } from '@/lib/configuracion';

export const dynamic = 'force-dynamic';

const FALLBACK_TTL_MS = 60_000;
let supabaseNoDisponibleHasta = 0;
let ultimoAviso = 0;

function usarConfiguracionLocalEnDev() {
  return process.env.NODE_ENV !== 'production' && process.env.ADVENTUR_REMOTE_CONFIG_DEV !== 'true';
}

function respuestaConfigDefault() {
  const response = NextResponse.json(CONFIGURACION_DEFAULT);
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}

function registrarFalloSupabase(error: unknown) {
  supabaseNoDisponibleHasta = Date.now() + FALLBACK_TTL_MS;

  if (process.env.NODE_ENV !== 'production' && Date.now() - ultimoAviso > FALLBACK_TTL_MS) {
    ultimoAviso = Date.now();
    const mensaje = error instanceof Error ? error.message : 'Supabase no disponible';
    console.warn(`[configuracion-publica:GET] usando configuración local: ${mensaje}`);
  }
}

export async function GET() {
  if (usarConfiguracionLocalEnDev()) {
    return respuestaConfigDefault();
  }

  if (Date.now() < supabaseNoDisponibleHasta) {
    return respuestaConfigDefault();
  }

  try {
    const supabase = createReadonlyClient();
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error) {
      registrarFalloSupabase(error);
      return respuestaConfigDefault();
    }

    const response = NextResponse.json(normalizarConfiguracion(data));
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (e) {
    registrarFalloSupabase(e);
    return respuestaConfigDefault();
  }
}
