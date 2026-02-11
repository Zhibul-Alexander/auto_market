import { and, asc, desc, eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { servicePage } from '../../db/schema';

export type ServiceBlock =
  | { type: 'hero'; title: string; subtitle?: string }
  | { type: 'text'; title?: string; body: string }
  | { type: 'bullets'; title?: string; items: string[] }
  | { type: 'faq'; items: { q: string; a: string }[] };

export async function getService(slug: string, locale: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(servicePage)
    .where(and(eq(servicePage.slug, slug), eq(servicePage.locale, locale)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    blocks: safeParseBlocks(row.blocksJson)
  };
}

export async function listServices(locale: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(servicePage)
    .where(eq(servicePage.locale, locale))
    .orderBy(asc(servicePage.title));

  return rows.map((r) => ({ ...r, blocks: safeParseBlocks(r.blocksJson) }));
}

function safeParseBlocks(s: string): ServiceBlock[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function upsertDefaultServicesIfEmpty() {
  const db = getDb();
  const any = await db.select({ id: servicePage.id }).from(servicePage).limit(1);
  if (any.length) return;

  const now = new Date().toISOString();
  const defaults = [
    {
      slug: 'shipping',
      titles: { en: 'Shipping & Logistics', ru: 'Доставка и логистика', ka: 'ტრანსპორტირება და ლოგისტიკა' },
      blocks: [
        { type: 'hero', title: 'Shipping & logistics', subtitle: 'From auction to Tbilisi—end-to-end.' },
        { type: 'bullets', title: 'What we do', items: ['Pickup from auction', 'Sea freight & customs', 'Local delivery'] },
        { type: 'faq', items: [{ q: 'How long does it take?', a: 'Depends on route and documents. We will confirm after checking your lot.' }] }
      ]
    },
    {
      slug: 'inspection',
      titles: { en: 'Inspection', ru: 'Осмотр', ka: 'შემოწმება' },
      blocks: [
        { type: 'hero', title: 'Inspection', subtitle: 'Quick pre-check and photo report.' },
        { type: 'text', body: 'We help you validate condition before making a decision.' }
      ]
    }
  ] as const;

  const locales = ['en', 'ru', 'ka'] as const;
  const rows = [];
  for (const d of defaults) {
    for (const l of locales) {
      rows.push({
        slug: d.slug,
        locale: l,
        title: d.titles[l],
        blocksJson: JSON.stringify(d.blocks),
        createdAt: now,
        updatedAt: now
      });
    }
  }

  await db.insert(servicePage).values(rows);
}
