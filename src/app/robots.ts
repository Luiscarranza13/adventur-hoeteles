import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
