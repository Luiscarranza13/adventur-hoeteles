-- Destinos/lugares de procedencia visibles en la web.
-- Ejecutar en Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.destinos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  departamento TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'lugar',
  uso TEXT NOT NULL DEFAULT 'procedencia',
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.destinos ADD COLUMN IF NOT EXISTS uso TEXT NOT NULL DEFAULT 'procedencia';
ALTER TABLE public.destinos ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.destinos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "destinos_select_public" ON public.destinos;
DROP POLICY IF EXISTS "destinos_insert_admin" ON public.destinos;
DROP POLICY IF EXISTS "destinos_update_admin" ON public.destinos;
DROP POLICY IF EXISTS "destinos_delete_admin" ON public.destinos;

CREATE POLICY "destinos_select_public"
ON public.destinos
FOR SELECT
USING (activo = true);

CREATE POLICY "destinos_insert_admin"
ON public.destinos
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "destinos_update_admin"
ON public.destinos
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "destinos_delete_admin"
ON public.destinos
FOR DELETE
USING (auth.uid() IS NOT NULL);

INSERT INTO public.destinos (slug, nombre, departamento, tipo, uso, activo)
VALUES
  ('amazonas', 'Amazonas', 'Amazonas', 'departamento', 'procedencia', true),
  ('chachapoyas', 'Chachapoyas', 'Amazonas', 'ciudad', 'procedencia', true),
  ('gocta', 'Gocta', 'Amazonas', 'atractivo', 'procedencia', true),
  ('ancash', 'Áncash', 'Áncash', 'departamento', 'procedencia', true),
  ('chimbote', 'Chimbote', 'Áncash', 'ciudad', 'procedencia', true),
  ('huaraz', 'Huaraz', 'Áncash', 'ciudad', 'procedencia', true),
  ('apurimac', 'Apurímac', 'Apurímac', 'departamento', 'procedencia', true),
  ('abancay', 'Abancay', 'Apurímac', 'ciudad', 'procedencia', true),
  ('arequipa', 'Arequipa', 'Arequipa', 'departamento', 'procedencia', true),
  ('colca', 'Colca', 'Arequipa', 'atractivo', 'procedencia', true),
  ('ayacucho', 'Ayacucho', 'Ayacucho', 'departamento', 'procedencia', true),
  ('cajamarca', 'Cajamarca', 'Cajamarca', 'departamento', 'procedencia', true),
  ('chota', 'Chota', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('cutervo', 'Cutervo', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('cajabamba', 'Cajabamba', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('celendin', 'Celendín', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('san-miguel-cajamarca', 'San Miguel', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('santa-cruz-cajamarca', 'Santa Cruz', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('bambamarca', 'Bambamarca', 'Cajamarca', 'ciudad', 'procedencia', true),
  ('cusco', 'Cusco', 'Cusco', 'departamento', 'procedencia', true),
  ('valle-sagrado', 'Valle Sagrado', 'Cusco', 'zona', 'procedencia', true),
  ('machupicchu', 'Machupicchu', 'Cusco', 'atractivo', 'procedencia', true),
  ('huancavelica', 'Huancavelica', 'Huancavelica', 'departamento', 'procedencia', true),
  ('huanuco', 'Huánuco', 'Huánuco', 'departamento', 'procedencia', true),
  ('tingo-maria', 'Tingo María', 'Huánuco', 'ciudad', 'procedencia', true),
  ('ica', 'Ica', 'Ica', 'departamento', 'procedencia', true),
  ('paracas', 'Paracas', 'Ica', 'ciudad', 'procedencia', true),
  ('junin', 'Junín', 'Junín', 'departamento', 'procedencia', true),
  ('huancayo', 'Huancayo', 'Junín', 'ciudad', 'procedencia', true),
  ('la-merced', 'La Merced', 'Junín', 'ciudad', 'procedencia', true),
  ('oxapampa', 'Oxapampa', 'Pasco', 'ciudad', 'procedencia', true),
  ('pozuzo', 'Pozuzo', 'Pasco', 'ciudad', 'procedencia', true),
  ('la-libertad', 'La Libertad', 'La Libertad', 'departamento', 'procedencia', true),
  ('trujillo', 'Trujillo', 'La Libertad', 'ciudad', 'procedencia', true),
  ('pacasmayo', 'Pacasmayo', 'La Libertad', 'ciudad', 'procedencia', true),
  ('lambayeque', 'Lambayeque', 'Lambayeque', 'departamento', 'procedencia', true),
  ('chiclayo', 'Chiclayo', 'Lambayeque', 'ciudad', 'procedencia', true),
  ('lima', 'Lima', 'Lima', 'departamento', 'procedencia', true),
  ('la-victoria', 'La Victoria', 'Lima', 'distrito', 'procedencia', true),
  ('lince', 'Lince', 'Lima', 'distrito', 'procedencia', true),
  ('barranco', 'Barranco', 'Lima', 'distrito', 'procedencia', true),
  ('miraflores', 'Miraflores', 'Lima', 'distrito', 'procedencia', true),
  ('loreto', 'Loreto', 'Loreto', 'departamento', 'procedencia', true),
  ('iquitos', 'Iquitos', 'Loreto', 'ciudad', 'procedencia', true),
  ('madre-de-dios', 'Madre de Dios', 'Madre de Dios', 'departamento', 'procedencia', true),
  ('moquegua', 'Moquegua', 'Moquegua', 'departamento', 'procedencia', true),
  ('pasco', 'Pasco', 'Pasco', 'departamento', 'procedencia', true),
  ('cerro-de-pasco', 'Cerro de Pasco', 'Pasco', 'ciudad', 'procedencia', true),
  ('piura', 'Piura', 'Piura', 'departamento', 'procedencia', true),
  ('mancora', 'Máncora', 'Piura', 'ciudad', 'procedencia', true),
  ('vichayito', 'Vichayito', 'Piura', 'playa', 'procedencia', true),
  ('punta-sal', 'Punta Sal', 'Tumbes', 'playa', 'procedencia', true),
  ('zorritos', 'Zorritos', 'Tumbes', 'playa', 'procedencia', true),
  ('puno', 'Puno', 'Puno', 'departamento', 'procedencia', true),
  ('juliaca', 'Juliaca', 'Puno', 'ciudad', 'procedencia', true),
  ('san-martin', 'San Martín', 'San Martín', 'departamento', 'procedencia', true),
  ('tarapoto', 'Tarapoto', 'San Martín', 'ciudad', 'procedencia', true),
  ('tacna', 'Tacna', 'Tacna', 'departamento', 'procedencia', true),
  ('tumbes', 'Tumbes', 'Tumbes', 'departamento', 'procedencia', true),
  ('ucayali', 'Ucayali', 'Ucayali', 'departamento', 'procedencia', true)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  departamento = EXCLUDED.departamento,
  tipo = EXCLUDED.tipo,
  uso = EXCLUDED.uso,
  activo = EXCLUDED.activo;
