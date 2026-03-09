export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getDb } from '../../../db/client';
import { office } from '../../../db/schema';
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
