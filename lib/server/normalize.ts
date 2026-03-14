import slugify from './slugify';

export type BodyType =
  | 'sedan'
  | 'coupe'
  | 'hatchback'
  | 'crossover'
  | 'wagon'
  | 'convertible'
  | 'pickup'
  | 'minivan'
  | 'sport'
  | 'other'
  | null;

export type FuelType = 'electric' | 'hybrid' | 'diesel' | 'gas' | 'other' | null;
export type DriveType = 'fwd' | 'rwd' | 'awd' | '4wd' | 'other' | null;
export type TransmissionType = 'automatic' | 'manual' | 'cvt' | 'other' | null;

export function normalizeBodyType(raw: unknown): BodyType {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (!s) return null;

  if (s.includes('sedan')) return 'sedan';
  if (s.includes('coupe')) return 'coupe';
  if (s.includes('hatch')) return 'hatchback';
  if (s.includes('wagon')) return 'wagon';
  if (s.includes('convertible') || s.includes('cabriolet')) return 'convertible';
  if (s.includes('pickup') || s.includes('truck')) return 'pickup';
  if (s.includes('minivan') || s.includes('van')) return 'minivan';
  if (s.includes('sport')) return 'sport';
  if (s.includes('suv') || s.includes('crossover') || s.includes('sport utility')) return 'crossover';

  return 'other';
}

export function normalizeFuelType(raw: unknown): FuelType {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  if (s.includes('hybrid')) return 'hybrid';
  if (s.includes('electric')) return 'electric';
  if (s.includes('diesel')) return 'diesel';
  if (s.includes('gas') || s.includes('gasoline') || s.includes('flexible')) return 'gas';
  return 'other';
}

export function normalizeDriveType(raw: unknown): DriveType {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  if (s.includes('awd') || s.includes('all wheel') || s.includes('all-wheel')) return 'awd';
  if ((s.includes('4wd') || s.includes('4x4')) && (s.includes('wheel') || s.includes('whl'))) return 'awd';
  if (s.includes('4wd') || s.includes('4x4')) return '4wd';
  if (s.includes('front')) return 'fwd';
  if (s.includes('rear')) return 'rwd';
  return 'other';
}

export function normalizeTransmissionType(raw: unknown): TransmissionType {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  if (s.includes('cvt')) return 'cvt';
  if (s.includes('manual')) return 'manual';
  if (s.includes('auto')) return 'automatic';
  return 'other';
}

export function parseEngineVolumeL(input: unknown): number | null {
  if (input == null) return null;
  const s = String(input);

  // First: find X.XL pattern
  const m1 = s.match(/(\d(?:\.\d)?)\s*L\b/i);
  if (m1?.[1]) return round1(parseFloat(m1[1]));

  // Other cases like "3.6 L/220" or "2.5 L/152"
  const m2 = s.match(/(\d(?:\.\d)?)\s*L\s*\//i);
  if (m2?.[1]) return round1(parseFloat(m2[1]));

  // As a fallback, look for a decimal number that looks like liters
  const m3 = s.match(/\b(\d(?:\.\d)?)\b/);
  if (m3?.[1]) {
    const v = parseFloat(m3[1]);
    if (v > 0.6 && v < 10) return round1(v);
  }

  return null;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

export function computeDisplayedPrice(buyItNow: unknown, estRetail: unknown): number | null {
  const b = toPositiveNumberOrNull(buyItNow);
  const e = toPositiveNumberOrNull(estRetail);

  if (b && e) return Math.round(Math.min(0.65 * e, 0.70 * b) * 100) / 100;
  if (b) return Math.round(0.70 * b * 100) / 100;
  if (e) return Math.round(0.65 * e * 100) / 100;
  return null;
}

export function toPositiveNumberOrNull(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.\-]/g, ''));
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return n;
}

export function buildSlug(year: number, make: string, model: string, externalId: string): string {
  return slugify(`${year}-${make}-${model}-${externalId}`);
}

export function maskVin(vin: string | null | undefined): string | null {
  if (!vin) return null;
  const s = vin.trim();
  if (s.length < 6) return '••••••';
  return '•••••••••••' + s.slice(-6);
}

export function extractBodyTypeRaw(buildSheet: any): string | null {
  if (!buildSheet) return null;
  const ts = buildSheet?.technicalSpecification;
  const fromTech = ts?.bodyStyle;
  if (fromTech) return String(fromTech);

  const styles = buildSheet?.styles;
  if (Array.isArray(styles) && styles[0]) {
    const alt = styles[0]?.altBodyType || styles[0]?.vehicleType;
    if (alt) return String(alt);
  }
  return null;
}

export function extractEngineVolumeL(buildSheet: any): number | null {
  if (!buildSheet) return null;

  // A) factoryOptions ENGINE primaryDesc
  const fo = buildSheet?.factoryOptions;
  if (Array.isArray(fo)) {
    const engine = fo.find((x: any) => String(x?.headerName || '').trim().toUpperCase() === 'ENGINE');
    const desc = engine?.primaryDesc;
    const v = parseEngineVolumeL(desc);
    if (v != null) return v;
  }

  // B) technicalSpecification.displacement
  const d = buildSheet?.technicalSpecification?.displacement;
  const v2 = parseEngineVolumeL(d);
  if (v2 != null) return v2;

  // C) engines[0].displacement.value (uom liters)
  const engines = buildSheet?.engines;
  if (Array.isArray(engines) && engines[0]) {
    const disp = engines[0]?.displacement;
    const uom = String(disp?.uom || '').toLowerCase();
    const val = disp?.value;
    if (uom.includes('liter')) {
      const v3 = parseEngineVolumeL(val);
      if (v3 != null) return v3;
    }
  }

  return null;
}
