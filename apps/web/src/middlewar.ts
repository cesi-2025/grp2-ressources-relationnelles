import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token    = req.cookies.get('auth_token')?.value;
  const pathname = req.nextUrl.pathname;

  const isAuth   = pathname.startsWith('/auth');
  const isAdmin  = pathname.startsWith('/admin');

  if (!token && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (token && isAuth) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};