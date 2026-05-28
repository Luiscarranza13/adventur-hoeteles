'use client';

import { useEffect, useState } from 'react';
import {
  CONFIGURACION_DEFAULT,
  normalizarConfiguracion,
  type ConfiguracionWeb,
} from '@/lib/configuracion';

const CACHE_TTL_MS = 30_000;

let cache: { data: ConfiguracionWeb; expiresAt: number } | null = null;
let pendingFetch: Promise<ConfiguracionWeb> | null = null;

async function cargarConfiguracion(forzar = false): Promise<ConfiguracionWeb> {
  const ahora = Date.now();
  if (!forzar && cache && ahora < cache.expiresAt) return cache.data;
  if (pendingFetch) return pendingFetch;

  pendingFetch = fetch('/api/configuracion', { cache: 'no-store' })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      const config = normalizarConfiguracion(data);
      cache = { data: config, expiresAt: Date.now() + CACHE_TTL_MS };
      return config;
    })
    .catch(() => {
      if (!cache) cache = { data: CONFIGURACION_DEFAULT, expiresAt: Date.now() + CACHE_TTL_MS };
      return cache.data;
    })
    .finally(() => { pendingFetch = null; });

  return pendingFetch;
}

export function useConfiguracionWeb() {
  const [config, setConfig] = useState<ConfiguracionWeb>(cache?.data ?? CONFIGURACION_DEFAULT);

  useEffect(() => {
    let activo = true;

    const refrescar = async (forzar = false) => {
      const data = await cargarConfiguracion(forzar);
      if (activo) {
        // Only trigger a re-render if the data reference actually changed
        setConfig(prev => (prev === data ? prev : data));
      }
    };

    refrescar();

    const timer = setInterval(() => refrescar(true), CACHE_TTL_MS);

    return () => {
      activo = false;
      clearInterval(timer);
    };
  }, []);

  return config;
}
