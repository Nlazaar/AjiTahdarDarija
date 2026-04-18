import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/progress', '/lesson', '/review', '/practice', '/leaderboard', '/profile', '/settings', '/friends'];

/** Vérifie si un JWT (base64url) est expiré sans dépendance externe */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    // atob ne fonctionne pas dans Edge Runtime — utiliser Buffer ou décodage manuel
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'),
    );
    if (!payload.exp) return false; // pas d'expiration définie → valide
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // token malformé → considéré expiré
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Protection admin ──────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = req.cookies.get('admin_session')?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // ── Protection routes utilisateur ─────────────────────────────────────────
  if (PROTECTED.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get('jwt')?.value;
    if (!token || isTokenExpired(token)) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/progress/:path*',
    '/lesson/:path*',
    '/review/:path*',
    '/practice/:path*',
    '/leaderboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/friends/:path*',
  ],
};
