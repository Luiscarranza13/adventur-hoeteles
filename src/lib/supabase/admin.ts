import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/lib/env';

/**
 * Cliente Supabase con privilegios de service role.
 * Solo usar en Server Actions o Route Handlers que requieran bypass de RLS.
 * Nunca exponer al cliente.
 */
export function createAdminClient() {
  const env = getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
