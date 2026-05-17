import { createReadonlyClient } from '@/lib/supabase/readonly';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { RepositorioHotel } from '../../dominio/puertos/RepositorioHotel';
import { Hotel, DatosNuevoHotel, DatosActualizarHotel, TipoAlojamiento } from '../../dominio/entidades/Hotel';

interface HotelDb {
  id: string;
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefono_whatsapp: string;
  email_contacto?: string;
  imagenes_urls: string[];
  estrellas: number;
  tipo_alojamiento?: string;
  latitud?: number;
  longitud?: number;
  horario_apertura?: string;
  horario_cierre?: string;
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
    emailContacto: row.email_contacto,
    imagenesUrls: row.imagenes_urls || [],
    estrellas: row.estrellas,
    tipoAlojamiento: row.tipo_alojamiento as TipoAlojamiento | undefined,
    latitud: row.latitud,
    longitud: row.longitud,
    horarioApertura: row.horario_apertura,
    horarioCierre: row.horario_cierre,
    activo: row.activo,
    fechaCreacion: new Date(row.fecha_creacion),
  };
}

function getCliente() {
  if (typeof window === 'undefined') {
    return createReadonlyClient();
  }
  return createBrowserClient();
}

export class AdaptadorSupabaseHotel implements RepositorioHotel {
  async buscarPorId(id: string): Promise<Hotel | null> {
    const cliente = getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbToDomain(data as HotelDb);
  }

  async buscarPorTipo(tipo: TipoAlojamiento): Promise<Hotel[]> {
    const cliente = getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .eq('tipo_alojamiento', tipo)
      .eq('activo', true)
      .order('fecha_creacion', { ascending: false });
    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async buscarPorCiudad(ciudad: string): Promise<Hotel[]> {
    const cliente = getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .ilike('ciudad', `%${ciudad}%`)
      .eq('activo', true);

    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async listarActivos(): Promise<Hotel[]> {
    const cliente = getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .eq('activo', true)
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async listarTodos(): Promise<Hotel[]> {
    const cliente = getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as HotelDb[]).map(mapDbToDomain);
  }

  async crear(datos: DatosNuevoHotel): Promise<Hotel> {
    const cliente = getCliente();
    const { data, error } = await cliente
      .from('hoteles')
      .insert({
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        ciudad: datos.ciudad,
        direccion: datos.direccion,
        telefono_whatsapp: datos.telefonoWhatsapp,
        email_contacto: datos.emailContacto,
        imagenes_urls: datos.imagenesUrls || [],
        estrellas: datos.estrellas || 3,
        tipo_alojamiento: datos.tipoAlojamiento,
        latitud: datos.latitud,
        longitud: datos.longitud,
        horario_apertura: datos.horarioApertura,
        horario_cierre: datos.horarioCierre,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as HotelDb);
  }

  async actualizar(id: string, datos: DatosActualizarHotel): Promise<Hotel> {
    const cliente = getCliente();
    const updateData: Record<string, unknown> = {};
    if (datos.nombre !== undefined) updateData.nombre = datos.nombre;
    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion;
    if (datos.ciudad !== undefined) updateData.ciudad = datos.ciudad;
    if (datos.direccion !== undefined) updateData.direccion = datos.direccion;
    if (datos.telefonoWhatsapp !== undefined) updateData.telefono_whatsapp = datos.telefonoWhatsapp;
    if (datos.emailContacto !== undefined) updateData.email_contacto = datos.emailContacto;
    if (datos.imagenesUrls !== undefined) updateData.imagenes_urls = datos.imagenesUrls;
    if (datos.estrellas !== undefined) updateData.estrellas = datos.estrellas;
    if (datos.tipoAlojamiento !== undefined) updateData.tipo_alojamiento = datos.tipoAlojamiento;
    if (datos.latitud !== undefined) updateData.latitud = datos.latitud;
    if (datos.longitud !== undefined) updateData.longitud = datos.longitud;
    if (datos.horarioApertura !== undefined) updateData.horario_apertura = datos.horarioApertura;
    if (datos.horarioCierre !== undefined) updateData.horario_cierre = datos.horarioCierre;
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
    const cliente = getCliente();
    const { error } = await cliente.from('hoteles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
