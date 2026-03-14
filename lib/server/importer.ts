import { z } from 'zod';
import { getDb } from '../../db/client';
import { vehicle } from '../../db/schema';
import { computeDisplayedPrice, buildSlug, normalizeBodyType, normalizeDriveType, normalizeFuelType, normalizeTransmissionType, toPositiveNumberOrNull } from './normalize';


// Мягкая валидация: URL-поля принимаем как строки, фильтруем позже.
// Это предотвращает отброс целого объекта из-за пустого imageUrl или невалидного URL.
const LotSchema = z.object({
  lot_number: z.union([z.string(), z.number()]),
  item_url: z.string().optional().nullable(),
  year: z.coerce.number().int().min(1900).max(2100),
  make: z.string().min(1),
  model: z.string().optional().nullable(),
  trim: z.string().optional().nullable(),
  full_model_name: z.string().optional().nullable(),
  engine: z.string().optional().nullable(),
  body_style: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  drive: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),
  odometer_reading: z.coerce.number().optional().nullable(),
  odometer: z.union([z.string(), z.number()]).optional().nullable(),
  buy_it_now_price: z.any().optional().nullable(),
  estimated_retail_value: z.any().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  images_full: z.array(z.string()).optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  category: z.enum(['cars', 'moto', 'water', 'special']).optional().nullable()
});

