-- Agregar columna foto_url a la tabla usuarios
-- Ejecutar en Supabase SQL Editor

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS foto_url TEXT DEFAULT NULL;
