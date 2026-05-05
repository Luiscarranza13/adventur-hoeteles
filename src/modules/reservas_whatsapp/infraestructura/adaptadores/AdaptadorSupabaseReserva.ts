import { createClient } from '@/lib/supabase/server';
import { RepositorioReserva } from '../../dominio/puertos/RepositorioReserva';
import { Reserva, DatosNuevaReserva, DatosActualizarReserva, EstadoReserva, MetodoPago } from '../../dominio/entidades/Reserva';
import type { SupabaseClient } from '@supabase/supabase-js';

interface ReservaDb {
  id: string;
  habitacion_id: string;
  nombre_cliente: string;
  telefono_contacto: string;
  fecha_ingreso: string;
  fecha_salida: string;
  notas_cliente: string | null;
  cantidad_huespedes: number | null;
  precio_total: number | null;
  estado: EstadoReserva;
  fecha_confirmacion: string | null;
  metodo_pago: MetodoPago | null;
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
    notasCliente: row.notas_cliente || undefined,
    cantidadHuespedes: row.cantidad_huespedes || undefined,
    precioTotal: row.precio_total ? Number(row.precio_total) : undefined,
    estado: row.estado,
    fechaConfirmacion: row.fecha_confirmacion ? new Date(row.fecha_confirmacion) : undefined,
    metodoPago: row.metodo_pago || undefined,
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
        notas_cliente: datos.notasCliente || null,
        cantidad_huespedes: datos.cantidadHuespedes || null,
        precio_total: datos.precioTotal || null,
        metodo_pago: datos.metodoPago || null,
        estado: 'contacto_whatsapp',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as ReservaDb);
  }

  async actualizarEstado(id: string, datos: DatosActualizarReserva): Promise<Reserva> {
    const cliente = await this.getCliente();
    const updateData: Record<string, unknown> = {};
    if (datos.estado !== undefined) updateData.estado = datos.estado;
    if (datos.notasCliente !== undefined) updateData.notas_cliente = datos.notasCliente;
    if (datos.cantidadHuespedes !== undefined) updateData.cantidad_huespedes = datos.cantidadHuespedes;
    if (datos.precioTotal !== undefined) updateData.precio_total = datos.precioTotal;
    if (datos.fechaConfirmacion !== undefined) updateData.fecha_confirmacion = datos.fechaConfirmacion?.toISOString();
    if (datos.metodoPago !== undefined) updateData.metodo_pago = datos.metodoPago;

    const { data, error } = await cliente
      .from('reservas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToDomain(data as ReservaDb);
  }
}
