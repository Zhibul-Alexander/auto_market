import type { MetadataRoute } from 'next';
import { locales } from '../lib/i18n/routing';
import { getDb } from '../db/client';
import { servicePage, vehicle } from '../db/schema';
import { asc } from 'drizzle-orm';

export const runtime = 'edge';

const LOTS_PER_SITEMAP = 1000;

const STATIC_PATHS = [
  '',
  '/catalog',
  '/catalog/cars',
  '/catalog/cars/sedans',
  '/catalog/cars/hatchbacks',
  '/catalog/cars/crossovers',
  '/catalog/cars/coupes',
  '/catalog/cars/minivans',
  '/catalog/cars/pickups',
  '/catalog/cars/convertibles',
  '/catalog/cars/sport',
  '/catalog/cars/wagons',
  '/catalog/moto',
  '/catalog/moto/motorcycles',
  '/catalog/moto/buggies',
  '/catalog/moto/atvs',
  '/catalog/moto/scooters',
  '/catalog/moto/snowmobiles',
  '/catalog/water',
  '/catalog/special',
  '/services',
  '/services/customs',
  '/services/delivery',
  '/about',
  '/tracking',
  '/contacts',
  '/privacy',
  '/cookies',
];

function alternates(path: string, base: string) {
  return Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`]));
}

const MAX_LOT_SITEMAPS = 10; // covers up to 10 000 vehicles

export function generateSitemaps() {
  return [
    { id: 'static' },
    { id: 'services' },
    ...Array.from({ length: MAX_LOT_SITEMAPS }, (_, i) => ({ id: `lots-${i}` })),
  ];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, '');
  const db = getDb();

  // ── Static pages ──────────────────────────────────────────────────────────
  if (id === 'static') {
    return STATIC_PATHS.flatMap((path) =>
      locales.map((locale) => ({
        url: `${base}/${locale}${path}`,
        lastModified: new Date('2025-01-01'),
        changeFrequency: (path === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
        priority: path === '' ? 1.0 : path.startsWith('/catalog/cars/') || path.startsWith('/catalog/moto/') ? 0.7 : 0.8,
        alternates: { languages: alternates(path, base) },
      }))
    );
  }

  // ── Dynamic service pages ─────────────────────────────────────────────────
  if (id === 'services') {
    const services = await db
      .select({ slug: servicePage.slug, updatedAt: servicePage.updatedAt, locale: servicePage.locale })
      .from(servicePage);

    // Group by slug to build hreflang alternates across locales
    const bySlug = new Map<string, typeof services>();
    for (const s of services) {
      const group = bySlug.get(s.slug) ?? [];
      group.push(s);
      bySlug.set(s.slug, group);
    }

    return [...bySlug.values()].flatMap((group) =>
      group.map((s) => ({
        url: `${base}/${s.locale}/services/${s.slug}`,
        lastModified: new Date(s.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(group.map((g) => [g.locale, `${base}/${g.locale}/services/${g.slug}`])),
        },
      }))
    );
  }

  // ── Vehicle lot pages (paginated) ─────────────────────────────────────────
  const page = parseInt(id.replace('lots-', ''), 10);
  const lots = await db
    .select({ slug: vehicle.slug, updatedAt: vehicle.updatedAt })
    .from(vehicle)
    .orderBy(asc(vehicle.id))
    .limit(LOTS_PER_SITEMAP)
    .offset(page * LOTS_PER_SITEMAP);

  return lots.flatMap((lot) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/lot/${lot.slug}`,
      lastModified: new Date(lot.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}/lot/${lot.slug}`])),
      },
    }))
  );
}
