import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/progress', '/lesson', '/profile', '/review', '/settings']

export function middleware(req: NextRequest) {
  // Contournement temporaire en mode développement pour tester l'UI sans compte
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  const { pathname } = req.nextUrl
  // only check protected paths
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get('jwt')?.value || null
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'

      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/progress/:path*', '/lesson/:path*', '/profile/:path*', '/review/:path*', '/settings/:path*'],
}
