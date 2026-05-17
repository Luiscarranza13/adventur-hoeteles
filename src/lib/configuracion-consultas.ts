import { createReadonlyClient } from '@/lib/supabase/readonly';
import { unstable_cache } from 'next/cache';
import {
  CONFIGURACION_DEFAULT,
  normalizarConfiguracion,
  type ConfiguracionWeb,
} from '@/lib/configuracion';

export const obtenerConfiguracionPublica = unstable_cache(
  async (): Promise<ConfiguracionWeb> => {
    if (process.env.NODE_ENV !== 'production' && process.env.ADVENTUR_REMOTE_CONFIG_DEV !== 'true') {
      return CONFIGURACION_DEFAULT;
    }

    try {
      const supabase = createReadonlyClient();
      const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) return CONFIGURACION_DEFAULT;
      return normalizarConfiguracion(data);
    } catch {
      return CONFIGURACION_DEFAULT;
    }
  },
  ['configuracion-publica'],
  { revalidate: 300, tags: ['configuracion'] }
);
