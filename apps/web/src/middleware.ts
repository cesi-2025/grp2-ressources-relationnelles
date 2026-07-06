import { NextRequest, NextResponse } from 'next/server';
 
const ADMIN_ROLES = ['admin', 'super_admin', 'moderator'];
const CITIZEN_ROLES = ['citizen'];

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ADMIN_ROLES,
  '/moderation': ['moderator', 'admin', 'super_admin'],
  '/dashboard': [...CITIZEN_ROLES, ...ADMIN_ROLES],
};
 
function getRole(request: NextRequest): string | null {
  const token = request.cookies.get('sanctum_token')?.value;
  if (!token) return null;
 
  try {
    // on récupére par cookies le role
    return request.cookies.get('user_role')?.value ?? null;
  } catch {
    return null;
  }
}
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  // vérifie si la route correspont a chemin protéger
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );
 
  if (!matchedRoute) return NextResponse.next();
 
  const token = request.cookies.get('sanctum_token')?.value;
 
  // si déconnecter retoure page connection
  if (!token) {
    return NextResponse.redirect(new URL('/auth/connexion', request.url));
  }
 
  const role = request.cookies.get('user_role')?.value;
  const allowedRoles = PROTECTED_ROUTES[matchedRoute];
 
  // Si role ne corresponda pas retour page correspondant
  if (!role || !allowedRoles.includes(role)) {
    const redirect = ADMIN_ROLES.includes(role ?? '')
      ? '/admin'
      : '/dashboard';
    return NextResponse.redirect(new URL(redirect, request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/admin/:path*', '/moderation/:path*', '/dashboard/:path*'],
};
 