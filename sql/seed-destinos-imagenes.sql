-- ================================================================
-- MIGRACIÓN: Imágenes para destinos del Perú
-- Ejecutar en: Supabase > SQL Editor
-- ================================================================

-- Paso 1: Añadir columna de imagen (si no existe)
ALTER TABLE public.destinos
  ADD COLUMN IF NOT EXISTS imagen_url TEXT;

-- ================================================================
-- Paso 2: Insertar / actualizar todos los destinos con imágenes
-- Usa ON CONFLICT para actualizar si el slug ya existe en la tabla
-- Imágenes: Unsplash CDN — libres de derechos (free tier)
-- ================================================================

INSERT INTO public.destinos (slug, nombre, departamento, tipo, activo, imagen_url) VALUES

-- ── CAJAMARCA ──────────────────────────────────────────────────────
('cajamarca',             'Cajamarca',    'Cajamarca', 'departamento', true,
  'https://images.unsplash.com/photo-1582459971877-3bb0fcec7284?auto=format&fit=crop&w=800&q=80'),

('chota',                 'Chota',        'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('cutervo',               'Cutervo',      'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('cajabamba',             'Cajabamba',    'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('celendin',              'Celendín',     'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('san-miguel-cajamarca',  'San Miguel',   'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('santa-cruz-cajamarca',  'Santa Cruz',   'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('bambamarca',            'Bambamarca',   'Cajamarca', 'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

-- ── AMAZONAS ───────────────────────────────────────────────────────
('amazonas',              'Amazonas',     'Amazonas',  'departamento', true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

('chachapoyas',           'Chachapoyas',  'Amazonas',  'ciudad',       true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

('gocta',                 'Gocta',        'Amazonas',  'atractivo',    true,
  'https://images.unsplash.com/photo-1599576894842-0ab1df36b9ae?auto=format&fit=crop&w=800&q=80'),

-- ── ÁNCASH ─────────────────────────────────────────────────────────
('ancash',                'Áncash',       'Áncash',    'departamento', true,
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80'),

('huaraz',                'Huaraz',       'Áncash',    'ciudad',       true,
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80'),

('chimbote',              'Chimbote',     'Áncash',    'ciudad',       true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

-- ── APURÍMAC ───────────────────────────────────────────────────────
('apurimac',              'Apurímac',     'Apurímac',  'departamento', true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('abancay',               'Abancay',      'Apurímac',  'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

-- ── AREQUIPA ───────────────────────────────────────────────────────
('arequipa',              'Arequipa',     'Arequipa',  'departamento', true,
  'https://images.unsplash.com/photo-1587468424735-5ccae29c2c86?auto=format&fit=crop&w=800&q=80'),

('colca',                 'Colca',        'Arequipa',  'atractivo',    true,
  'https://images.unsplash.com/photo-1587468424735-5ccae29c2c86?auto=format&fit=crop&w=800&q=80'),

-- ── AYACUCHO ───────────────────────────────────────────────────────
('ayacucho',              'Ayacucho',     'Ayacucho',  'departamento', true,
  'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80'),

-- ── CUSCO ──────────────────────────────────────────────────────────
('cusco',                 'Cusco',        'Cusco',     'departamento', true,
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80'),

('machupicchu',           'Machupicchu',  'Cusco',     'atractivo',    true,
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80'),

('valle-sagrado',         'Valle Sagrado','Cusco',     'zona',         true,
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80'),

-- ── HUANCAVELICA ───────────────────────────────────────────────────
('huancavelica',          'Huancavelica', 'Huancavelica','departamento',true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

-- ── HUÁNUCO ────────────────────────────────────────────────────────
('huanuco',               'Huánuco',      'Huánuco',   'departamento', true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

('tingo-maria',           'Tingo María',  'Huánuco',   'ciudad',       true,
  'https://images.unsplash.com/photo-1599576894842-0ab1df36b9ae?auto=format&fit=crop&w=800&q=80'),

-- ── ICA ────────────────────────────────────────────────────────────
('ica',                   'Ica',          'Ica',       'departamento', true,
  'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=800&q=80'),

('paracas',               'Paracas',      'Ica',       'ciudad',       true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

-- ── JUNÍN ──────────────────────────────────────────────────────────
('junin',                 'Junín',        'Junín',     'departamento', true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('huancayo',              'Huancayo',     'Junín',     'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('la-merced',             'La Merced',    'Junín',     'ciudad',       true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

('oxapampa',              'Oxapampa',     'Pasco',     'ciudad',       true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

('pozuzo',                'Pozuzo',       'Pasco',     'ciudad',       true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

-- ── LA LIBERTAD ────────────────────────────────────────────────────
('la-libertad',           'La Libertad',  'La Libertad','departamento',true,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'),

('trujillo',              'Trujillo',     'La Libertad','ciudad',      true,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'),

('pacasmayo',             'Pacasmayo',    'La Libertad','ciudad',      true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

-- ── LAMBAYEQUE ─────────────────────────────────────────────────────
('lambayeque',            'Lambayeque',   'Lambayeque','departamento', true,
  'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80'),

('chiclayo',              'Chiclayo',     'Lambayeque','ciudad',       true,
  'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80'),

-- ── LIMA ───────────────────────────────────────────────────────────
('lima',                  'Lima',         'Lima',      'departamento', true,
  'https://images.unsplash.com/photo-1580793657427-9d85b9c76a25?auto=format&fit=crop&w=800&q=80'),

('miraflores',            'Miraflores',   'Lima',      'distrito',     true,
  'https://images.unsplash.com/photo-1580793657427-9d85b9c76a25?auto=format&fit=crop&w=800&q=80'),

('barranco',              'Barranco',     'Lima',      'distrito',     true,
  'https://images.unsplash.com/photo-1580793657427-9d85b9c76a25?auto=format&fit=crop&w=800&q=80'),

('la-victoria',           'La Victoria',  'Lima',      'distrito',     true,
  'https://images.unsplash.com/photo-1580793657427-9d85b9c76a25?auto=format&fit=crop&w=800&q=80'),

('lince',                 'Lince',        'Lima',      'distrito',     true,
  'https://images.unsplash.com/photo-1580793657427-9d85b9c76a25?auto=format&fit=crop&w=800&q=80'),

-- ── LORETO ─────────────────────────────────────────────────────────
('loreto',                'Loreto',       'Loreto',    'departamento', true,
  'https://images.unsplash.com/photo-1541188495357-ad2dc89487f4?auto=format&fit=crop&w=800&q=80'),

('iquitos',               'Iquitos',      'Loreto',    'ciudad',       true,
  'https://images.unsplash.com/photo-1541188495357-ad2dc89487f4?auto=format&fit=crop&w=800&q=80'),

-- ── MADRE DE DIOS ──────────────────────────────────────────────────
('madre-de-dios',         'Madre de Dios','Madre de Dios','departamento',true,
  'https://images.unsplash.com/photo-1586417890558-8b5a1e3e5ab4?auto=format&fit=crop&w=800&q=80'),

-- ── MOQUEGUA ───────────────────────────────────────────────────────
('moquegua',              'Moquegua',     'Moquegua',  'departamento', true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

-- ── PASCO ──────────────────────────────────────────────────────────
('pasco',                 'Pasco',        'Pasco',     'departamento', true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

('cerro-de-pasco',        'Cerro de Pasco','Pasco',    'ciudad',       true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

-- ── PIURA ──────────────────────────────────────────────────────────
('piura',                 'Piura',        'Piura',     'departamento', true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

('mancora',               'Máncora',      'Piura',     'ciudad',       true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

('vichayito',             'Vichayito',    'Piura',     'playa',        true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

-- ── PUNO ───────────────────────────────────────────────────────────
('puno',                  'Puno',         'Puno',      'departamento', true,
  'https://images.unsplash.com/photo-1531565637446-32307b194362?auto=format&fit=crop&w=800&q=80'),

('juliaca',               'Juliaca',      'Puno',      'ciudad',       true,
  'https://images.unsplash.com/photo-1531565637446-32307b194362?auto=format&fit=crop&w=800&q=80'),

-- ── SAN MARTÍN ─────────────────────────────────────────────────────
('san-martin',            'San Martín',   'San Martín','departamento', true,
  'https://images.unsplash.com/photo-1599576894842-0ab1df36b9ae?auto=format&fit=crop&w=800&q=80'),

('tarapoto',              'Tarapoto',     'San Martín','ciudad',       true,
  'https://images.unsplash.com/photo-1599576894842-0ab1df36b9ae?auto=format&fit=crop&w=800&q=80'),

-- ── TACNA ──────────────────────────────────────────────────────────
('tacna',                 'Tacna',        'Tacna',     'departamento', true,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),

-- ── TUMBES ─────────────────────────────────────────────────────────
('tumbes',                'Tumbes',       'Tumbes',    'departamento', true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

('punta-sal',             'Punta Sal',    'Tumbes',    'playa',        true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

('zorritos',              'Zorritos',     'Tumbes',    'playa',        true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),

-- ── UCAYALI ────────────────────────────────────────────────────────
('ucayali',               'Ucayali',      'Ucayali',   'departamento', true,
  'https://images.unsplash.com/photo-1541188495357-ad2dc89487f4?auto=format&fit=crop&w=800&q=80')

ON CONFLICT (slug) DO UPDATE SET
  nombre       = EXCLUDED.nombre,
  departamento = EXCLUDED.departamento,
  tipo         = EXCLUDED.tipo,
  activo       = EXCLUDED.activo,
  imagen_url   = EXCLUDED.imagen_url;

-- ================================================================
-- Verificar resultado
-- ================================================================
SELECT slug, nombre, tipo,
       CASE WHEN imagen_url IS NOT NULL THEN '✓' ELSE '✗' END AS tiene_imagen
FROM public.destinos
ORDER BY departamento, nombre;
