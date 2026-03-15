export const runtime = 'edge';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/*?*page=',
          '/*?*sort=',
          '/*?*q=',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
