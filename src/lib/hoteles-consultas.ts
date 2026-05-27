import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_cache } from 'next/cache';
import { AdaptadorSupabaseHotel, ServicioHoteles } from '@/modules/hoteles';
import type { Hotel, TipoAlojamiento } from '@/modules/hoteles/dominio/entidades/Hotel';

export interface HotelConPrecio extends Hotel {
  precioMinimo: number | null;
}

function servicioHoteles() {
  return new ServicioHoteles(new AdaptadorSupabaseHotel());
}

export const listarHotelesActivos = unstable_cache(
  async (): Promise<Hotel[]> => {
    try {
      return await servicioHoteles().listarActivos();
    } catch (err) {
      console.error('[supabase] listarHotelesActivos falló:', err);
      return [];
    }
  },
  ['hoteles-activos'],
  { revalidate: 300, tags: ['hoteles'] }
);

export const buscarHotelesActivosPorCiudad = unstable_cache(
  async (ciudad: string): Promise<Hotel[]> => {
    try {
      return await servicioHoteles().buscarPorCiudad(ciudad);
    } catch (err) {
      console.error('[supabase] buscarHotelesActivosPorCiudad falló:', err);
      return [];
    }
  },
  ['hoteles-por-ciudad'],
  { revalidate: 300, tags: ['hoteles'] }
);

export async function obtenerHotelesBase(ciudad?: string): Promise<Hotel[]> {
  if (ciudad) return buscarHotelesActivosPorCiudad(ciudad);
  return listarHotelesActivos();
}

export function obtenerCiudadesConHoteles(hoteles: Hotel[]) {
  return [...new Set(hoteles.map((hotel) => hotel.ciudad).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export async function listarCiudadesConHoteles(): Promise<string[]> {
  const hoteles = await listarHotelesActivos();
  return obtenerCiudadesConHoteles(hoteles);
}

export async function listarTiposConHoteles(ciudad?: string): Promise<TipoAlojamiento[]> {
  const hoteles = await obtenerHotelesBase(ciudad);
  return [...new Set(
    hoteles
      .map((hotel) => hotel.tipoAlojamiento)
      .filter((tipo): tipo is TipoAlojamiento => Boolean(tipo)),
  )];
}

export const obtenerPreciosMinimos = unstable_cache(
  async (hotelIds: string[]): Promise<Record<string, number>> => {
    if (!hotelIds.length) return {};

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('habitaciones')
        .select('hotel_id, precio_noche')
        .in('hotel_id', hotelIds)
        .eq('esta_disponible', true)
        .eq('estado_mantenimiento', 'disponible');

      if (error || !data) return {};

      return data.reduce<Record<string, number>>((acc, habitacion) => {
        const hotelId = String(habitacion.hotel_id);
        const precio = Number(habitacion.precio_noche);
        if (!Number.isFinite(precio)) return acc;
        acc[hotelId] = acc[hotelId] ? Math.min(acc[hotelId], precio) : precio;
        return acc;
      }, {});
    } catch (err) {
      console.error('[supabase] obtenerPreciosMinimos falló:', err);
      return {};
    }
  },
  ['precios-minimos'],
  { revalidate: 300, tags: ['habitaciones'] }
);

export async function anexarPreciosMinimos(hoteles: Hotel[]): Promise<HotelConPrecio[]> {
  const precios = await obtenerPreciosMinimos(hoteles.map((hotel) => hotel.id));
  return hoteles.map((hotel) => ({
    ...hotel,
    precioMinimo: precios[hotel.id] ?? null,
  }));
}
