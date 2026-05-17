#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script de verificación del sistema Adventur Hoteles
 * Verifica: TypeScript, rutas, archivos críticos, dependencias y estructura
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERDE = '\x1b[32m';
const ROJO = '\x1b[31m';
const AMARILLO = '\x1b[33m';
const AZUL = '\x1b[34m';
const RESET = '\x1b[0m';
const NEGRITA = '\x1b[1m';

let pasados = 0;
let fallidos = 0;
let advertencias = 0;

function ok(msg) {
  console.log(`  ${VERDE}✓${RESET} ${msg}`);
  pasados++;
}

function fail(msg) {
  console.log(`  ${ROJO}✗${RESET} ${msg}`);
  fallidos++;
}

function warn(msg) {
  console.log(`  ${AMARILLO}⚠${RESET} ${msg}`);
  advertencias++;
}

function seccion(titulo) {
  console.log(`\n${AZUL}${NEGRITA}── ${titulo} ──${RESET}`);
}

function existe(ruta) {
  return fs.existsSync(path.join(process.cwd(), ruta));
}

// ─────────────────────────────────────────────
// 1. ARCHIVOS CRÍTICOS
// ─────────────────────────────────────────────
seccion('Archivos críticos');

const archivosRequeridos = [
  // Config
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  '.env',
  // App
  'src/app/layout.tsx',
  'src/app/login/page.tsx',
  // Admin
  'src/app/(admin)/layout.tsx',
  'src/app/(admin)/admin/dashboard/page.tsx',
  'src/app/(admin)/admin/hoteles/page.tsx',
  'src/app/(admin)/admin/habitaciones/page.tsx',
  'src/app/(admin)/admin/reservas/page.tsx',
  'src/app/(admin)/admin/usuarios/page.tsx',
  'src/app/(admin)/admin/configuracion/page.tsx',
  // Cliente
  'src/app/(cliente)/page.tsx',
  'src/app/(cliente)/hoteles/page.tsx',
  'src/app/(cliente)/hoteles/[id]/page.tsx',
  // API
  'src/app/api/admin/hoteles/route.ts',
  'src/app/api/admin/habitaciones/route.ts',
  'src/app/api/admin/reservas/route.ts',
  'src/app/api/admin/usuarios/route.ts',
  'src/app/api/admin/configuracion/route.ts',
  'src/app/api/admin/login/route.ts',
  'src/app/api/admin/logout/route.ts',
  'src/app/api/reservas/route.ts',
  // Componentes
  'src/components/Header.tsx',
  'src/components/Input.tsx',
  'src/components/GaleriaHotel.tsx',
  'src/components/FormularioReservaWhatsApp.tsx',
  'src/components/admin/SidebarAdmin.tsx',
  'src/components/admin/FormDrawer.tsx',
  'src/components/admin/SubidorImagenes.tsx',
  'src/components/admin/GraficasDashboard.tsx',
  // Módulos dominio
  'src/modules/hoteles/dominio/entidades/Hotel.ts',
  'src/modules/habitaciones/dominio/entidades/Habitacion.ts',
  'src/modules/reservas_whatsapp/dominio/entidades/Reserva.ts',
  'src/modules/usuarios/dominio/entidades/Usuario.ts',
  // Store y providers
  'src/store/adminStore.ts',
  'src/providers/QueryProvider.tsx',
  // Proxy (reemplaza middleware)
  'src/app/api/proxy.ts',
  // Assets
  'public/logoadventur2.png',
];

archivosRequeridos.forEach(ruta => {
  if (existe(ruta)) {
    ok(ruta);
  } else {
    fail(`FALTA: ${ruta}`);
  }
});

// ─────────────────────────────────────────────
// 2. DEPENDENCIAS
// ─────────────────────────────────────────────
seccion('Dependencias instaladas');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

const dependenciasRequeridas = [
  'next',
  'react',
  'react-dom',
  '@supabase/supabase-js',
  '@supabase/ssr',
  '@tanstack/react-table',
  '@tanstack/react-query',
  'zustand',
  'react-dropzone',
  'date-fns',
  'recharts',
  'react-day-picker',
  'embla-carousel-react',
  'react-hook-form',
  '@hookform/resolvers',
  'zod',
  'sweetalert2',
  'sonner',
  'lucide-react',
  'framer-motion',
  'clsx',
  'tailwindcss',
  'typescript',
];

dependenciasRequeridas.forEach(dep => {
  if (deps[dep]) {
    ok(`${dep} ${AMARILLO}(${deps[dep]})${RESET}`);
  } else {
    fail(`FALTA dependencia: ${dep}`);
  }
});

