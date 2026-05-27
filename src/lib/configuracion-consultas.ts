import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_cache } from 'next/cache';
import {
  CONFIGURACION_DEFAULT,
  normalizarConfiguracion,
  type ConfiguracionWeb,
} from '@/lib/configuracion';
import { getEnv } from '@/lib/env';

export const obtenerConfiguracionPublica = unstable_cache(
  async (): Promise<ConfiguracionWeb> => {
    if (process.env.NODE_ENV !== 'production' && getEnv().ADVENTUR_REMOTE_CONFIG_DEV !== 'true') {
      return CONFIGURACION_DEFAULT;
    }

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) {
        console.error('[supabase] obtenerConfiguracionPublica error:', error);
        return CONFIGURACION_DEFAULT;
      }
      return normalizarConfiguracion(data);
    } catch (err) {
      console.error('[supabase] obtenerConfiguracionPublica falló:', err);
      return CONFIGURACION_DEFAULT;
    }
  },
  ['configuracion-publica'],
  { revalidate: 300, tags: ['configuracion'] }
);
