import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/progress', '/lesson', '/review', '/practice', '/leaderboard', '/profile', '/settings', '/friends'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PROTECTED.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get('jwt')?.value;
    if (!token) {
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