// node-fetch debe estar eliminado
if (deps['node-fetch']) {
  warn('node-fetch todavía está instalado (debería eliminarse)');
} else {
  ok('node-fetch eliminado correctamente');
}

// ─────────────────────────────────────────────
// 3. VARIABLES DE ENTORNO
// ─────────────────────────────────────────────
seccion('Variables de entorno');

const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';

const envRequeridas = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

envRequeridas.forEach(v => {
  if (envContent.includes(v + '=')) {
    ok(`${v} definida`);
  } else {
    fail(`${v} NO definida en .env`);
  }
});

if (envContent.includes('NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER=')) {
  ok('NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER definida');
} else {
  warn('NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER no definida (opcional)');
}

// ─────────────────────────────────────────────
// 4. MIGRACIONES SQL
// ─────────────────────────────────────────────
seccion('Migraciones SQL');

const migraciones = [
  'docs/migraciones/001_agregar_campos_faltantes.sql',
  'docs/migraciones/002_agregar_moneda_habitaciones.sql',
  'docs/migraciones/003_tabla_configuracion.sql',
];

migraciones.forEach(m => {
  if (existe(m)) {
    ok(m);
  } else {
    warn(`Migración no encontrada: ${m}`);
  }
});

// ─────────────────────────────────────────────
// 5. ESTRUCTURA DE MÓDULOS (Arquitectura Hexagonal)
// ─────────────────────────────────────────────
seccion('Arquitectura Hexagonal');

const modulos = ['hoteles', 'habitaciones', 'reservas_whatsapp', 'usuarios'];

modulos.forEach(mod => {
  const base = `src/modules/${mod}`;
  const capas = [
    `${base}/dominio/entidades`,
    `${base}/dominio/puertos`,
    `${base}/aplicacion`,
    `${base}/infraestructura/adaptadores`,
  ];
  const todasExisten = capas.every(c => existe(c));
  if (todasExisten) {
    ok(`Módulo ${mod}: dominio → aplicación → infraestructura ✓`);
  } else {
    const faltantes = capas.filter(c => !existe(c));
    warn(`Módulo ${mod}: faltan capas: ${faltantes.join(', ')}`);
  }
});

// ─────────────────────────────────────────────
// 6. COMPILACIÓN TYPESCRIPT
// ─────────────────────────────────────────────
seccion('Compilación TypeScript');

console.log(`  ${AZUL}→${RESET} Ejecutando next build...`);

try {
  const output = execSync('npm run build 2>&1', {
    encoding: 'utf8',
    timeout: 180000,
  });

  if (output.includes('Compiled successfully') || output.includes('Generating static pages')) {
    ok('TypeScript compilado sin errores');

    // Contar rutas generadas
    const rutas = (output.match(/[├└] [○λ]/g) || []).length;
    if (rutas > 0) ok(`${rutas} rutas generadas correctamente`);

    // Verificar que no hay warnings de middleware
    if (!output.includes('middleware')) {
      ok('Sin warnings de middleware deprecado');
    } else {
      warn('Warning de middleware detectado');
    }
  } else {
    fail('Build falló — revisa los errores arriba');
  }
} catch (err) {
  const output = err.stdout || err.message || '';

  // Extraer errores específicos
  const errores = output.split('\n').filter(l =>
    l.includes('Error:') || l.includes('error TS') || l.includes('✗')
  ).slice(0, 10);

  fail('Build falló con errores:');
  errores.forEach(e => console.log(`    ${ROJO}${e.trim()}${RESET}`));
}

// ─────────────────────────────────────────────
// RESUMEN FINAL
// ─────────────────────────────────────────────
console.log(`\n${NEGRITA}${'─'.repeat(50)}${RESET}`);
console.log(`${NEGRITA}RESUMEN DE VERIFICACIÓN${RESET}`);
console.log(`${'─'.repeat(50)}`);
console.log(`  ${VERDE}${NEGRITA}Pasados:     ${pasados}${RESET}`);
console.log(`  ${ROJO}${NEGRITA}Fallidos:    ${fallidos}${RESET}`);
console.log(`  ${AMARILLO}${NEGRITA}Advertencias: ${advertencias}${RESET}`);
console.log(`${'─'.repeat(50)}\n`);

if (fallidos === 0) {
  console.log(`${VERDE}${NEGRITA}✓ Sistema verificado correctamente${RESET}\n`);
  process.exit(0);
} else {
  console.log(`${ROJO}${NEGRITA}✗ Se encontraron ${fallidos} problema(s) — revisa los errores arriba${RESET}\n`);
  process.exit(1);
}
