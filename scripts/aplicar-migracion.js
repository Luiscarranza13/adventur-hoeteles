#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zbfrqolopbktzxfchqjy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY no está definida en las variables de entorno');
  console.error('\nPara aplicar la migración manualmente:');
  console.error('1. Ve a Supabase Dashboard: https://app.supabase.com');
  console.error('2. Selecciona tu proyecto');
  console.error('3. Ve a SQL Editor');
  console.error('4. Copia el contenido de: docs/migraciones/001_agregar_campos_faltantes.sql');
  console.error('5. Ejecuta la query\n');
  process.exit(1);
}

async function aplicarMigracion() {
  console.log('🔄 Aplicando migración en Supabase...\n');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Ejecutar cada ALTER TABLE por separado
    const queries = [
      'ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS foto_url TEXT;',
      'ALTER TABLE public.hoteles ADD COLUMN IF NOT EXISTS email_contacto TEXT, ADD COLUMN IF NOT EXISTS latitud DECIMAL(10, 8), ADD COLUMN IF NOT EXISTS longitud DECIMAL(11, 8), ADD COLUMN IF NOT EXISTS horario_apertura TIME, ADD COLUMN IF NOT EXISTS horario_cierre TIME;',
      'ALTER TABLE public.habitaciones ADD COLUMN IF NOT EXISTS numero_habitacion TEXT, ADD COLUMN IF NOT EXISTS tipo_habitacion TEXT DEFAULT \'estandar\' CHECK (tipo_habitacion IN (\'estandar\', \'doble\', \'suite\', \'presidencial\')), ADD COLUMN IF NOT EXISTS cantidad_camas INTEGER DEFAULT 1 CHECK (cantidad_camas > 0), ADD COLUMN IF NOT EXISTS amenidades TEXT[] DEFAULT \'{}\', ADD COLUMN IF NOT EXISTS estado_mantenimiento TEXT DEFAULT \'disponible\' CHECK (estado_mantenimiento IN (\'disponible\', \'mantenimiento\', \'bloqueado\'));',
      'ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS notas_cliente TEXT, ADD COLUMN IF NOT EXISTS cantidad_huespedes INTEGER, ADD COLUMN IF NOT EXISTS precio_total DECIMAL(10, 2), ADD COLUMN IF NOT EXISTS fecha_confirmacion TIMESTAMP WITH TIME ZONE, ADD COLUMN IF NOT EXISTS metodo_pago TEXT CHECK (metodo_pago IN (\'efectivo\', \'tarjeta\', \'transferencia\', \'pendiente\'));',
      'CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios(rol);',
      'CREATE INDEX IF NOT EXISTS idx_hoteles_activo ON public.hoteles(activo);',
      'CREATE INDEX IF NOT EXISTS idx_habitaciones_disponible ON public.habitaciones(esta_disponible);',
      'CREATE INDEX IF NOT EXISTS idx_habitaciones_tipo ON public.habitaciones(tipo_habitacion);',
      'CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);',
      'CREATE INDEX IF NOT EXISTS idx_reservas_fecha_ingreso ON public.reservas(fecha_ingreso);',
    ];

    for (const query of queries) {
      const { error } = await supabase.rpc('exec', { sql: query });
      if (error) {
        console.error('❌ Error:', error);
        process.exit(1);
      }
    }

    console.log('✅ Migración aplicada exitosamente!\n');
    console.log('📊 Cambios realizados:');
    console.log('  • Tabla usuarios: +1 campo (foto_url)');
    console.log('  • Tabla hoteles: +5 campos');
    console.log('  • Tabla habitaciones: +5 campos');
    console.log('  • Tabla reservas: +5 campos');
    console.log('  • Índices: +6 índices para performance\n');
    console.log('🎉 ¡Listo para usar!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

aplicarMigracion();
