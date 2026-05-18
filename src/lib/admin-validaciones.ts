import { z } from 'zod';

const textoRequerido = (campo: string, max = 180) =>
  z.string().trim().min(1, `${campo} es requerido`).max(max, `${campo} es demasiado largo`);

const textoOpcional = (max = 250) =>
  z.preprocess(
    value => value === '' || value === undefined ? undefined : value,
    z.string().trim().max(max).optional(),
  );

const urlOpcional = z.preprocess(
  value => value === '' || value === undefined ? undefined : value,
  z.string().trim().url('URL invalida').optional(),
);

export const tiposAlojamiento = ['Hotel', 'Hostal', 'Apart-hotel', 'Resort', 'Ecolodge', 'Albergue'] as const;
export const tiposHabitacion = ['SGL', 'DBL', 'TWN', 'TPL', 'QDL', 'FAM', 'SUI'] as const;
export const tiposCama = ['KB', 'QB', 'TB'] as const;
export const regimenesAlimentacion = ['RO', 'BB', 'HB', 'FB', 'AI'] as const;
export const estadosMantenimiento = ['disponible', 'mantenimiento', 'bloqueado'] as const;
export const monedas = ['USD', 'PEN'] as const;
export const rolesUsuario = ['admin', 'colaborador', 'viewer'] as const;

export const esquemaHotelAdmin = z.object({
  id: textoOpcional(80),
  nombre: textoRequerido('Nombre', 140),
  descripcion: textoRequerido('Descripcion', 2000),
  ciudad: textoRequerido('Ciudad', 100),
  direccion: textoRequerido('Direccion', 220),
  telefono_whatsapp: z.string().trim().regex(/^\+?\d[\d\s-]{7,20}$/, 'WhatsApp invalido'),
  email_contacto: z.preprocess(
    value => value === '' || value === undefined ? undefined : value,
    z.string().trim().email('Email invalido').optional(),
  ),
  estrellas: z.coerce.number().int().min(1).max(5).default(3),
  tipo_alojamiento: z.enum(tiposAlojamiento).default('Hotel'),
  imagenes_urls: z.array(z.string().url()).max(8).default([]),
  latitud: z.preprocess(
    value => value === '' || value === null || value === undefined ? undefined : value,
    z.coerce.number().min(-90).max(90).optional(),
  ),
  longitud: z.preprocess(
    value => value === '' || value === null || value === undefined ? undefined : value,
    z.coerce.number().min(-180).max(180).optional(),
  ),
  horario_apertura: textoOpcional(8),
  horario_cierre: textoOpcional(8),
  activo: z.boolean().default(true),
});

export const esquemaHabitacionAdmin = z.object({
  id: textoOpcional(80),
  hotel_id: textoRequerido('Hotel', 80),
  nombre: textoRequerido('Nombre', 140),
  descripcion: textoOpcional(2000),
  numero_habitacion: textoOpcional(40),
  tipo_habitacion: z.enum(tiposHabitacion).default('DBL'),
  tipo_cama: z.preprocess(
    value => value === '' || value === undefined ? undefined : value,
    z.enum(tiposCama).optional(),
  ),
  regimen_alimentacion: z.preprocess(
    value => value === '' || value === undefined ? undefined : value,
    z.enum(regimenesAlimentacion).optional(),
  ),
  capacidad_personas: z.coerce.number().int().min(1).max(20),
  cantidad_camas: z.coerce.number().int().min(1).max(10).default(1),
  precio_noche: z.coerce.number().positive().max(999999),
  moneda: z.enum(monedas).default('USD'),
  amenidades: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  imagenes_urls: z.array(z.string().url()).max(8).default([]),
  esta_disponible: z.boolean().default(true),
  estado_mantenimiento: z.enum(estadosMantenimiento).default('disponible'),
});

export const esquemaUsuarioCrearAdmin = z.object({
  nombreCompleto: textoRequerido('Nombre', 160),
  correo: z.string().trim().email('Correo invalido'),
  contrasena: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres').max(120),
  telefono: textoOpcional(40),
  rol: z.enum(rolesUsuario).default('colaborador'),
  fotoUrl: urlOpcional,
});

export const esquemaUsuarioActualizarAdmin = z.object({
  id: textoRequerido('ID', 80),
  nombreCompleto: textoRequerido('Nombre', 160),
  telefono: textoOpcional(40),
  rol: z.enum(rolesUsuario),
  fotoUrl: urlOpcional,
});

export const esquemaConfiguracionAdmin = z.object({
  nombre_negocio: textoRequerido('Nombre del negocio', 120),
  slogan: textoRequerido('Slogan', 160),
  descripcion: z.string().trim().max(2000).default(''),
  email_contacto: z.string().trim().email('Email invalido'),
  telefono_principal: textoRequerido('Telefono', 40),
  whatsapp_numero: z.string().trim().regex(/^\+?\d[\d\s-]{7,20}$/, 'WhatsApp invalido'),
  whatsapp_mensaje_reserva: textoRequerido('Mensaje de WhatsApp', 500),
  facebook_url: z.union([z.literal(''), z.string().trim().url()]).default(''),
  instagram_url: z.union([z.literal(''), z.string().trim().url()]).default(''),
  tiktok_url: z.union([z.literal(''), z.string().trim().url()]).default(''),
  twitter_url: z.union([z.literal(''), z.string().trim().url()]).default(''),
  modo_mantenimiento: z.boolean().default(false),
  mensaje_mantenimiento: textoRequerido('Mensaje de mantenimiento', 300),
  reservas_activas: z.boolean().default(true),
  moneda_default: z.enum(monedas).default('USD'),
});

export const esquemaReservaPublica = z.object({
  habitacionId: textoRequerido('Habitacion', 80),
  nombreCliente: textoRequerido('Nombre', 160),
  telefonoContacto: z.string().trim().regex(/^\+?\d[\d\s\-()]{7,24}$/, 'Telefono invalido'),
  fechaIngreso: z.coerce.date(),
  fechaSalida: z.coerce.date(),
}).refine(data => data.fechaSalida > data.fechaIngreso, {
  path: ['fechaSalida'],
  message: 'La fecha de salida debe ser posterior a la fecha de ingreso',
});

export const esquemaReservaAdmin = z.object({
  estado: z.enum(['contacto_whatsapp', 'confirmada', 'cancelada']),
  notas_cliente: textoOpcional(1000),
  cantidad_huespedes: z.preprocess(
    value => value === '' || value === null || value === undefined ? undefined : value,
    z.coerce.number().int().min(1).max(30).optional(),
  ),
  precio_total: z.preprocess(
    value => value === '' || value === null || value === undefined ? undefined : value,
    z.coerce.number().min(0).max(999999).optional(),
  ),
  fecha_confirmacion: z.preprocess(
    value => value === '' || value === null || value === undefined ? undefined : value,
    z.coerce.date().optional(),
  ),
  metodo_pago: z.preprocess(
    value => value === '' || value === null || value === undefined ? undefined : value,
    z.enum(['efectivo', 'tarjeta', 'transferencia', 'pendiente']).optional(),
  ),
});

export function respuestaErrorValidacion(error: z.ZodError) {
  return {
    error: 'Datos invalidos',
    detalles: error.issues.map(issue => ({
      campo: issue.path.join('.'),
      mensaje: issue.message,
    })),
  };
}
