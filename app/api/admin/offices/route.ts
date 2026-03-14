export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../db/client';
import { office } from '../../../../db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(office).orderBy(asc(office.sortOrder));
    return NextResponse.json({ rows });
  } catch (err: any) {
    return NextResponse.json({ rows: [], error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { city?: string; phone?: string; address?: string; sortOrder?: number };
    const { city, phone, address, sortOrder } = body;

    if (!city || !phone) {
      return NextResponse.json({ error: 'city and phone are required' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    await db.insert(office).values({
      city: city.trim(),
      phone: phone.trim(),
      address: address?.trim() || null,
      sortOrder: sortOrder ?? 0,
      createdAt: now,
      updatedAt: now
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
