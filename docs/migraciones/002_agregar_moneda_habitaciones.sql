-- Agregar campo moneda a habitaciones
ALTER TABLE public.habitaciones
ADD COLUMN IF NOT EXISTS moneda TEXT DEFAULT 'USD' CHECK (moneda IN ('USD', 'PEN'));
