-- ==============================================================================
-- MIGRACIÓN: Agregar campos faltantes a tablas existentes
-- ==============================================================================

-- 1. AGREGAR CAMPOS A TABLA usuarios
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 2. AGREGAR CAMPOS A TABLA hoteles
ALTER TABLE public.hoteles
  ADD COLUMN IF NOT EXISTS email_contacto TEXT,
  ADD COLUMN IF NOT EXISTS latitud DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitud DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS horario_apertura TIME,
  ADD COLUMN IF NOT EXISTS horario_cierre TIME;

-- 3. AGREGAR CAMPOS A TABLA habitaciones
ALTER TABLE public.habitaciones
  ADD COLUMN IF NOT EXISTS numero_habitacion TEXT,
  ADD COLUMN IF NOT EXISTS tipo_habitacion TEXT DEFAULT 'estandar' CHECK (tipo_habitacion IN ('estandar', 'doble', 'suite', 'presidencial')),
  ADD COLUMN IF NOT EXISTS cantidad_camas INTEGER DEFAULT 1 CHECK (cantidad_camas > 0),
  ADD COLUMN IF NOT EXISTS amenidades TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS estado_mantenimiento TEXT DEFAULT 'disponible' CHECK (estado_mantenimiento IN ('disponible', 'mantenimiento', 'bloqueado'));

-- 4. AGREGAR CAMPOS A TABLA reservas
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS notas_cliente TEXT,
  ADD COLUMN IF NOT EXISTS cantidad_huespedes INTEGER,
  ADD COLUMN IF NOT EXISTS precio_total DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS fecha_confirmacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'pendiente'));

-- ==============================================================================
-- ÍNDICES PARA MEJORAR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios(rol);

CREATE INDEX IF NOT EXISTS idx_hoteles_activo ON public.hoteles(activo);

CREATE INDEX IF NOT EXISTS idx_habitaciones_disponible ON public.habitaciones(esta_disponible);

CREATE INDEX IF NOT EXISTS idx_habitaciones_tipo ON public.habitaciones(tipo_habitacion);

CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);

CREATE INDEX IF NOT EXISTS idx_reservas_fecha_ingreso ON public.reservas(fecha_ingreso);
