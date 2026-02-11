import { and, desc, eq, like, sql } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { lead } from '../../db/schema';

export async function createLead(input: {
  type: 'general' | 'lot' | 'service' | 'contact';
  name?: string | null;
  phone: string;
  message?: string | null;
  lotId?: number | null;
  serviceSlug?: string | null;
  locale: string;
  pageUrl: string;
}) {
  const db = getDb();
  const now = new Date().toISOString();

  const res = await db
    .insert(lead)
    .values({
      type: input.type,
      name: input.name ?? null,
      phone: input.phone,
      message: input.message ?? null,
      lotId: input.lotId ?? null,
      serviceSlug: input.serviceSlug ?? null,
      locale: input.locale,
      pageUrl: input.pageUrl,
      status: 'new',
      note: null,
      createdAt: now
    })
    .returning({ id: lead.id });

  return res[0]?.id ?? null;
}

export async function listLeads(opts: {
  status?: string;
  q?: string;
  page: number;
  pageSize: number;
}) {
  const db = getDb();
  const where = [];
  if (opts.status) where.push(eq(lead.status, opts.status));
  if (opts.q) {
    const q = `%${opts.q.trim()}%`;
    where.push(sql`(${lead.phone} LIKE ${q} OR ${lead.name} LIKE ${q})`);
  }

  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(lead)
    .where(where.length ? and(...where) : undefined);

  const total = totalRow[0]?.count ?? 0;

  const rows = await db
    .select()
    .from(lead)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(lead.createdAt))
    .limit(opts.pageSize)
    .offset((opts.page - 1) * opts.pageSize);

  return { total, rows };
}

export async function updateLead(id: number, patch: { status?: string; note?: string | null }) {
  const db = getDb();
  const values: any = {};
  if (patch.status) values.status = patch.status;
  if (patch.note !== undefined) values.note = patch.note;

  const res = await db.update(lead).set(values).where(eq(lead.id, id)).returning({ id: lead.id });
  return res[0]?.id ?? null;
}

export async function deleteLead(id: number) {
  const db = getDb();
  await db.delete(lead).where(eq(lead.id, id));
}
