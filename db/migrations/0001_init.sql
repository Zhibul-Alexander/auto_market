-- Initial schema for D1

CREATE TABLE IF NOT EXISTS Vehicle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  externalId TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'cars',
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  fullModelName TEXT,
  vin TEXT,
  color TEXT,
  fuelRaw TEXT,
  fuelType TEXT,
  driveRaw TEXT,
  driveType TEXT,
  transmissionRaw TEXT,
  transmissionType TEXT,
  bodyTypeRaw TEXT,
  bodyType TEXT,
  engineVolumeL REAL,
  buyItNow REAL,
  estRetail REAL,
  displayedPrice REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  itemUrl TEXT,
  thumbUrl TEXT,
  galleryJson TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Lead (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  name TEXT,
  phone TEXT NOT NULL,
  message TEXT,
  lotId INTEGER,
  serviceSlug TEXT,
  locale TEXT NOT NULL,
  pageUrl TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  note TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (lotId) REFERENCES Vehicle(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS TrackingEvent (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vin TEXT NOT NULL,
  status TEXT NOT NULL,
  checkpoint TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT,
  photosJson TEXT
);

CREATE TABLE IF NOT EXISTS ServicePage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  blocksJson TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  UNIQUE (slug, locale)
);
