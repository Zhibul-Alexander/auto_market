export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../../db/client';
import { office } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

    const body = await req.json();
    const updates: Record<string, any> = { updatedAt: new Date().toISOString() };

    if (body.city !== undefined) updates.city = body.city.trim();
    if (body.phone !== undefined) updates.phone = body.phone.trim();
    if (body.address !== undefined) updates.address = body.address?.trim() || null;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

    const db = getDb();
    await db.update(office).set(updates).where(eq(office.id, id));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

    const db = getDb();
    await db.delete(office).where(eq(office.id, id));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
