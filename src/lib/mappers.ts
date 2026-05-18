import type { Habitacion } from '@/modules/habitaciones';
import type { Hotel } from '@/modules/hoteles';

type DbRow = Record<string, unknown>;

function stringOrEmpty(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function stringOrUndefined(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function numberOrUndefined(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function arrayOrEmpty(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function mapHotelDb(row: DbRow): Hotel {
  return {
    id: stringOrEmpty(row.id),
    nombre: stringOrEmpty(row.nombre),
    descripcion: stringOrEmpty(row.descripcion),
    ciudad: stringOrEmpty(row.ciudad),
    direccion: stringOrEmpty(row.direccion),
    telefonoWhatsapp: stringOrEmpty(row.telefono_whatsapp),
    emailContacto: stringOrUndefined(row.email_contacto),
    imagenesUrls: arrayOrEmpty(row.imagenes_urls),
    estrellas: Number(row.estrellas ?? 3),
    tipoAlojamiento: stringOrUndefined(row.tipo_alojamiento) as Hotel['tipoAlojamiento'],
    latitud: numberOrUndefined(row.latitud),
    longitud: numberOrUndefined(row.longitud),
    horarioApertura: stringOrUndefined(row.horario_apertura),
    horarioCierre: stringOrUndefined(row.horario_cierre),
    activo: Boolean(row.activo),
    fechaCreacion: new Date(stringOrEmpty(row.fecha_creacion)),
  };
}

export function mapHabitacionDb(row: DbRow): Habitacion {
  return {
    id: stringOrEmpty(row.id),
    hotelId: stringOrEmpty(row.hotel_id),
    nombre: stringOrEmpty(row.nombre),
    descripcion: stringOrUndefined(row.descripcion),
    numeroHabitacion: stringOrUndefined(row.numero_habitacion),
    tipoHabitacion: stringOrEmpty(row.tipo_habitacion) as Habitacion['tipoHabitacion'],
    tipoCama: stringOrUndefined(row.tipo_cama) as Habitacion['tipoCama'],
    regimenAlimentacion: stringOrUndefined(row.regimen_alimentacion) as Habitacion['regimenAlimentacion'],
    capacidadPersonas: Number(row.capacidad_personas ?? 1),
    cantidadCamas: Number(row.cantidad_camas ?? 1),
    precioNoche: Number(row.precio_noche ?? 0),
    moneda: stringOrEmpty(row.moneda || 'USD') as Habitacion['moneda'],
    amenidades: arrayOrEmpty(row.amenidades),
    imagenesUrls: arrayOrEmpty(row.imagenes_urls),
    estaDisponible: Boolean(row.esta_disponible),
    estadoMantenimiento: stringOrEmpty(row.estado_mantenimiento || 'disponible') as Habitacion['estadoMantenimiento'],
    fechaCreacion: new Date(stringOrEmpty(row.fecha_creacion)),
  };
}
