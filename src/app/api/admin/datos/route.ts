/**
 * Endpoint combinado que devuelve hoteles + habitaciones en una sola request,
 * con datos mapeados a camelCase para que el frontend los consuma directamente.
 */
import { NextResponse } from 'next/server';
import { requerirAdmin } from '@/lib/admin-auth';

// Mapear fila de DB (snake_case) → dominio (camelCase)
function mapHotel(row: Record<string, unknown>) {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    ciudad: row.ciudad,
    direccion: row.direccion,
    telefonoWhatsapp: row.telefono_whatsapp,
    emailContacto: row.email_contacto,
    imagenesUrls: row.imagenes_urls ?? [],
    estrellas: row.estrellas,
    tipoAlojamiento: row.tipo_alojamiento,
    latitud: row.latitud,
    longitud: row.longitud,
    horarioApertura: row.horario_apertura,
    horarioCierre: row.horario_cierre,
    activo: row.activo,
    fechaCreacion: row.fecha_creacion,
  };
}

function mapHabitacion(row: Record<string, unknown>) {
  return {
    id: row.id,
    hotelId: row.hotel_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    numeroHabitacion: row.numero_habitacion,
    tipoHabitacion: row.tipo_habitacion,
    tipoCama: row.tipo_cama,
    regimenAlimentacion: row.regimen_alimentacion,
    capacidadPersonas: row.capacidad_personas,
    cantidadCamas: row.cantidad_camas ?? 1,
    precioNoche: Number(row.precio_noche),
    moneda: row.moneda ?? 'USD',
    amenidades: row.amenidades ?? [],
    imagenesUrls: row.imagenes_urls ?? [],
    estaDisponible: row.esta_disponible,
    estadoMantenimiento: row.estado_mantenimiento,
    fechaCreacion: row.fecha_creacion,
  };
}

export async function GET() {
  try {
    const auth = await requerirAdmin();
    if (!auth.autorizado) return auth.respuesta;

    const [hotelesRes, habitacionesRes] = await Promise.all([
      auth.supabase.from('hoteles').select('*').order('fecha_creacion', { ascending: false }),
      auth.supabase.from('habitaciones').select('*').order('fecha_creacion', { ascending: false }),
    ]);

    const res = NextResponse.json({
      hoteles: (hotelesRes.data ?? []).map(mapHotel),
      habitaciones: (habitacionesRes.data ?? []).map(mapHabitacion),
    });
    res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
