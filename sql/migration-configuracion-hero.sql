-- Migration: add hero section fields to configuracion table
-- Run in Supabase SQL Editor

ALTER TABLE public.configuracion
  ADD COLUMN IF NOT EXISTS hero_avatar_1     TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_avatar_2     TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_avatar_3     TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_clientes_count INTEGER NOT NULL DEFAULT 1050,
  ADD COLUMN IF NOT EXISTS hero_rating       NUMERIC(3,1) NOT NULL DEFAULT 4.9;
