import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './lib/i18n/routing';
import { verifyAdminSession } from './lib/server/auth';

const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (no locale prefix).
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login')) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get('admin_session')?.value;
    if (!cookie || !(await verifyAdminSession(cookie))) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Locale-prefixed public routes.
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};
