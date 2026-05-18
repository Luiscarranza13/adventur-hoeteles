import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';
import { listarHotelesActivos } from '@/lib/hoteles-consultas';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  const rutasEstaticas = [
    '',
    '/hoteles',
    '/contacto',
    '/terminos',
    '/privacidad',
    '/reclamaciones',
  ].map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/hoteles' ? 'daily' as const : 'monthly' as const,
    priority: path === '' ? 1 : path === '/hoteles' ? 0.9 : 0.5,
  }));

  const hoteles = await listarHotelesActivos().catch(() => []);
  const rutasHoteles = hoteles.map(hotel => ({
    url: `${siteUrl}/hoteles/${hotel.id}`,
    lastModified: hotel.fechaCreacion ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...rutasEstaticas, ...rutasHoteles];
}
