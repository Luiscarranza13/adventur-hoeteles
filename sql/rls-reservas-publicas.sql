-- Habilita que usuarios anónimos (no autenticados) puedan crear reservas.
-- Ejecutar en Supabase → SQL Editor.

-- 1. Asegurarse de que RLS está activo en la tabla
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 2. Política: cualquier visitante puede insertar una reserva (formulario público)
DROP POLICY IF EXISTS "anon_puede_insertar_reservas" ON public.reservas;
CREATE POLICY "anon_puede_insertar_reservas"
  ON public.reservas
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 3. Política: solo usuarios autenticados (admin) pueden leer reservas
DROP POLICY IF EXISTS "autenticados_pueden_leer_reservas" ON public.reservas;
CREATE POLICY "autenticados_pueden_leer_reservas"
  ON public.reservas
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Política: solo usuarios autenticados pueden actualizar reservas
DROP POLICY IF EXISTS "autenticados_pueden_actualizar_reservas" ON public.reservas;
CREATE POLICY "autenticados_pueden_actualizar_reservas"
  ON public.reservas
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verificación
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'reservas'
ORDER BY policyname;
