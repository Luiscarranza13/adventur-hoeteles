export interface ConfiguracionWeb {
  id?: string;
  nombre_negocio: string;
  slogan: string;
  descripcion: string;
  email_contacto: string;
  telefono_principal: string;
  whatsapp_numero: string;
  whatsapp_mensaje_reserva: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  twitter_url: string;
  modo_mantenimiento: boolean;
  mensaje_mantenimiento: string;
  reservas_activas: boolean;
  moneda_default: string;
}

export const CONFIGURACION_DEFAULT: ConfiguracionWeb = {
  id: 'global',
  nombre_negocio: 'Adventur Hoteles',
  slogan: 'Atrevete y descubre',
  descripcion: '',
  email_contacto: 'reservas@adventur.pe',
  telefono_principal: '+51 958 101 721',
  whatsapp_numero: '51958101721',
  whatsapp_mensaje_reserva: 'Hola, quiero consultar por un hotel.',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  twitter_url: '',
  modo_mantenimiento: false,
  mensaje_mantenimiento: 'Sitio en mantenimiento. Volvemos pronto.',
  reservas_activas: true,
  moneda_default: 'USD',
};

export const CAMPOS_CONFIGURACION = [
  'nombre_negocio',
  'slogan',
  'descripcion',
  'email_contacto',
  'telefono_principal',
  'whatsapp_numero',
  'whatsapp_mensaje_reserva',
  'facebook_url',
  'instagram_url',
  'tiktok_url',
  'twitter_url',
  'modo_mantenimiento',
  'mensaje_mantenimiento',
  'reservas_activas',
  'moneda_default',
] as const;

export type CampoConfiguracion = (typeof CAMPOS_CONFIGURACION)[number];

export function normalizarConfiguracion(data: Partial<ConfiguracionWeb> | null | undefined): ConfiguracionWeb {
  return {
    ...CONFIGURACION_DEFAULT,
    ...(data ?? {}),
  };
}

export function limpiarConfiguracionInput(body: Record<string, unknown>) {
  return CAMPOS_CONFIGURACION.reduce(
    (acc, campo) => {
      if (campo in body) acc[campo] = body[campo];
      return acc;
    },
    {} as Partial<Record<CampoConfiguracion, unknown>>
  );
}

export function limpiarTelefonoWhatsApp(numero: string) {
  return numero.replace(/\D/g, '');
}

export function crearUrlWhatsApp(numero: string, mensaje: string) {
  const telefono = limpiarTelefonoWhatsApp(numero || CONFIGURACION_DEFAULT.whatsapp_numero);
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje || CONFIGURACION_DEFAULT.whatsapp_mensaje_reserva)}`;
}
