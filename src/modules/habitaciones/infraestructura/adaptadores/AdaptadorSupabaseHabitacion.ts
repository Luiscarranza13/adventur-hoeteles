import { createClient } from '@/lib/supabase/server';
import { RepositorioHabitacion } from '../../dominio/puertos/RepositorioHabitacion';
import { Habitacion, DatosNuevaHabitacion, DatosActualizarHabitacion, TipoHabitacion, EstadoMantenimiento, Moneda } from '../../dominio/entidades/Habitacion';
import type { SupabaseClient } from '@supabase/supabase-js';

interface HabitacionDb {
  id: string;
  hotel_id: string;
  nombre: string;
  descripcion: string | null;
  numero_habitacion: string | null;
  tipo_habitacion: TipoHabitacion;
  capacidad_personas: number;
  cantidad_camas: number;
  precio_noche: number;
  moneda: Moneda | null;
  amenidades: string[];
  imagenes_urls: string[];
  esta_disponible: boolean;
  estado_mantenimiento: EstadoMantenimiento;
  fecha_creacion: string;
}

function mapDbToDomain(row: HabitacionDb): Habitacion {
  return {
    id: row.id,
    hotelId: row.hotel_id,
    nombre: row.nombre,
    descripcion: row.descripcion || undefined,
    numeroHabitacion: row.numero_habitacion || undefined,
    tipoHabitacion: row.tipo_habitacion || 'estandar',
    capacidadPersonas: row.capacidad_personas,
    cantidadCamas: row.cantidad_camas || 1,
    precioNoche: Number(row.precio_noche),
    moneda: row.moneda || 'USD',
    amenidades: row.amenidades || [],
    imagenesUrls: row.imagenes_urls || [],
    estaDisponible: row.esta_disponible,
    estadoMantenimiento: row.estado_mantenimiento || 'disponible',
    fechaCreacion: new Date(row.fecha_creacion),
  };
}

export class AdaptadorSupabaseHabitacion implements RepositorioHabitacion {
  private async getCliente(): Promise<SupabaseClient> {
    return createClient();
  }

  async buscarPorId(id: string): Promise<Habitacion | null> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('habitaciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbToDomain(data as HabitacionDb);
  }

  async buscarPorHotelId(hotelId: string): Promise<Habitacion[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('habitaciones')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HabitacionDb[]).map(mapDbToDomain);
  }

  async listarTodas(): Promise<Habitacion[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('habitaciones')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HabitacionDb[]).map(mapDbToDomain);
  }

  async listarDisponibles(): Promise<Habitacion[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('habitaciones')
      .select('*')
      .eq('esta_disponible', true)
      .eq('estado_mantenimiento', 'disponible')
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HabitacionDb[]).map(mapDbToDomain);
  }

  async crear(datos: DatosNuevaHabitacion): Promise<Habitacion> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('habitaciones')
      .insert({
        hotel_id: datos.hotelId,
        nombre: datos.nombre,
        descripcion: datos.descripcion || null,
        numero_habitacion: datos.numeroHabitacion || null,
        tipo_habitacion: datos.tipoHabitacion || 'estandar',
        capacidad_personas: datos.capacidadPersonas,
        cantidad_camas: datos.cantidadCamas || 1,
        precio_noche: datos.precioNoche,
        moneda: datos.moneda || 'USD',
        amenidades: datos.amenidades || [],
        imagenes_urls: datos.imagenesUrls || [],
        esta_disponible: datos.estaDisponible ?? true,
        estado_mantenimiento: datos.estadoMantenimiento || 'disponible',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as HabitacionDb);
  }

  async actualizar(id: string, datos: DatosActualizarHabitacion): Promise<Habitacion> {
    const cliente = await this.getCliente();
    const updateData: Record<string, unknown> = {};
    if (datos.nombre !== undefined) updateData.nombre = datos.nombre;
    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion;
    if (datos.numeroHabitacion !== undefined) updateData.numero_habitacion = datos.numeroHabitacion;
    if (datos.tipoHabitacion !== undefined) updateData.tipo_habitacion = datos.tipoHabitacion;
    if (datos.capacidadPersonas !== undefined) updateData.capacidad_personas = datos.capacidadPersonas;
    if (datos.cantidadCamas !== undefined) updateData.cantidad_camas = datos.cantidadCamas;
    if (datos.precioNoche !== undefined) updateData.precio_noche = datos.precioNoche;
    if (datos.moneda !== undefined) updateData.moneda = datos.moneda;
    if (datos.amenidades !== undefined) updateData.amenidades = datos.amenidades;
    if (datos.imagenesUrls !== undefined) updateData.imagenes_urls = datos.imagenesUrls;
    if (datos.estaDisponible !== undefined) updateData.esta_disponible = datos.estaDisponible;
    if (datos.estadoMantenimiento !== undefined) updateData.estado_mantenimiento = datos.estadoMantenimiento;

    const { data, error } = await cliente
      .from('habitaciones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as HabitacionDb);
  }

  async eliminar(id: string): Promise<void> {
    const cliente = await this.getCliente();
    const { error } = await cliente.from('habitaciones').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
