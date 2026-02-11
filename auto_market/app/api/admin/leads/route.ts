import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { listLeads } from '../../../../lib/server/leads';

export const runtime = 'edge';

const QuerySchema = z.object({
  status: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional()
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });

  const page = Math.max(1, parsed.data.page ?? 1);
  const pageSize = Math.min(100, Math.max(10, parsed.data.pageSize ?? 30));

  const data = await listLeads({
    status: parsed.data.status,
    q: parsed.data.q,
    page,
    pageSize
  });

  return NextResponse.json({ ...data, page, pageSize });
}
