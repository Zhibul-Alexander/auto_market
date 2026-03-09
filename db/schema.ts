import { sqliteTable, integer, text, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const vehicle = sqliteTable(
  'Vehicle',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    externalId: text('externalId').notNull(),
    slug: text('slug').notNull(),
    category: text('category').notNull().default('cars'),
    year: integer('year').notNull(),
    make: text('make').notNull(),
    model: text('model').notNull(),
    trim: text('trim'),
    fullModelName: text('fullModelName'),
    vin: text('vin'),
    color: text('color'),
    fuelRaw: text('fuelRaw'),
    fuelType: text('fuelType'),
    driveRaw: text('driveRaw'),
    driveType: text('driveType'),
    transmissionRaw: text('transmissionRaw'),
    transmissionType: text('transmissionType'),
    bodyTypeRaw: text('bodyTypeRaw'),
    bodyType: text('bodyType'),
    engineVolumeL: real('engineVolumeL'),
    odometerReading: integer('odometerReading'),
    odometerUnit: text('odometerUnit'),
    buyItNow: real('buyItNow'),
    estRetail: real('estRetail'),
    displayedPrice: real('displayedPrice'),
    currency: text('currency').notNull().default('USD'),
    itemUrl: text('itemUrl'),
    thumbUrl: text('thumbUrl'),
    galleryJson: text('galleryJson'),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull()
  },
  (t) => ({
    externalIdIdx: uniqueIndex('Vehicle_externalId_unique').on(t.externalId),
    slugIdx: uniqueIndex('Vehicle_slug_unique').on(t.slug)
  })
);

export const lead = sqliteTable('Lead', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  name: text('name'),
  phone: text('phone').notNull(),
  message: text('message'),
  lotId: integer('lotId'),
  serviceSlug: text('serviceSlug'),
  locale: text('locale').notNull(),
  pageUrl: text('pageUrl').notNull(),
  status: text('status').notNull().default('new'),
  note: text('note'),
  createdAt: text('createdAt').notNull()
});

export const trackingEvent = sqliteTable('TrackingEvent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vin: text('vin').notNull(),
  status: text('status').notNull(),
  checkpoint: text('checkpoint').notNull(),
  date: text('date').notNull(),
  notes: text('notes'),
  photosJson: text('photosJson')
});

export const servicePage = sqliteTable(
  'ServicePage',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    locale: text('locale').notNull(),
    title: text('title').notNull(),
    blocksJson: text('blocksJson').notNull(),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull()
  },
  (t) => ({
    slugLocaleUnique: uniqueIndex('ServicePage_slug_locale_unique').on(t.slug, t.locale)
  })
);

export type Vehicle = typeof vehicle.$inferSelect;
export type Lead = typeof lead.$inferSelect;
export type TrackingEvent = typeof trackingEvent.$inferSelect;
export type ServicePage = typeof servicePage.$inferSelect;
