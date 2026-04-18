import { createClient } from '@/lib/supabase/server';
import { RepositorioHabitacion } from '../../dominio/puertos/RepositorioHabitacion';
import { Habitacion, DatosNuevaHabitacion, DatosActualizarHabitacion } from '../../dominio/entidades/Habitacion';
import type { SupabaseClient } from '@supabase/supabase-js';

interface HabitacionDb {
  id: string;
  hotel_id: string;
  nombre: string;
  descripcion: string | null;
  capacidad_personas: number;
  precio_noche: number;
  imagenes_urls: string[];
  esta_disponible: boolean;
  fecha_creacion: string;
}

function mapDbToDomain(row: HabitacionDb): Habitacion {
  return {
    id: row.id,
    hotelId: row.hotel_id,
    nombre: row.nombre,
    descripcion: row.descripcion || undefined,
    capacidadPersonas: row.capacidad_personas,
    precioNoche: Number(row.precio_noche),
    imagenesUrls: row.imagenes_urls || [],
    estaDisponible: row.esta_disponible,
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
      .eq('esta_disponible', true);

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
        capacidad_personas: datos.capacidadPersonas,
        precio_noche: datos.precioNoche,
        imagenes_urls: datos.imagenesUrls || [],
        esta_disponible: datos.estaDisponible ?? true,
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
    if (datos.capacidadPersonas !== undefined) updateData.capacidad_personas = datos.capacidadPersonas;
    if (datos.precioNoche !== undefined) updateData.precio_noche = datos.precioNoche;
    if (datos.imagenesUrls !== undefined) updateData.imagenes_urls = datos.imagenesUrls;
    if (datos.estaDisponible !== undefined) updateData.esta_disponible = datos.estaDisponible;

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
