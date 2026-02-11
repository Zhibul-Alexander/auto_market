import { NextRequest, NextResponse } from 'next/server';
import { isValidVin } from '../../../lib/server/vin';
import { listTrackingEventsByVin } from '../../../lib/server/tracking';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const vin = (url.searchParams.get('vin') || '').trim().toUpperCase();

  if (!isValidVin(vin)) {
    return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
  }

  const events = await listTrackingEventsByVin(vin);
  return NextResponse.json({ vin, events });
}
