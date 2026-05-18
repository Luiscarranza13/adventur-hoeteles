import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://hoteles.adventur.pe'),
  NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER: z.string().min(7).default('51999999999'),
});

const requiredSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  ADVENTUR_REMOTE_CONFIG_DEV: z.enum(['true', 'false']).default('false'),
});

function parseEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const detalles = parsed.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Variables de entorno invalidas: ${detalles}`);
  }

  return parsed.data;
}

function parseSupabaseEnv() {
  const parsed = requiredSupabaseEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const detalles = parsed.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Variables de Supabase invalidas: ${detalles}`);
  }

  return parsed.data;
}

let cachedEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getEnv() {
  if (!cachedEnv) cachedEnv = parseEnv();
  return cachedEnv;
}

export function getPublicEnv() {
  const parsed = publicEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const detalles = parsed.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Variables publicas invalidas: ${detalles}`);
  }

  return parsed.data;
}

export function getSupabaseEnv() {
  return parseSupabaseEnv();
}
