import { createClient } from '@/lib/supabase/server';
import { RepositorioReserva } from '../../dominio/puertos/RepositorioReserva';
import { Reserva, DatosNuevaReserva, DatosActualizarReserva } from '../../dominio/entidades/Reserva';
import type { SupabaseClient } from '@supabase/supabase-js';

interface ReservaDb {
  id: string;
  habitacion_id: string;
  nombre_cliente: string;
  telefono_contacto: string;
  fecha_ingreso: string;
  fecha_salida: string;
  estado: string;
  fecha_creacion: string;
}

function mapDbToDomain(row: ReservaDb): Reserva {
  return {
    id: row.id,
    habitacionId: row.habitacion_id,
    nombreCliente: row.nombre_cliente,
    telefonoContacto: row.telefono_contacto,
    fechaIngreso: new Date(row.fecha_ingreso),
    fechaSalida: new Date(row.fecha_salida),
    estado: row.estado as Reserva['estado'],
    fechaCreacion: new Date(row.fecha_creacion),
  };
}

export class AdaptadorSupabaseReserva implements RepositorioReserva {
  private async getCliente(): Promise<SupabaseClient> {
    return createClient();
  }

  async buscarPorId(id: string): Promise<Reserva | null> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbToDomain(data as ReservaDb);
  }

  async listar(): Promise<Reserva[]> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('reservas')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error || !data) return [];
    return (data as ReservaDb[]).map(mapDbToDomain);
  }

  async crear(datos: DatosNuevaReserva): Promise<Reserva> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('reservas')
      .insert({
        habitacion_id: datos.habitacionId,
        nombre_cliente: datos.nombreCliente,
        telefono_contacto: datos.telefonoContacto,
        fecha_ingreso: datos.fechaIngreso.toISOString().split('T')[0],
        fecha_salida: datos.fechaSalida.toISOString().split('T')[0],
        estado: 'contacto_whatsapp',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as ReservaDb);
  }

  async actualizarEstado(id: string, datos: DatosActualizarReserva): Promise<Reserva> {
    const cliente = await this.getCliente();
    const { data, error } = await cliente
      .from('reservas')
      .update({ estado: datos.estado })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as ReservaDb);
  }
}
