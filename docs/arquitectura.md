# Arquitectura — Adventur Hoteles

Plataforma multihotel con flujo de reservas por WhatsApp. Sin pasarela de pagos. El objetivo es capturar leads (solicitudes) y redirigir al cliente directamente a WhatsApp del hotel.

**Stack:** Next.js 16 App Router · TypeScript · Supabase (Postgres + Auth) · Tailwind CSS 4

---

## Estructura de directorios

```
/
├── src/
│   ├── app/                          # Rutas Next.js (App Router)
│   │   ├── (admin)/                  # Route group admin (invisible en URL)
│   │   │   ├── layout.tsx            # Auth guard + navbar admin
│   │   │   ├── login/                # → /login
│   │   │   │   └── page.tsx
│   │   │   └── admin/                # → /admin/*
│   │   │       ├── dashboard/        # → /admin/dashboard
│   │   │       ├── hoteles/          # → /admin/hoteles
│   │   │       ├── habitaciones/     # → /admin/habitaciones
│   │   │       ├── reservas/         # → /admin/reservas
│   │   │       └── usuarios/         # → /admin/usuarios
│   │   │
│   │   ├── (cliente)/                # Route group público (invisible en URL)
│   │   │   ├── page.tsx              # → / (buscador de ciudades)
│   │   │   ├── hoteles/              # → /hoteles
│   │   │   │   ├── page.tsx          # Catálogo de hoteles
│   │   │   │   └── [id]/page.tsx     # Detalle hotel + habitaciones
│   │   │   └── checkout/
│   │   │       └── [id]/page.tsx     # → /checkout/[id] Formulario WhatsApp
│   │   │
│   │   ├── api/                      # Route Handlers (API REST)
│   │   │   ├── admin/
│   │   │   │   ├── hoteles/          # GET, POST, PUT, DELETE
│   │   │   │   ├── habitaciones/     # GET, POST, PUT, DELETE
│   │   │   │   ├── reservas/         # GET, PATCH
│   │   │   │   ├── usuarios/         # GET
│   │   │   │   ├── login/            # POST
│   │   │   │   └── logout/           # POST
│   │   │   └── reservas/             # POST (público — procesa solicitud WhatsApp)
│   │   │
│   │   ├── layout.tsx                # Root layout (importa globals.css)
│   │   └── favicon.ico
│   │
│   ├── components/                   # Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx                # Header + Footer públicos
│   │   ├── Input.tsx
│   │   ├── ImagenSegura.tsx          # Wrapper de next/image con fallback
│   │   └── FormularioReservaWhatsApp.tsx  # Formulario checkout → WhatsApp
│   │
│   ├── modules/                      # Lógica de negocio (Monolito Modular)
│   │   ├── hoteles/
│   │   │   ├── index.ts              # Barrel export del módulo
│   │   │   ├── dominio/
│   │   │   │   ├── entidades/Hotel.ts
│   │   │   │   └── puertos/RepositorioHotel.ts
│   │   │   ├── aplicacion/
│   │   │   │   └── ServicioHoteles.ts
│   │   │   └── infraestructura/
│   │   │       └── adaptadores/AdaptadorSupabaseHotel.ts
│   │   │
│   │   ├── habitaciones/
│   │   │   ├── index.ts
│   │   │   ├── dominio/
│   │   │   │   ├── entidades/Habitacion.ts
│   │   │   │   └── puertos/RepositorioHabitacion.ts
│   │   │   ├── aplicacion/
│   │   │   │   └── ServicioHabitaciones.ts
│   │   │   └── infraestructura/
│   │   │       └── adaptadores/AdaptadorSupabaseHabitacion.ts
│   │   │
│   │   ├── reservas_whatsapp/
│   │   │   ├── index.ts
│   │   │   ├── dominio/
│   │   │   │   ├── entidades/Reserva.ts
│   │   │   │   └── puertos/RepositorioReserva.ts
│   │   │   ├── aplicacion/
│   │   │   │   └── ServicioReservasWhatsApp.ts   # Flujo principal
│   │   │   └── infraestructura/
│   │   │       └── adaptadores/AdaptadorSupabaseReserva.ts
│   │   │
│   │   └── usuarios/
│   │       ├── index.ts
│   │       ├── dominio/
│   │       │   ├── entidades/Usuario.ts
│   │       │   └── puertos/RepositorioUsuario.ts
│   │       ├── aplicacion/
│   │       │   └── ServicioUsuarios.ts
│   │       └── infraestructura/
│   │           └── adaptadores/AdaptadorSupabaseUsuario.ts
│   │
│   ├── lib/
│   │   └── supabase/
│   │       ├── server.ts             # Cliente SSR (Server Components)
│   │       ├── client.ts             # Cliente browser
│   │       └── admin.ts             # Cliente service role (bypass RLS)
│   │
│   ├── styles/
│   │   └── globals.css              # Estilos globales + Tailwind
│   │
│   └── middleware.ts                # Protección de rutas /admin/* y /api/admin/*
│
├── docs/                            # Documentación del proyecto
│   ├── arquitectura.md              # Este archivo
│   ├── 01_Requerimientos.md
│   ├── 02_Esquema_Base_Datos.sql
│   └── supabase-setup.sql
│
└── .env                             # Variables de entorno (no commitear)
```

