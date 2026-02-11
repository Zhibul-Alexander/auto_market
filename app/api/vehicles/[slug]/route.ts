import { NextRequest, NextResponse } from 'next/server';
import { getVehicleBySlug } from '../../../../lib/server/vehicles';
import { maskVin } from '../../../../lib/server/normalize';

export const runtime = 'edge';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const v = await getVehicleBySlug(params.slug);
  if (!v) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let gallery: string[] = [];
  try {
    gallery = v.galleryJson ? JSON.parse(v.galleryJson) : [];
  } catch {}

  return NextResponse.json({
    ...v,
    vinMasked: maskVin(v.vin),
    gallery
  });
}
