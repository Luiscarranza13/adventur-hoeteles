-- Tabla de configuración global del sistema
CREATE TABLE IF NOT EXISTS public.configuracion (
  id TEXT PRIMARY KEY DEFAULT 'global',
  -- Información del negocio
  nombre_negocio TEXT DEFAULT 'Adventur Hoteles',
  slogan TEXT DEFAULT 'Atrévete y descubre',
  descripcion TEXT,
  email_contacto TEXT,
  telefono_principal TEXT,
  -- WhatsApp
  whatsapp_numero TEXT,
  whatsapp_mensaje_reserva TEXT DEFAULT 'Hola, me interesa reservar una habitación.',
  -- Redes sociales
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  -- Modo mantenimiento
  modo_mantenimiento BOOLEAN DEFAULT false,
  mensaje_mantenimiento TEXT DEFAULT 'Sitio en mantenimiento. Volvemos pronto.',
  -- Configuración de reservas
  reservas_activas BOOLEAN DEFAULT true,
  moneda_default TEXT DEFAULT 'USD',
  -- Metadatos
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración por defecto si no existe
INSERT INTO public.configuracion (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;
