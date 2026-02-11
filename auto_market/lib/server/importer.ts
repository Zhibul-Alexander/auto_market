import { z } from 'zod';
import { getDb } from '../../db/client';
import { vehicle } from '../../db/schema';
import { computeDisplayedPrice, extractBodyTypeRaw, extractEngineVolumeL, buildSlug, normalizeBodyType, normalizeDriveType, normalizeFuelType, normalizeTransmissionType, toPositiveNumberOrNull } from './normalize';
import { sql } from 'drizzle-orm';

const LotSchema = z.object({
  lot_number: z.union([z.string(), z.number()]),
  item_url: z.string().url().optional().nullable(),
  year: z.coerce.number().int().min(1900).max(2100),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional().nullable(),
  full_model_name: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  drive: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),
  buy_it_now_price: z.any().optional().nullable(),
  estimated_retail_value: z.any().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  images_full: z.array(z.string().url()).optional().nullable(),
  build_sheet: z.any().optional().nullable(),
  category: z.enum(['cars', 'moto', 'water', 'special']).optional().nullable()
});

export type ImportMode = 'preview' | 'import';

export async function importLotsFromJsonText(text: string, mode: ImportMode) {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: 'Invalid JSON' as const };
  }

  if (!Array.isArray(raw)) {
    return { ok: false, error: 'JSON must be an array of objects' as const };
  }

  const preview = raw.slice(0, 20);
  const normalizedPreview: any[] = [];
  const errors: { index: number; externalId?: string; error: string }[] = [];

  const now = new Date().toISOString();
  const rowsToUpsert: any[] = [];

  for (let i = 0; i < raw.length; i++) {
    const obj = raw[i];
    const parsed = LotSchema.safeParse(obj);
    if (!parsed.success) {
      errors.push({ index: i, error: parsed.error.issues[0]?.message || 'Invalid object' });
      continue;
    }

    const v = parsed.data;
    const externalId = String(v.lot_number);

    const buyItNow = toPositiveNumberOrNull(v.buy_it_now_price);
    // estimated_retail_value could be -1 etc => null
    const estRetail = toPositiveNumberOrNull(v.estimated_retail_value);

    const displayedPrice = computeDisplayedPrice(buyItNow, estRetail);

    const buildSheet = v.build_sheet ?? null;

    const bodyTypeRaw = extractBodyTypeRaw(buildSheet);
    const bodyType = normalizeBodyType(bodyTypeRaw);

    const engineVolumeL = extractEngineVolumeL(buildSheet);

    const fuelType = normalizeFuelType(v.fuel);
    const driveType = normalizeDriveType(v.drive);
    const transmissionType = normalizeTransmissionType(v.transmission);

    const category = (v.category ?? 'cars') as string;

    const slug = buildSlug(v.year, v.make, v.model, externalId);

    const gallery = Array.isArray(v.images_full) && v.images_full.length ? v.images_full : (v.imageUrl ? [v.imageUrl] : []);

    const row = {
      externalId,
      slug,
      category,
      year: v.year,
      make: String(v.make).toUpperCase(),
      model: String(v.model).toUpperCase(),
      trim: v.trim ? String(v.trim) : null,
      fullModelName: v.full_model_name ? String(v.full_model_name) : null,
      vin: v.vin ? String(v.vin) : null,
      color: v.color ? String(v.color) : null,
      fuelRaw: v.fuel ? String(v.fuel) : null,
      fuelType,
      driveRaw: v.drive ? String(v.drive) : null,
      driveType,
      transmissionRaw: v.transmission ? String(v.transmission) : null,
      transmissionType,
      bodyTypeRaw,
      bodyType,
      engineVolumeL,
      buyItNow,
      estRetail,
      displayedPrice,
      currency: 'USD',
      itemUrl: v.item_url ?? null,
      thumbUrl: v.imageUrl ?? null,
      galleryJson: JSON.stringify(gallery),
      createdAt: now,
      updatedAt: now
    };

    if (i < 20) normalizedPreview.push(row);
    rowsToUpsert.push(row);
  }

  if (mode === 'preview') {
    return {
      ok: true,
      mode,
      total: raw.length,
      preview: normalizedPreview,
      errors
    } as const;
  }

  // Import mode: upsert
  const db = getDb();
  let inserted = 0;
  let updated = 0;
  let failed = errors.length;

  // We will chunk to avoid big payloads.
  const chunkSize = 150;
  for (let start = 0; start < rowsToUpsert.length; start += chunkSize) {
    const chunk = rowsToUpsert.slice(start, start + chunkSize);
    try {
      await db
        .insert(vehicle)
        .values(chunk)
        .onConflictDoUpdate({
          target: vehicle.externalId,
          set: {
            slug: sql`excluded.slug`,
            category: sql`excluded.category`,
            year: sql`excluded.year`,
            make: sql`excluded.make`,
            model: sql`excluded.model`,
            trim: sql`excluded.trim`,
            fullModelName: sql`excluded.fullModelName`,
            vin: sql`excluded.vin`,
            color: sql`excluded.color`,
            fuelRaw: sql`excluded.fuelRaw`,
            fuelType: sql`excluded.fuelType`,
            driveRaw: sql`excluded.driveRaw`,
            driveType: sql`excluded.driveType`,
            transmissionRaw: sql`excluded.transmissionRaw`,
            transmissionType: sql`excluded.transmissionType`,
            bodyTypeRaw: sql`excluded.bodyTypeRaw`,
            bodyType: sql`excluded.bodyType`,
            engineVolumeL: sql`excluded.engineVolumeL`,
            buyItNow: sql`excluded.buyItNow`,
            estRetail: sql`excluded.estRetail`,
            displayedPrice: sql`excluded.displayedPrice`,
            currency: sql`excluded.currency`,
            itemUrl: sql`excluded.itemUrl`,
            thumbUrl: sql`excluded.thumbUrl`,
            galleryJson: sql`excluded.galleryJson`,
            updatedAt: sql`excluded.updatedAt`
          }
        });
      inserted += chunk.length; // D1 doesn't tell which were updated; treat as processed
    } catch (e: any) {
      failed += chunk.length;
      errors.push({ index: start, error: e?.message || 'Insert failed' });
    }
  }

  return {
    ok: true,
    mode,
    total: raw.length,
    processed: rowsToUpsert.length,
    inserted,
    updated,
    failed,
    errors
  } as const;
}
