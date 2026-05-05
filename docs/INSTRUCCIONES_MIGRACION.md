# 🔄 Instrucciones para Aplicar la Migración

## ⚠️ Importante

Esta migración agrega nuevos campos a las tablas existentes. **Es segura** porque:
- ✅ Solo agrega columnas (no elimina)
- ✅ Todos los campos nuevos son opcionales
- ✅ Tiene valores por defecto
- ✅ No afecta datos existentes

---

## 📋 Pasos para Aplicar

### Opción 1: Supabase Dashboard (Recomendado)

1. **Abre Supabase Dashboard**
   - Ve a https://app.supabase.com
   - Selecciona tu proyecto

2. **Abre SQL Editor**
   - En el menú lateral, haz clic en "SQL Editor"
   - O ve a: https://app.supabase.com/project/[PROJECT_ID]/sql

3. **Crea una nueva query**
   - Haz clic en "New Query"
   - O presiona `Ctrl+K` y busca "New Query"

4. **Copia el SQL**
   - Abre el archivo: `docs/migraciones/001_agregar_campos_faltantes.sql`
   - Copia TODO el contenido

5. **Pega en el editor**
   - Pega el SQL en el editor de Supabase

6. **Ejecuta**
   - Haz clic en el botón "Run" (▶️)
   - O presiona `Ctrl+Enter`

7. **Verifica**
   - Deberías ver: "Query executed successfully"
   - Revisa la pestaña "Results"

---

### Opción 2: Línea de Comandos (CLI)

Si tienes Supabase CLI instalado:

```bash
# 1. Asegúrate de estar en la carpeta del proyecto
cd /ruta/a/adventur-hoteles

# 2. Ejecuta la migración
supabase db push

# 3. Verifica que se aplicó correctamente
supabase db pull
```

---

### Opción 3: Desde tu Aplicación (No Recomendado)

Si necesitas ejecutar desde la app:

```typescript
import { createClient } from '@/lib/supabase/server';

async function aplicarMigracion() {
  const supabase = await createClient();
  
  const sql = `
    ALTER TABLE public.usuarios
    ADD COLUMN IF NOT EXISTS foto_url TEXT;
    
    -- ... resto del SQL
  `;
  
  const { error } = await supabase.rpc('exec', { sql });
  if (error) console.error(error);
}
```

---

## ✅ Verificación Post-Migración

### 1. Verifica que los campos existen

En Supabase Dashboard:

1. Ve a **Table Editor**
2. Selecciona cada tabla:
   - `usuarios` → Debe tener `foto_url`
   - `hoteles` → Debe tener `email_contacto`, `latitud`, `longitud`, `horario_apertura`, `horario_cierre`
   - `habitaciones` → Debe tener `numero_habitacion`, `tipo_habitacion`, `cantidad_camas`, `amenidades`, `estado_mantenimiento`
   - `reservas` → Debe tener `notas_cliente`, `cantidad_huespedes`, `precio_total`, `fecha_confirmacion`, `metodo_pago`

### 2. Verifica que los índices existen

En Supabase Dashboard:

1. Ve a **SQL Editor**
2. Ejecuta:
```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';
```

Deberías ver:
- `idx_usuarios_rol`
- `idx_hoteles_activo`
- `idx_habitaciones_disponible`
- `idx_habitaciones_tipo`
- `idx_reservas_estado`
- `idx_reservas_fecha_ingreso`

### 3. Verifica que la aplicación compila

```bash
npm run build
```

Deberías ver: ✅ **Compiled successfully**

---

## 🔍 Solución de Problemas

### Error: "Column already exists"

**Causa:** La migración ya fue aplicada

**Solución:** Es seguro ejecutarla de nuevo (tiene `IF NOT EXISTS`)

### Error: "Permission denied"

**Causa:** Tu usuario no tiene permisos

**Solución:** 
- Usa una cuenta con rol `postgres` o `admin`
- O contacta al administrador de la BD

### Error: "Syntax error"

**Causa:** El SQL tiene un error

**Solución:**
- Verifica que copiaste TODO el archivo
- Revisa que no haya caracteres especiales
- Intenta ejecutar línea por línea

### La aplicación no ve los nuevos campos

**Causa:** Caché de TypeScript

**Solución:**
```bash
# Limpia caché
rm -rf .next node_modules/.cache

# Reconstruye
npm run build
```

---

## 📊 Cambios en la BD

### Antes de la migración
```
usuarios: id, nombre_completo, correo, telefono, rol, fecha_creacion
hoteles: id, nombre, descripcion, ciudad, direccion, telefono_whatsapp, imagenes_urls, estrellas, activo, fecha_creacion
habitaciones: id, hotel_id, nombre, descripcion, capacidad_personas, precio_noche, imagenes_urls, esta_disponible, fecha_creacion
reservas: id, usuario_id, habitacion_id, nombre_cliente, telefono_contacto, fecha_ingreso, fecha_salida, estado, fecha_creacion
```

### Después de la migración
```
usuarios: id, nombre_completo, correo, telefono, rol, fecha_creacion, [foto_url]
hoteles: id, nombre, descripcion, ciudad, direccion, telefono_whatsapp, imagenes_urls, estrellas, activo, fecha_creacion, [email_contacto, latitud, longitud, horario_apertura, horario_cierre]
habitaciones: id, hotel_id, nombre, descripcion, capacidad_personas, precio_noche, imagenes_urls, esta_disponible, fecha_creacion, [numero_habitacion, tipo_habitacion, cantidad_camas, amenidades, estado_mantenimiento]
reservas: id, usuario_id, habitacion_id, nombre_cliente, telefono_contacto, fecha_ingreso, fecha_salida, estado, fecha_creacion, [notas_cliente, cantidad_huespedes, precio_total, fecha_confirmacion, metodo_pago]
```

---

## 🔐 Seguridad

- ✅ La migración no elimina datos
- ✅ Los campos nuevos son opcionales
- ✅ Los valores por defecto son seguros
- ✅ Los índices mejoran performance sin riesgos
- ✅ Las políticas RLS se mantienen igual

---

## 📝 Rollback (Si es necesario)

Si necesitas revertir la migración:

```sql
-- Elimina los campos agregados
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS foto_url;
ALTER TABLE public.hoteles DROP COLUMN IF EXISTS email_contacto, latitud, longitud, horario_apertura, horario_cierre;
ALTER TABLE public.habitaciones DROP COLUMN IF EXISTS numero_habitacion, tipo_habitacion, cantidad_camas, amenidades, estado_mantenimiento;
ALTER TABLE public.reservas DROP COLUMN IF EXISTS notas_cliente, cantidad_huespedes, precio_total, fecha_confirmacion, metodo_pago;

-- Elimina los índices
DROP INDEX IF EXISTS idx_usuarios_rol;
DROP INDEX IF EXISTS idx_hoteles_activo;
DROP INDEX IF EXISTS idx_habitaciones_disponible;
DROP INDEX IF EXISTS idx_habitaciones_tipo;
DROP INDEX IF EXISTS idx_reservas_estado;
DROP INDEX IF EXISTS idx_reservas_fecha_ingreso;
```

---

## ✨ Próximos Pasos

Después de aplicar la migración:

1. ✅ Verifica que todo funciona
2. ✅ Actualiza el UI del admin (Fase 2)
3. ✅ Agrega validaciones (Fase 3)
4. ✅ Implementa búsqueda avanzada (Fase 4)
5. ✅ Crea reportes (Fase 5)

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la sección "Solución de Problemas"
2. Verifica los logs de Supabase
3. Consulta la documentación: `docs/MEJORAS_IMPLEMENTADAS.md`
