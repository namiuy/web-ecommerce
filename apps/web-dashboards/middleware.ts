import { NextRequest, NextResponse } from 'next/server';

const PASS = process.env.DASH_PASSWORD || ''; // si no esta seteada -> sin gate (ej. en Oracle, ya detras del portal)

export function middleware(req: NextRequest) {
  if (!PASS) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/login') || pathname.startsWith('/api/login')) return NextResponse.next();
  if (req.cookies.get('dash_auth')?.value === PASS) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  // gatea todo menos assets de next y archivos con extension
  matcher: ['/((?!_next/|favicon|.*\\..*).*)'],
};
