import { NextRequest, NextResponse } from 'next/server';
import { listarTiposConHoteles } from '@/lib/hoteles-consultas';

// Revalidar cada 5 minutos
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const ciudad = request.nextUrl.searchParams.get('ciudad') || undefined;

  try {
    const tipos = await listarTiposConHoteles(ciudad);
    const response = NextResponse.json({ tipos });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch {
    return NextResponse.json({ tipos: [] });
  }
}
