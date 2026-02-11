import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLead } from '../../../lib/server/leads';

export const runtime = 'edge';

const LeadSchema = z.object({
  type: z.enum(['general', 'lot', 'service', 'contact']),
  name: z.string().max(80).optional().nullable(),
  phone: z.string().min(5).max(40),
  message: z.string().max(1200).optional().nullable(),
  consent: z.literal(true),
  lotId: z.number().int().optional().nullable(),
  serviceSlug: z.string().optional().nullable(),
  locale: z.string().min(2).max(5),
  pageUrl: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid payload' }, { status: 400 });
  }

  const id = await createLead({
    type: parsed.data.type,
    name: parsed.data.name ?? null,
    phone: parsed.data.phone,
    message: parsed.data.message ?? null,
    lotId: parsed.data.lotId ?? null,
    serviceSlug: parsed.data.serviceSlug ?? null,
    locale: parsed.data.locale,
    pageUrl: parsed.data.pageUrl
  });

  return NextResponse.json({ ok: true, id });
}
