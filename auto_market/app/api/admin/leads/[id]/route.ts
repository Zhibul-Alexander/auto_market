import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteLead, updateLead } from '../../../../../lib/server/leads';

export const runtime = 'edge';

const PatchSchema = z.object({
  status: z.enum(['new', 'in_progress', 'done']).optional(),
  note: z.string().max(2000).optional().nullable()
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const updated = await updateLead(id, parsed.data);
  return NextResponse.json({ ok: true, id: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
