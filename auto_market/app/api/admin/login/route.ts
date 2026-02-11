import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminSessionCookieName, adminSessionMaxAgeSeconds, createAdminSessionCookieValue } from '../../../../lib/server/auth';

export const runtime = 'edge';

const Schema = z.object({
  password: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!adminPassword || !sessionSecret) {
    return NextResponse.json({ error: 'Server is not configured' }, { status: 500 });
  }

  if (parsed.data.password !== adminPassword) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const value = await createAdminSessionCookieValue(sessionSecret);
  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: adminSessionCookieName,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: adminSessionMaxAgeSeconds
  });

  return res;
}
