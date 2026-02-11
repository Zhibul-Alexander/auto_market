export function isValidVin(vin: string): boolean {
  if (!vin) return false;
  const s = vin.trim().toUpperCase();
  if (s.length !== 17) return false;
  // Exclude I, O, Q
  if (/[IOQ]/.test(s)) return false;
  return /^[A-Z0-9]{17}$/.test(s);
}
