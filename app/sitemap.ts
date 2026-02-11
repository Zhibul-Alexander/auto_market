import type { MetadataRoute } from 'next';
import { locales } from '../lib/i18n/routing';
import { getDb } from '../db/client';
import { servicePage, vehicle } from '../db/schema';
import { asc } from 'drizzle-orm';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, '');
  const db = getDb();

  const pages: string[] = [];
  for (const l of locales) {
    pages.push(`/${l}`);
    pages.push(`/${l}/catalog`);
    pages.push(`/${l}/catalog/cars`);
    pages.push(`/${l}/services`);
    pages.push(`/${l}/tracking`);
    pages.push(`/${l}/contacts`);
    pages.push(`/${l}/privacy`);
    pages.push(`/${l}/cookies`);
  }

  const lots = await db.select({ slug: vehicle.slug, updatedAt: vehicle.updatedAt }).from(vehicle).orderBy(asc(vehicle.id)).limit(5000);
  const services = await db.select({ slug: servicePage.slug, updatedAt: servicePage.updatedAt, locale: servicePage.locale }).from(servicePage);

  const out: MetadataRoute.Sitemap = [];

  for (const p of pages) {
    out.push({ url: base + p, lastModified: new Date() });
  }

  for (const lot of lots) {
    for (const l of locales) {
      out.push({ url: `${base}/${l}/lot/${lot.slug}`, lastModified: new Date(lot.updatedAt) });
    }
  }

  for (const s of services) {
    out.push({ url: `${base}/${s.locale}/services/${s.slug}`, lastModified: new Date(s.updatedAt) });
  }

  return out;
}