---

## Flujo de reserva por WhatsApp

```
Cliente                    Servidor                      Base de Datos
  │                           │                               │
  │  1. Selecciona habitación  │                               │
  │  2. Llena formulario       │                               │
  │──────── POST /api/reservas ──────────────────────────────>│
  │                           │  3. Inserta reserva           │
  │                           │     estado: contacto_whatsapp │
  │                           │<─────────────────────────────│
  │                           │  4. Consulta hotel (WhatsApp) │
  │                           │  5. Construye URL wa.me/...   │
  │<──────── { urlWhatsApp } ─│                               │
  │  6. window.open(url)       │                               │
  │──── WhatsApp del hotel ───>                               │
```

---

## Capas por módulo

Cada módulo sigue la misma estructura de 3 capas:

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| **Dominio** | `dominio/` | Entidades TypeScript puras + interfaces de repositorio. Sin dependencias externas. |
| **Aplicación** | `aplicacion/` | `Servicio*.ts` — orquesta casos de uso usando los puertos del dominio. |
| **Infraestructura** | `infraestructura/` | `Adaptador*.ts` — implementa los puertos conectando con Supabase. |

Los módulos se consumen desde fuera únicamente a través de su `index.ts` (barrel export):

```ts
// ✅ Correcto — usa el barrel
import { ServicioHoteles, AdaptadorSupabaseHotel } from '@/modules/hoteles';

// ❌ Incorrecto — acceso directo a infraestructura interna
import { AdaptadorSupabaseHotel } from '@/modules/hoteles/infraestructura/adaptadores/AdaptadorSupabaseHotel';
```

---

## Autenticación y protección de rutas

- **`src/middleware.ts`** — intercepta todas las peticiones a `/admin/*` y `/api/admin/*`. Si no hay sesión Supabase activa, redirige a `/login` (páginas) o devuelve `401` (API).
- **`(admin)/layout.tsx`** — segunda capa de protección para Server Components. Verifica sesión antes de renderizar el navbar admin.
- **`/login`** — excluida explícitamente de ambas protecciones para evitar loop de redirección.

---

## Base de datos (Supabase / Postgres)

```sql
-- Hoteles
CREATE TABLE hoteles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  ciudad TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono_whatsapp TEXT NOT NULL,
  imagenes_urls TEXT[] DEFAULT '{}',
  estrellas INT DEFAULT 3,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Habitaciones
CREATE TABLE habitaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hoteles(id) NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  capacidad_personas INT NOT NULL,
  precio_noche DECIMAL NOT NULL,
  imagenes_urls TEXT[] DEFAULT '{}',
  esta_disponible BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Reservas (leads WhatsApp)
CREATE TABLE reservas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habitacion_id UUID REFERENCES habitaciones(id) NOT NULL,
  nombre_cliente TEXT NOT NULL,
  telefono_contacto TEXT NOT NULL,
  fecha_ingreso DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  estado TEXT DEFAULT 'contacto_whatsapp'
    CHECK (estado IN ('contacto_whatsapp', 'confirmada', 'cancelada')),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios admin
CREATE TABLE usuarios (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT,
  rol TEXT DEFAULT 'recepcionista'
    CHECK (rol IN ('admin', 'recepcionista')),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Solo para operaciones admin con bypass RLS
```

---

## Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # ESLint
```