/** Проверяем, является ли строка валидным http(s) URL */
function isValidUrl(s: unknown): s is string {
  if (typeof s !== 'string' || !s) return false;
  try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

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

  const normalizedPreview: any[] = [];
  const skipped: { index: number; externalId?: string; reason: string }[] = [];
  const errors: { index: number; externalId?: string; error: string }[] = [];

  const now = new Date().toISOString();
  const rowsToUpsert: any[] = [];

  for (let i = 0; i < raw.length; i++) {
    const obj = raw[i];
    const parsed = LotSchema.safeParse(obj);
    if (!parsed.success) {
      skipped.push({ index: i, reason: parsed.error.issues[0]?.message || 'Invalid object' });
      continue;
    }

    const v = parsed.data;
    const externalId = String(v.lot_number);

    const resolvedModel = v.model?.trim() || v.full_model_name?.trim() || '';

    if (!resolvedModel) {
      skipped.push({ index: i, externalId, reason: 'could not determine model' });
      continue;
    }

    const resolvedTrim = null;

    const buyItNow = toPositiveNumberOrNull(v.buy_it_now_price);
    const estRetail = toPositiveNumberOrNull(v.estimated_retail_value);

    if (!buyItNow && !estRetail) {
      skipped.push({ index: i, externalId, reason: 'no price' });
      continue;
    }

    const displayedPrice = computeDisplayedPrice(buyItNow, estRetail);

    if (v.body_style == null) {
      skipped.push({ index: i, externalId, reason: 'body_style is null' });
      continue;
    }

    const bodyTypeRaw = String(v.body_style);
    const bodyType = normalizeBodyType(bodyTypeRaw);

    // Парсим объём двигателя из строки вида "4.4L  8", "2.0L 4 Cylinder" и т.п.
    const engineVolumeL = (() => {
      if (!v.engine) return null;
      const m = String(v.engine).match(/(\d+(?:\.\d+)?)\s*[Ll]/);
      return m ? parseFloat(m[1]!) : null;
    })();

    const fuelType = normalizeFuelType(v.fuel);
    const driveType = normalizeDriveType(v.drive);
    const transmissionType = normalizeTransmissionType(v.trim);

    const odometerReading = (() => {
      if (v.odometer_reading != null && Number.isFinite(v.odometer_reading) && v.odometer_reading > 0)
        return Math.round(v.odometer_reading);
      if (typeof v.odometer === 'number' && Number.isFinite(v.odometer) && v.odometer > 0)
        return Math.round(v.odometer);
      return null;
    })();
    const odometerUnit = typeof v.odometer === 'string' && v.odometer
      ? (v.odometer.toLowerCase().includes('km') ? 'km' : 'mi')
      : (odometerReading != null ? 'mi' : null);

    const category = (v.category ?? 'cars') as string;

    const slug = buildSlug(v.year, v.make, resolvedModel, externalId);

    // Фильтруем URL-ы: отбрасываем пустые строки и невалидные адреса
    const rawImages = Array.isArray(v.images_full) && v.images_full.length > 0
      ? v.images_full
      : (Array.isArray(v.images) ? v.images : []);
    const validImages = rawImages.filter(isValidUrl);
    const thumbUrl = isValidUrl(v.imageUrl) ? v.imageUrl : null;
    const itemUrl = isValidUrl(v.item_url) ? v.item_url : null;

    // Пропускаем объект если trim (КПП) равен null
    if (v.trim === null || v.trim === undefined) {
      skipped.push({ index: i, externalId, reason: 'transmission is null' });
      continue;
    }

    // Пропускаем объект если привод неизвестен
    if (v.drive && String(v.drive).toLowerCase() === 'unknown') {
      skipped.push({ index: i, externalId, reason: 'drive is UNKNOWN' });
      continue;
    }

    // Пропускаем объект если 4 или меньше изображений
    if (validImages.length <= 4) {
      skipped.push({ index: i, externalId, reason: '4 or fewer images' });
      continue;
    }

    // Галерея: сначала полноразмерные, иначе миниатюра, иначе пусто
    const gallery = validImages.length > 0
      ? validImages
      : (thumbUrl ? [thumbUrl] : []);

    const row = {
      externalId,
      slug,
      category,
      year: v.year,
      make: String(v.make).toUpperCase(),
      model: resolvedModel.toUpperCase(),
      trim: resolvedTrim,
      fullModelName: `${v.year} ${String(v.make).toUpperCase()} ${resolvedModel.toUpperCase()}${resolvedTrim ? ` ${resolvedTrim}` : ''}`,
      vin: v.vin ? String(v.vin) : null,
      color: v.color ? String(v.color) : null,
      fuelRaw: v.fuel ? String(v.fuel) : null,
      fuelType,
      driveRaw: v.drive ? String(v.drive) : null,
      driveType,
      transmissionRaw: v.trim ? String(v.trim) : null,
      transmissionType,
      bodyTypeRaw: bodyTypeRaw,
      bodyType,
      engineVolumeL,
      odometerReading,
      odometerUnit,
      buyItNow,
      estRetail,
      displayedPrice,
      currency: 'USD',
      itemUrl,
      // Предпочитаем полноразмерное фото (_ful) вместо миниатюры (_thb)
      thumbUrl: validImages.length > 0 ? validImages[0]! : thumbUrl,
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
      skipped,
      errors
    } as const;
  }

  // Import mode: удаляем всё, вставляем заново
  const db = getDb();
  let inserted = 0;
  let failed = 0;

  // Очищаем таблицу перед загрузкой
  try {
    await db.delete(vehicle);
  } catch (e: any) {
    console.error('[import] delete all failed:', e?.message || e);
    return { ok: false, error: 'Failed to clear table before import' as const };
  }

  // Вставляем батчами по 10 (ограничение workerd)
  const BATCH_SIZE = 10;

  for (let batchStart = 0; batchStart < rowsToUpsert.length; batchStart += BATCH_SIZE) {
    const chunk = rowsToUpsert.slice(batchStart, batchStart + BATCH_SIZE);
    const queries = chunk.map((row: any) => db.insert(vehicle).values(row));

    try {
      await db.batch(queries as [typeof queries[0], ...typeof queries]);
      inserted += chunk.length;
    } catch (batchErr: any) {
      console.error('[import] batch failed:', batchErr?.message || batchErr);
      for (let j = 0; j < chunk.length; j++) {
        try {
          await db.insert(vehicle).values(chunk[j]!);
          inserted++;
        } catch (innerE: any) {
          if (j === 0) console.error('[import] single insert failed:', innerE?.message || innerE);
          failed++;
          errors.push({
            index: batchStart + j,
            externalId: chunk[j]!.externalId,
            error: innerE?.message || 'Insert failed'
          });
        }
      }
    }
  }

  return {
    ok: true,
    mode,
    total: raw.length,
    processed: rowsToUpsert.length,
    inserted,
    skipped: skipped.length,
    skippedReasons: skipped.reduce<Record<string, number>>((acc, s) => { acc[s.reason] = (acc[s.reason] ?? 0) + 1; return acc; }, {}),
    failed,
    errors
  } as const;
}
