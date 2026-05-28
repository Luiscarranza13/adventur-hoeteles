-- Servicios destacados para el carrusel de la home.
-- Las imagenes apuntan a archivos existentes en /public.

CREATE TABLE IF NOT EXISTS public.servicios_home (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.servicios_home ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "servicios_home_select_public" ON public.servicios_home;
CREATE POLICY "servicios_home_select_public"
ON public.servicios_home
FOR SELECT
USING (activo = true);

INSERT INTO public.servicios_home
  (slug, titulo, categoria, descripcion, imagen_url, orden, activo)
VALUES
  (
    'traslado-aeropuerto',
    'Traslado al aeropuerto',
    'Movilidad 24/7',
    'Recojo y traslado puntual desde y hacia aeropuertos en las principales ciudades del Peru.',
    '/imagen1.jpg',
    1,
    true
  ),
  (
    'viajes-interprovinciales',
    'Viajes interprovinciales',
    'Rutas nacionales',
    'Coordinamos viajes comodos y seguros hacia Cajamarca, Lima, Cusco, Arequipa y mas destinos.',
    '/imagen2.jpg',
    2,
    true
  ),
  (
    'hospedaje-corporativo',
    'Hospedaje corporativo',
    'Empresas',
    'Alojamiento para equipos, ejecutivos, visitas comerciales y estadias prolongadas.',
    '/imagen4.jpg',
    3,
    true
  ),
  (
    'eventos-especiales',
    'Eventos especiales',
    'Grupos y eventos',
    'Hospedaje, traslados y coordinacion para bodas, graduaciones, giras y encuentros especiales.',
    '/imagen5.jpg',
    4,
    true
  ),
  (
    'turismo-escolar',
    'Turismo escolar',
    'Instituciones',
    'Soporte para excursiones educativas, grupos escolares y viajes institucionales.',
    '/imagen6.jpg',
    5,
    true
  ),
  (
    'hoteles-verificados',
    'Hoteles verificados',
    'Alojamiento seguro',
    'Hoteles revisados con habitaciones comodas, ubicaciones convenientes y atencion directa.',
    '/imagen7.jpg',
    6,
    true
  ),
  (
    'atencion-personalizada',
    'Atencion personalizada',
    'Asesoria directa',
    'Acompanamiento por WhatsApp para elegir hotel, fechas y condiciones segun tu viaje.',
    '/imagen8.jpg',
    7,
    true
  ),
  (
    'paquetes-medida',
    'Paquetes a medida',
    'Viajes y estadias',
    'Armamos alternativas de estadia y movilidad para familias, empresas y grupos.',
    '/imagen9.jpg',
    8,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url,
  orden = EXCLUDED.orden,
  activo = EXCLUDED.activo,
  actualizado_en = now();

SELECT slug, titulo, categoria, imagen_url, orden
FROM public.servicios_home
ORDER BY orden;
