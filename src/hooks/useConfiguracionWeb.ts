'use client';

import { useEffect, useState } from 'react';
import {
  CONFIGURACION_DEFAULT,
  normalizarConfiguracion,
  type ConfiguracionWeb,
} from '@/lib/configuracion';

let configuracionCache: ConfiguracionWeb | null = null;
let configuracionPromise: Promise<ConfiguracionWeb> | null = null;

async function cargarConfiguracion() {
  if (configuracionCache) return configuracionCache;
  if (!configuracionPromise) {
    configuracionPromise = fetch('/api/configuracion')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        configuracionCache = normalizarConfiguracion(data);
        return configuracionCache;
      })
      .catch(() => CONFIGURACION_DEFAULT);
  }
  return configuracionPromise;
}

export function useConfiguracionWeb() {
  const [config, setConfig] = useState<ConfiguracionWeb>(configuracionCache ?? CONFIGURACION_DEFAULT);

  useEffect(() => {
    let activo = true;
    cargarConfiguracion().then(data => {
      if (activo) setConfig(data);
    });
    return () => {
      activo = false;
    };
  }, []);

  return config;
}
