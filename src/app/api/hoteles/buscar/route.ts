import { NextRequest, NextResponse } from 'next/server';
import { obtenerHotelesBase, anexarPreciosMinimos } from '@/lib/hoteles-consultas';
import type { HotelConPrecio } from '@/lib/hoteles-consultas';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ciudad = searchParams.get('ciudad') || undefined;
  const estrellas = searchParams.get('estrellas') || undefined;
  const tipo = searchParams.get('tipo') || undefined;
  const q = searchParams.get('q') || undefined;

  try {
    const hotelesRaw = await obtenerHotelesBase(ciudad);
    let hoteles: HotelConPrecio[] = await anexarPreciosMinimos(hotelesRaw);

    if (estrellas) {
      hoteles = hoteles.filter((h) => h.estrellas === Number(estrellas));
    }

    if (tipo) {
      hoteles = hoteles.filter((h) => h.tipoAlojamiento === tipo);
    }

    if (q) {
      const qLower = q.toLowerCase();
      hoteles = hoteles.filter(
        (h) =>
          h.nombre.toLowerCase().includes(qLower) ||
          h.descripcion.toLowerCase().includes(qLower) ||
          h.ciudad.toLowerCase().includes(qLower),
      );
    }

    return NextResponse.json({ hoteles, total: hoteles.length });
  } catch {
    return NextResponse.json({ hoteles: [], total: 0 }, { status: 500 });
  }
}
