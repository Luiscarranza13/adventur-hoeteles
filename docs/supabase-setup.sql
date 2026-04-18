-- =========================================================
-- 0. LIMPIEZA PREVIA
-- =========================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.es_admin();
DROP FUNCTION IF EXISTS public.es_admin(uuid);

DROP POLICY IF EXISTS "usuarios_select_own_or_admin" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_own_or_admin" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_own_or_admin" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_delete_admin" ON public.usuarios;

DROP POLICY IF EXISTS "hoteles_select_public" ON public.hoteles;
DROP POLICY IF EXISTS "hoteles_insert_admin" ON public.hoteles;
DROP POLICY IF EXISTS "hoteles_update_admin" ON public.hoteles;
DROP POLICY IF EXISTS "hoteles_delete_admin" ON public.hoteles;

DROP POLICY IF EXISTS "habitaciones_select_public" ON public.habitaciones;
DROP POLICY IF EXISTS "habitaciones_insert_admin" ON public.habitaciones;
DROP POLICY IF EXISTS "habitaciones_update_admin" ON public.habitaciones;
DROP POLICY IF EXISTS "habitaciones_delete_admin" ON public.habitaciones;

DROP POLICY IF EXISTS "reservas_select_owner_or_admin" ON public.reservas;
DROP POLICY IF EXISTS "reservas_insert_public" ON public.reservas;
DROP POLICY IF EXISTS "reservas_update_owner_or_admin" ON public.reservas;
DROP POLICY IF EXISTS "reservas_delete_admin" ON public.reservas;

-- =========================================================
-- 1. ELIMINAR COLUMNA contrasena DE public.usuarios
-- =========================================================

ALTER TABLE public.usuarios
DROP COLUMN IF EXISTS contrasena;

-- =========================================================
-- 2. FUNCIÓN AUXILIAR PARA SABER SI EL USUARIO ACTUAL ES ADMIN
-- =========================================================

CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuarios
    WHERE id = auth.uid()
      AND rol = 'admin'
  );
$$;

-- =========================================================
-- 3. FUNCIÓN AUXILIAR PARA SABER SI UN UID ES ADMIN
-- =========================================================

CREATE OR REPLACE FUNCTION public.es_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuarios
    WHERE id = uid
      AND rol = 'admin'
  );
$$;

-- =========================================================
-- 4. TRIGGER PARA CREAR PERFIL EN public.usuarios
--    CUANDO SE CREA UN USUARIO EN auth.users
-- =========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (
    id,
    nombre_completo,
    correo,
    telefono,
    rol
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario'),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'telefono',
    COALESCE(NEW.raw_user_meta_data->>'rol', 'cliente')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- 5. ACTIVAR RLS
-- =========================================================

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hoteles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 6. POLÍTICAS PARA public.usuarios
-- =========================================================

-- Ver perfil propio o todos si es admin
CREATE POLICY "usuarios_select_own_or_admin"
ON public.usuarios
FOR SELECT
USING (
  auth.uid() = id
  OR public.es_admin()
);

-- Insertar su propio perfil o permitir a admin
CREATE POLICY "usuarios_insert_own_or_admin"
ON public.usuarios
FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR public.es_admin()
);

-- Actualizar su propio perfil o cualquier perfil si es admin
CREATE POLICY "usuarios_update_own_or_admin"
ON public.usuarios
FOR UPDATE
USING (
  auth.uid() = id
  OR public.es_admin()
)
WITH CHECK (
  auth.uid() = id
  OR public.es_admin()
);

-- Solo admin puede eliminar perfiles
CREATE POLICY "usuarios_delete_admin"
ON public.usuarios
FOR DELETE
USING (
  public.es_admin()
);

-- =========================================================
-- 7. POLÍTICAS PARA public.hoteles
-- =========================================================

-- Todos pueden ver hoteles
CREATE POLICY "hoteles_select_public"
ON public.hoteles
FOR SELECT
USING (true);

-- Solo admin puede insertar hoteles
CREATE POLICY "hoteles_insert_admin"
ON public.hoteles
FOR INSERT
WITH CHECK (
  public.es_admin()
);

-- Solo admin puede actualizar hoteles
CREATE POLICY "hoteles_update_admin"
ON public.hoteles
FOR UPDATE
USING (
  public.es_admin()
)
WITH CHECK (
  public.es_admin()
);

-- Solo admin puede eliminar hoteles
CREATE POLICY "hoteles_delete_admin"
ON public.hoteles
FOR DELETE
USING (
  public.es_admin()
);

-- =========================================================
-- 8. POLÍTICAS PARA public.habitaciones
-- =========================================================

-- Todos pueden ver habitaciones
CREATE POLICY "habitaciones_select_public"
ON public.habitaciones
FOR SELECT
USING (true);

-- Solo admin puede insertar habitaciones
CREATE POLICY "habitaciones_insert_admin"
ON public.habitaciones
FOR INSERT
WITH CHECK (
  public.es_admin()
);

-- Solo admin puede actualizar habitaciones
CREATE POLICY "habitaciones_update_admin"
ON public.habitaciones
FOR UPDATE
USING (
  public.es_admin()
)
WITH CHECK (
  public.es_admin()
);

-- Solo admin puede eliminar habitaciones
CREATE POLICY "habitaciones_delete_admin"
ON public.habitaciones
FOR DELETE
USING (
  public.es_admin()
);

-- =========================================================
-- 9. POLÍTICAS PARA public.reservas
-- =========================================================

-- El admin ve todas
-- El usuario autenticado ve las suyas
CREATE POLICY "reservas_select_owner_or_admin"
ON public.reservas
FOR SELECT
USING (
  public.es_admin()
  OR auth.uid() = usuario_id
);

-- Insert público:
-- - visitante no autenticado: usuario_id debe ser null
-- - usuario autenticado: usuario_id puede ser null o su propio uid
CREATE POLICY "reservas_insert_public"
ON public.reservas
FOR INSERT
WITH CHECK (
  (
    auth.uid() IS NULL
    AND usuario_id IS NULL
  )
  OR (
    auth.uid() IS NOT NULL
    AND (
      usuario_id IS NULL
      OR usuario_id = auth.uid()
    )
  )
);

-- Actualizar:
-- - admin puede actualizar cualquier reserva
-- - usuario autenticado solo puede actualizar sus reservas
CREATE POLICY "reservas_update_owner_or_admin"
ON public.reservas
FOR UPDATE
USING (
  public.es_admin()
  OR auth.uid() = usuario_id
)
WITH CHECK (
  public.es_admin()
  OR auth.uid() = usuario_id
);

-- Solo admin puede eliminar reservas
CREATE POLICY "reservas_delete_admin"
ON public.reservas
FOR DELETE
USING (
  public.es_admin()
);