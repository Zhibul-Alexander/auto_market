import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { listVehicles } from '../../../lib/server/vehicles';

export const runtime = 'edge';

const QuerySchema = z.object({
  category: z.enum(['cars', 'moto', 'water', 'special']).optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.coerce.number().optional(),
  yearMax: z.coerce.number().optional(),
  engineMin: z.coerce.number().optional(),
  engineMax: z.coerce.number().optional(),
  bodyType: z.string().optional(),
  fuelType: z.string().optional(),
  driveType: z.string().optional(),
  transmissionType: z.string().optional(),
  color: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'year_asc', 'year_desc', 'engine_desc']).optional(),
  page: z.coerce.number().optional()
});

function splitList(v?: string) {
  if (!v) return undefined;
  const arr = v.split(',').map((x) => x.trim()).filter(Boolean);
  return arr.length ? arr : undefined;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid query' }, { status: 400 });
  }

  const q = parsed.data;
  const pageSize = 50;
  const page = Math.max(1, q.page ?? 1);

  const data = await listVehicles({
    filters: {
      category: q.category,
      priceMin: q.priceMin,
      priceMax: q.priceMax,
      make: splitList(q.make)?.map((m) => m.toUpperCase()),
      model: q.model ? q.model.toUpperCase() : undefined,
      yearMin: q.yearMin,
      yearMax: q.yearMax,
      engineMin: q.engineMin,
      engineMax: q.engineMax,
      bodyType: splitList(q.bodyType),
      fuelType: splitList(q.fuelType),
      driveType: splitList(q.driveType),
      transmissionType: splitList(q.transmissionType),
      color: q.color,
      q: q.q
    },
    sort: q.sort ?? 'newest',
    page,
    pageSize
  });

  return NextResponse.json({
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    items: data.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      externalId: r.externalId,
      category: r.category,
      year: r.year,
      make: r.make,
      model: r.model,
      trim: r.trim,
      fullModelName: r.fullModelName,
      bodyType: r.bodyType,
      engineVolumeL: r.engineVolumeL,
      fuelType: r.fuelType,
      driveType: r.driveType,
      transmissionType: r.transmissionType,
      color: r.color,
      displayedPrice: r.displayedPrice,
      currency: r.currency,
      thumbUrl: r.thumbUrl,
      updatedAt: r.updatedAt
    }))
  });
}
