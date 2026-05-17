import { NextResponse } from 'next/server';
import { listarCiudadesConHoteles } from '@/lib/hoteles-consultas';

// Revalidar cada 5 minutos
export const revalidate = 300;

export async function GET() {
  try {
    const ciudades = await listarCiudadesConHoteles();
    const response = NextResponse.json({ ciudades });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch {
    return NextResponse.json({ ciudades: [] });
  }
}
