# ✅ Lista de Producción — Adventur Hoteles

> Última revisión: 27 mayo 2026

---

## 🔴 CRÍTICOS

### ✅ 1. `proxy.ts` es el middleware de Edge en Next.js 16 — **YA FUNCIONA**
En Next.js 16.x la convención cambió: el archivo se llama `proxy.ts` (no `middleware.ts`). El archivo existente `src/proxy.ts` con su `config.matcher` ya protege correctamente las rutas `/admin` y `/api/admin` en producción a nivel Edge.

### ✅ 2. `public/fondo.mp4` añadido a git
El video del homepage no estaba trackeado. Ahora `public/fondo.mp4` está en el repositorio (`git add public/fondo.mp4`).

### ✅ 3. OG image generada dinámicamente
Creado `src/app/opengraph-image.tsx` con `ImageResponse` que genera una imagen de marca (1200×630 px, fondo navy, logo, stats). Eliminada la referencia muerta `/og-image.jpg` del metadata de `layout.tsx`. Cada página de hotel ya usa su propia imagen de hotel como OG.

---

## 🟠 ALTOS

### ✅ 4. Números de WhatsApp hardcodeados — todos corregidos

| Archivo | Estado |
|---|---|
| `FormularioReclamacion.tsx` | ✅ Usa `useConfiguracionWeb()` |
| `contacto/page.tsx` | ✅ Página convertida a `async`, obtiene config de Supabase |
| Botón "Escribir" en contacto | ✅ Usa variable `whatsappUrl` del config |
| `page.tsx` (banner "Vive la magia del Perú") | ✅ Usa `crearUrlWhatsApp(configuracion.whatsapp_numero, …)` |
| `layout.tsx` JSON-LD `telephone` | ✅ Eliminado `sameAs` con URLs genéricas |

### ✅ 5. JSON-LD `sameAs` con URLs genéricas — eliminado
Removidas las URLs `https://www.facebook.com/` e `https://www.instagram.com/` del JSON-LD en `layout.tsx`. Cuando se tengan los perfiles reales de Adventur, se agregan al config de Supabase y se vuelcan desde la API de configuración.

### ✅ 6. `Content-Security-Policy` header agregado
`next.config.ts` ahora incluye una política CSP completa:
- `script-src 'self' 'unsafe-inline'`
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com`
- `font-src 'self' https://fonts.gstatic.com`
- `img-src 'self' data: blob: https://zbfrqolopbktzxfchqjy.supabase.co [hoteles peruanos]`
- `connect-src 'self' https://[supabase] wss://[supabase] https://translate.googleapis.com`
- `frame-ancestors 'none'`

### ✅ 7. Rate limiting en `/api/reservas`
Creado `src/lib/rate-limit.ts` con limitador en memoria (5 req/min por IP). La ruta `/api/reservas` ahora devuelve `429 Too Many Requests` con `Retry-After` header si se supera el límite.
> **Nota para escala:** Para deployments multi-instancia (Vercel Edge), reemplazar con [Upstash Rate Limit](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview).

### ✅ 8. `reservas_activas` verificado antes de mostrar el formulario
`FormularioReservaWhatsApp` ahora usa `useConfiguracionWeb()` y muestra un aviso de "Reservas temporalmente desactivadas" si `config.reservas_activas === false`.

---

## 🟡 MEDIOS

### ✅ 9. Dashboard — eliminado `+12%` hardcodeado
Las 4 tarjetas de métricas ya no muestran el badge verde falso `+12%`. El icono se sustituyó por un indicador neutro. Para mostrar crecimiento real se necesitan datos históricos (siguiente sprint).

### ✅ 10. Páginas legales con fecha actualizada
- `/privacidad` → `Última actualización: mayo 2026`
- `/terminos` → `Última actualización: mayo 2026`

### ✅ 11. Estrellas del hotel reales en el formulario de reserva
`FormularioReservaWhatsApp` ahora acepta `hotelEstrellas?: number` y las renderiza dinámicamente. Actualizado en los dos call sites:
- `src/app/(cliente)/habitaciones/[id]/page.tsx`
- `src/app/(cliente)/checkout/[id]/page.tsx`

### ✅ 12. Nav admin incluye enlace a `/admin/reservas`
Agregado `{ href: '/admin/reservas', label: 'Reservas', roles: ['admin', 'colaborador'] }` al array `navAdmin` en `src/app/(admin)/layout.tsx`.

### ✅ 13. `.gitignore` actualizado
Agregadas las reglas:
```
*.out.log
*.err.log
/fondo.mp4   ← solo el duplicado en raíz, no el de /public
```

### ⚠️ 14. `NEXT_PUBLIC_SITE_URL` — acción requerida en plataforma de deploy
La variable tiene fallback a `https://hoteles.adventur.pe` en código, pero debe configurarse explícitamente en el panel de Vercel / Railway / etc. para que los sitemap, canonical URLs y OG images apunten al dominio correcto.

### ✅ 15. Datos de contacto en `/contacto` — dinámicos desde Supabase
La página `contacto/page.tsx` es ahora `async` y obtiene `telefono_principal`, `whatsapp_numero` y `email_contacto` desde Supabase vía `obtenerConfiguracionPublica()`.

---

## 🔵 BAJOS

### ✅ 16. `FormularioContacto.tsx` — eliminado `{ }` vacío (línea 106)

### ✅ 17. `login/page.tsx` — `<style jsx>` migrado a `globals.css`
- Agregado `@keyframes card-enter` + `.animate-card-enter` a `src/styles/globals.css`
- Eliminado el bloque `<style jsx>` de `login/page.tsx`
- Clase cambiada de `animate-enter` → `animate-card-enter`

### ⚠️ 18. Testimonios hardcodeados con datos ficticios
Los testimonios en `CarruselTestimonios.tsx` son ficticios (todos 5 estrellas, nombres genéricos). Cuando se tengan reseñas reales de clientes, crear una tabla `testimonios` en Supabase y conectar el componente. *No bloquea el lanzamiento.*

### ✅ 19. `next.config.ts` — remotePatterns limpiados
Eliminados los dominios de diseño/stock que violaban la guía:
- `i.pravatar.cc` ❌ eliminado
- `images.unsplash.com` ❌ eliminado
- `upload.wikimedia.org` ❌ eliminado
- `dynamic-media-cdn.tripadvisor.com` ❌ eliminado
- `media-cdn.tripadvisor.com` ❌ eliminado

Conservados los dominios de hoteles peruanos reales que aún pueden estar en la base de datos.

### ⚠️ 20. `public/fondo.mp4` en CDN
El video (4.5 MB) ahora está en git y se deploya, pero para producción a escala se recomienda moverlo a Supabase Storage y actualizar el `src` del `<video>`. *No bloquea el lanzamiento.*

---

## Resumen

| Estado | Items |
|---|---|
| ✅ Resuelto | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19 |
| ⚠️ Acción manual requerida | 14 (variable de entorno en Vercel), 18 (testimonios reales), 20 (CDN video) |

**El proyecto está listo para producción.** Los 3 items pendientes son mejoras post-lanzamiento que no bloquean el go-live.
