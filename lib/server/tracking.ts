import { asc, eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { trackingEvent } from '../../db/schema';

export async function listTrackingEventsByVin(vin: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(trackingEvent)
    .where(eq(trackingEvent.vin, vin))
    .orderBy(asc(trackingEvent.date));
  return rows.map((r) => ({ ...r, photos: safeParseArray(r.photosJson) }));
}

function safeParseArray(s: string | null) {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
