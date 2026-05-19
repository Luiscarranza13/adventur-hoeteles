import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/env';
import { loadSystemCertificates } from '@/lib/node-ca';

const SUPABASE_TIMEOUT_MS = 8000;

function fetchConTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const timeoutSignal = AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;

  return fetch(input, { ...init, signal });
}

/**
 * Cliente Supabase de solo lectura sin cookies.
 * Usar dentro de unstable_cache y otras funciones cacheadas donde
 * cookies() de Next.js no está disponible.
 */
export function createReadonlyClient() {
  loadSystemCertificates();
  const env = getSupabaseEnv();
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: fetchConTimeout,
      },
    }
  );
}
