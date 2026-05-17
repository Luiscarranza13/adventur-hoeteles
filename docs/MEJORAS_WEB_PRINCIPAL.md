# Mejoras aplicadas a la web principal

## Objetivo

Mejorar la experiencia de la página principal para que los destinos, el buscador y las tarjetas principales no lleven al usuario a flujos vacíos o confusos.

## Cambios aplicados

### 0. Limpieza de arquitectura y lógica duplicada

Se separó la lógica compartida en módulos reutilizables:

- `src/lib/hoteles-consultas.ts`: consultas server-side de hoteles, ciudades, tipos y precios mínimos.
- `src/lib/hoteles-opciones.ts`: opciones de filtros, categorías, tipos, iconos y construcción de URLs de `/hoteles`.
- `src/lib/configuracion-consultas.ts`: consulta server-side de configuración pública.
- `src/components/cliente/SeccionProcedencias.tsx`: render de la sección de lugares de procedencia.

Con esto, la home, el listado `/hoteles`, el hero y las APIs ya no mantienen copias separadas de la misma lógica.

### 1. Lugares de procedencia sin resultados vacíos

La sección de procedencias ahora distingue entre:

- Lugares que sí tienen hoteles cargados: abren `/hoteles?ciudad=...`.
- Lugares sin hoteles directos: abren WhatsApp con un mensaje de consulta que incluye la procedencia.

Esto evita que lugares como Gocta, Punta Sal o Chachapoyas manden directamente a una página de resultados vacíos cuando todavía no hay hoteles cargados con ese nombre exacto.

### 2. Sección de destinos más compacta

La home ya no muestra toda la lista larga de procedencias de golpe. Ahora muestra los destinos principales primero y deja el resto dentro de "Ver más procedencias".

Esto reduce ruido visual y permite que el usuario llegue más rápido a hoteles destacados y servicios.

### 3. Buscador del hero con ciudades reales de hoteles

El endpoint `/api/hoteles/ciudades` ahora devuelve ciudades tomadas desde hoteles activos, no desde la tabla general de procedencias.

Esto evita que el buscador principal ofrezca opciones que luego no tienen resultados.

### 4. Precio mínimo optimizado

La home dejó de hacer una consulta de habitaciones por cada hotel destacado. Ahora hace una sola consulta a `habitaciones` para calcular los precios mínimos de los hoteles destacados.

Esto reduce llamadas a Supabase y mejora el tiempo de carga de la página principal.

El listado `/hoteles` también usa el precio mínimo real para filtros y ordenamiento por precio. Ya no usa estrellas como aproximación de precio.

### 5. Hero más flexible en móviles

El hero cambió de `h-screen` a una altura mínima basada en `100svh`, evitando que el contenido quede demasiado apretado en móviles con barras del navegador o header sticky.

### 6. Mejora de carga de imagen principal

La imagen del banner turístico ahora usa `loading="eager"` porque Next la estaba detectando como LCP en desarrollo.

El fondo animado del hero también usa `next/image` en lugar de `<img>`, con prioridad para la primera imagen del carrusel.

### 7. Animaciones con GSAP

Se reemplazó Framer Motion y las animaciones CSS propias de entrada por GSAP:

- `src/components/ui/AnimarAlEntrar.tsx` usa GSAP + ScrollTrigger para revelar contenido al entrar en viewport.
- `src/components/cliente/HeroCliente.tsx` usa una timeline GSAP para entrada escalonada de textos, métricas y buscador.
- `src/components/cliente/HeroFondoAnimado.tsx` usa GSAP para crossfade/zoom suave del fondo sin re-renderizar cada cambio de imagen.
- Se respeta `prefers-reduced-motion` para usuarios que prefieren menos movimiento.

Se eliminaron `framer-motion` y las keyframes globales `fadeUp/fadeIn`.

## Archivos modificados

- `src/app/(cliente)/page.tsx`
- `src/app/(cliente)/hoteles/page.tsx`
- `src/app/(cliente)/hoteles/FiltrosSidebar.tsx`
- `src/app/api/hoteles/ciudades/route.ts`
- `src/app/api/hoteles/tipos/route.ts`
- `src/components/cliente/HeroCliente.tsx`
- `src/components/cliente/HeroFondoAnimado.tsx`
- `src/components/cliente/SeccionProcedencias.tsx`
- `src/components/ui/AnimarAlEntrar.tsx`
- `src/lib/configuracion-consultas.ts`
- `src/lib/hoteles-consultas.ts`
- `src/lib/hoteles-opciones.ts`
- `src/lib/destinos.ts`
- `src/styles/globals.css`
- `package.json`
- `package-lock.json`
- `docs/MEJORAS_WEB_PRINCIPAL.md`

## Verificación

Se ejecutó:

```bash
npm run build
```

Resultado: compilación correcta.
