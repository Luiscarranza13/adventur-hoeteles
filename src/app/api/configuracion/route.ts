import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CONFIGURACION_DEFAULT, normalizarConfiguracion } from '@/lib/configuracion';

export const dynamic = 'force-dynamic';

const FALLBACK_TTL_MS = 60_000;
let supabaseNoDisponibleHasta = 0;

function respuestaConfigDefault() {
  const response = NextResponse.json(CONFIGURACION_DEFAULT);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

function registrarFalloSupabase(error: unknown) {
  supabaseNoDisponibleHasta = Date.now() + FALLBACK_TTL_MS;
  const mensaje = error instanceof Error ? error.message : 'Supabase no disponible';
  console.warn(`[configuracion-publica:GET] fallback a defaults: ${mensaje}`);
}

export async function GET() {
  if (Date.now() < supabaseNoDisponibleHasta) {
    return respuestaConfigDefault();
  }

  try {
    const supabase = createAdminClient();
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
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (e) {
    registrarFalloSupabase(e);
    return respuestaConfigDefault();
  }
}
