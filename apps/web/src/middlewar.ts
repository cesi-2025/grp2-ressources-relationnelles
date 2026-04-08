import { NextRequest, NextResponse } from 'next/server';
 
const ADMIN_ROLES = ['admin', 'super_admin', 'moderateur'];
const CITIZEN_ROLES = ['citoyen'];
 
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/administration': ADMIN_ROLES,
  '/moderation': ['moderateur', 'admin', 'super_admin'],
  '/dashboard': CITIZEN_ROLES,
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
      ? '/administration'
      : '/dashboard';
    return NextResponse.redirect(new URL(redirect, request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/administration/:path*', '/moderation/:path*', '/dashboard/:path*'],
};
 