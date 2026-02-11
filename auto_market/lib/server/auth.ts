// Edge-safe HMAC session cookie for /admin.

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function utf8(input: string) {
  return new TextEncoder().encode(input);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function base64ToBytes(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64urlEncode(bytes: Uint8Array) {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64urlDecode(s: string) {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return base64ToBytes(padded);
}

async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey('raw', utf8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  const sig = await crypto.subtle.sign('HMAC', key, utf8(data));
  return new Uint8Array(sig);
}

export async function createAdminSessionCookieValue(sessionSecret: string, now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const payload = `${issuedAt}`;
  const sig = await hmacSha256(sessionSecret, payload);
  return `${payload}.${base64urlEncode(sig)}`;
}

export async function verifyAdminSession(cookieValue: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const [issuedAtStr, sigB64Url] = cookieValue.split('.');
  const issuedAt = Number(issuedAtStr);
  if (!issuedAtStr || !sigB64Url || !Number.isFinite(issuedAt)) return false;

  const age = Math.floor(Date.now() / 1000) - issuedAt;
  if (age < 0 || age > MAX_AGE_SECONDS) return false;

  const expected = await hmacSha256(secret, `${issuedAt}`);
  const provided = base64urlDecode(sigB64Url);

  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i]! ^ provided[i]!;
  return diff === 0;
}

export const adminSessionCookieName = 'admin_session';
export const adminSessionMaxAgeSeconds = MAX_AGE_SECONDS;
