import { createClient } from '@/lib/supabase/server';
import { RepositorioHotel } from '../../dominio/puertos/RepositorioHotel';
import { Hotel, DatosNuevoHotel, DatosActualizarHotel } from '../../dominio/entidades/Hotel';
import type { SupabaseClient } from '@supabase/supabase-js';

interface HotelDb {
  id: string;
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefono_whatsapp: string;
  imagenes_urls: string[];
  estrellas: number;
  activo: boolean;
  fecha_creacion: string;
}

function mapDbToDomain(row: HotelDb): Hotel {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    ciudad: row.ciudad,
    direccion: row.direccion,
    telefonoWhatsapp: row.telefono_whatsapp,
    imagenesUrls: row.imagenes_urls || [],
    estrellas: row.estrellas,
    activo: row.activo,
    fechaCreacion: new Date(row.fecha_creacion),
  };
}

export class AdaptadorSupabaseHotel implements RepositorioHotel {
  private async getCliente(): Promise<SupabaseClient> {
    return createClient();
  }

  async buscarPorId(id: string): Promise<Hotel | null> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbToDomain(data as HotelDb);
  }

  async buscarPorCiudad(ciudad: string): Promise<Hotel[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .ilike('ciudad', `%${ciudad}%`)
      .eq('activo', true);

    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async listarActivos(): Promise<Hotel[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .eq('activo', true)
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async listarTodos(): Promise<Hotel[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async crear(datos: DatosNuevoHotel): Promise<Hotel> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .insert({
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        ciudad: datos.ciudad,
        direccion: datos.direccion,
        telefono_whatsapp: datos.telefonoWhatsapp,
        imagenes_urls: datos.imagenesUrls || [],
        estrellas: datos.estrellas || 3,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as HotelDb);
  }

  async actualizar(id: string, datos: DatosActualizarHotel): Promise<Hotel> {
    const cliente = await this.getCliente();
    const updateData: Record<string, unknown> = {};
    if (datos.nombre !== undefined) updateData.nombre = datos.nombre;
    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion;
    if (datos.ciudad !== undefined) updateData.ciudad = datos.ciudad;
    if (datos.direccion !== undefined) updateData.direccion = datos.direccion;
    if (datos.telefonoWhatsapp !== undefined) updateData.telefono_whatsapp = datos.telefonoWhatsapp;
    if (datos.imagenesUrls !== undefined) updateData.imagenes_urls = datos.imagenesUrls;
    if (datos.estrellas !== undefined) updateData.estrellas = datos.estrellas;
    if (datos.activo !== undefined) updateData.activo = datos.activo;

    const { data, error } = await cliente
      .from('hoteles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as HotelDb);
  }

  async eliminar(id: string): Promise<void> {
    const cliente = await this.getCliente();
    const { error } = await cliente.from('hoteles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
