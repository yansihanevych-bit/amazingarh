import { NextResponse, type NextRequest } from 'next/server';
import { defaultLang, isLang, langs } from '@/content/i18n';

/** Sends visitors without a language prefix to /en or /pl (cookie first, then browser language). */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split('/')[1];
  if (isLang(first)) return NextResponse.next();

  const cookie = req.cookies.get('lang')?.value;
  const accept = req.headers.get('accept-language')?.toLowerCase() ?? '';
  const preferred = accept.split(',').map((s) => s.trim().slice(0, 2)).find((c) => (langs as readonly string[]).includes(c));
  const lang = isLang(cookie) ? cookie : isLang(preferred) ? preferred : defaultLang;

  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|img|favicon.svg|og.jpg|robots.txt|sitemap.xml|.*\\..*).*)'],
};
