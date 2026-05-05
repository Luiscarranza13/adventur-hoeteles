-- Permite que el modulo Configuracion controle datos globales de la web.
-- Ejecutar en Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.configuracion (
  id TEXT PRIMARY KEY DEFAULT 'global',
  nombre_negocio TEXT DEFAULT 'Adventur Hoteles',
  slogan TEXT DEFAULT 'Atrevete y descubre',
  descripcion TEXT,
  email_contacto TEXT DEFAULT 'reservas@adventur.pe',
  telefono_principal TEXT DEFAULT '+51 958 101 721',
  whatsapp_numero TEXT DEFAULT '51958101721',
  whatsapp_mensaje_reserva TEXT DEFAULT 'Hola, quiero consultar por un hotel.',
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  modo_mantenimiento BOOLEAN DEFAULT false,
  mensaje_mantenimiento TEXT DEFAULT 'Sitio en mantenimiento. Volvemos pronto.',
  reservas_activas BOOLEAN DEFAULT true,
  moneda_default TEXT DEFAULT 'USD',
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "configuracion_select_public" ON public.configuracion;
DROP POLICY IF EXISTS "configuracion_insert_admin" ON public.configuracion;
DROP POLICY IF EXISTS "configuracion_update_admin" ON public.configuracion;

CREATE POLICY "configuracion_select_public"
ON public.configuracion
FOR SELECT
USING (true);

CREATE POLICY "configuracion_insert_admin"
ON public.configuracion
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "configuracion_update_admin"
ON public.configuracion
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO public.configuracion (id)
VALUES ('global')
ON CONFLICT (id) DO NOTHING;
