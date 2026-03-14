import { and, asc, desc, eq, gte, inArray, like, lte, ne, sql } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { vehicle } from '../../db/schema';

export type VehicleFilters = {
  category?: 'cars' | 'moto' | 'water' | 'special';
  priceMin?: number;
  priceMax?: number;
  make?: string[];
  model?: string;
  yearMin?: number;
  yearMax?: number;
  engineMin?: number;
  engineMax?: number;
  bodyType?: string[]; // normalized enums
  fuelType?: string[];
  driveType?: string[];
  transmissionType?: string[];
  color?: string;
  q?: string;
};

export type VehicleSort = 'newest' | 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'engine_desc';

export async function listVehicles(opts: {
  filters: VehicleFilters;
  sort: VehicleSort;
  page: number;
  pageSize: number;
}) {
  const db = getDb();
  const where = buildWhere(opts.filters);

  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(vehicle)
    .where(where.length ? and(...where) : undefined);

  const total = totalRow[0]?.count ?? 0;
  const offset = (opts.page - 1) * opts.pageSize;

  const orderBy = buildOrderBy(opts.sort);

  const rows = await db
    .select()
    .from(vehicle)
    .where(where.length ? and(...where) : undefined)
    .orderBy(...orderBy)
    .limit(opts.pageSize)
    .offset(offset);

  return { total, rows, page: opts.page, pageSize: opts.pageSize };
}

export async function getVehicleBySlug(slug: string) {
  const db = getDb();
  const rows = await db.select().from(vehicle).where(eq(vehicle.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listSimilarVehicles(input: {
  excludeId: number;
  make: string;
  model: string;
  bodyType: string | null;
  limit?: number;
}) {
  const db = getDb();
  const lim = input.limit ?? 6;

  let rows = await db
    .select()
    .from(vehicle)
    .where(and(ne(vehicle.id, input.excludeId), eq(vehicle.make, input.make), eq(vehicle.model, input.model)))
    .orderBy(desc(vehicle.updatedAt))
    .limit(lim);

  if (!rows.length && input.bodyType) {
    rows = await db
      .select()
      .from(vehicle)
      .where(and(ne(vehicle.id, input.excludeId), eq(vehicle.bodyType, input.bodyType)))
      .orderBy(desc(vehicle.updatedAt))
      .limit(lim);
  }

  return rows;
}

function buildWhere(f: VehicleFilters) {
  const where = [];

  if (f.category) where.push(eq(vehicle.category, f.category));
  if (f.make?.length) where.push(inArray(vehicle.make, f.make));
  if (f.model) where.push(eq(vehicle.model, f.model));
  if (f.color) where.push(eq(vehicle.color, f.color));
  if (typeof f.priceMin === 'number') where.push(gte(vehicle.displayedPrice, f.priceMin));
  if (typeof f.priceMax === 'number') where.push(lte(vehicle.displayedPrice, f.priceMax));
  if (typeof f.yearMin === 'number') where.push(gte(vehicle.year, f.yearMin));
  if (typeof f.yearMax === 'number') where.push(lte(vehicle.year, f.yearMax));
  if (typeof f.engineMin === 'number') where.push(gte(vehicle.engineVolumeL, f.engineMin));
  if (typeof f.engineMax === 'number') where.push(lte(vehicle.engineVolumeL, f.engineMax));

  if (f.bodyType?.length) where.push(inArray(vehicle.bodyType, f.bodyType));
  if (f.fuelType?.length) where.push(inArray(vehicle.fuelType, f.fuelType));
  if (f.driveType?.length) where.push(inArray(vehicle.driveType, f.driveType));
  if (f.transmissionType?.length) where.push(inArray(vehicle.transmissionType, f.transmissionType));

  if (f.q) {
    const q = `%${f.q.trim()}%`;
    where.push(
      sql`(${vehicle.make} LIKE ${q} OR ${vehicle.model} LIKE ${q} OR ${vehicle.fullModelName} LIKE ${q} OR ${vehicle.externalId} LIKE ${q})`
    );
  }

  return where;
}

function buildOrderBy(sort: VehicleSort) {
  switch (sort) {
    case 'price_asc':
      return [asc(vehicle.displayedPrice), desc(vehicle.updatedAt)];
    case 'price_desc':
      return [desc(vehicle.displayedPrice), desc(vehicle.updatedAt)];
    case 'year_asc':
      return [asc(vehicle.year), desc(vehicle.updatedAt)];
    case 'year_desc':
      return [desc(vehicle.year), desc(vehicle.updatedAt)];
    case 'engine_desc':
      return [desc(vehicle.engineVolumeL), desc(vehicle.updatedAt)];
    case 'newest':
    default:
      return [desc(vehicle.updatedAt), desc(vehicle.createdAt)];
  }
}
