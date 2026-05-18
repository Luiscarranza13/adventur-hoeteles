# Adventur Hoteles - Supabase Produccion

Este documento resume los contratos que el frontend espera de Supabase antes de desplegar.

## Variables

- `NEXT_PUBLIC_SUPABASE_URL`: URL publica del proyecto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: key publica anon.
- `SUPABASE_SERVICE_ROLE_KEY`: solo servidor; requerida para crear y eliminar usuarios de Auth desde el panel.

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` con prefijo `NEXT_PUBLIC_`.

## Roles

La tabla `usuarios.rol` debe aceptar:

- `admin`: acceso completo. Gestiona usuarios, configuracion, hoteles, habitaciones y reservas.
- `colaborador`: gestiona contenido operativo y reservas. No gestiona usuarios ni configuracion critica.
- `viewer`: solo lectura del dashboard.

## Buckets esperados

- `imagenes`: bucket publico para hoteles, habitaciones y avatares.
- `hoteles`: bucket publico legacy/fallback para imagenes de hoteles.
- `avatares`: bucket publico legacy/fallback para fotos de usuario.

Si se usa `upsert`, las politicas de Storage deben permitir `INSERT`, `SELECT` y `UPDATE`. El proyecto actualmente sube con `upsert: false`, por lo que requiere `INSERT` y `SELECT` para lectura publica.

## RLS minimo esperado

Activa RLS en todas las tablas expuestas:

- `usuarios`
- `hoteles`
- `habitaciones`
- `reservas`
- `configuracion`

Politicas recomendadas:

- Lectura publica de `hoteles` activos y `habitaciones` disponibles.
- Escritura de `hoteles`, `habitaciones`, `reservas` administrativas y `configuracion` solo para usuarios cuyo perfil en `usuarios` tenga rol autorizado.
- Gestion de `usuarios` solo para `admin`.
- Insercion publica de reservas permitida solo con validaciones estrictas en API; no exponer escritura directa desde cliente.

## Migraciones

Ejecutar en orden:

1. `docs/migraciones/001_agregar_campos_faltantes.sql`
2. `docs/migraciones/002_agregar_moneda_habitaciones.sql`
3. `docs/migraciones/003_tabla_configuracion.sql`
4. `docs/migraciones/004_politicas_configuracion.sql`
5. `docs/migraciones/005_destinos_procedencia.sql`
6. `docs/migraciones/006_hoteles_reales_peru.sql`
7. `docs/migraciones/007_correccion_monedas.sql`
8. `docs/migraciones/008_roles_permisos_storage.sql`

## Tipos TypeScript de Supabase

La CLI de Supabase no esta instalada en este entorno local. Cuando tengas la CLI autenticada, genera los tipos reales con:

```bash
npm run db:types
```

Ese comando crea/actualiza `src/lib/database.types.ts` desde el proyecto Supabase `zbfrqolopbktzxfchqjy`.
