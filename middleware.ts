import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  const isLoggedIn = !!token

  // Protected routes that require authentication
  const protectedRoutes = ['/document-management', '/users']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  // If trying to access protected route without login, redirect to login
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If logged in and on login page, redirect to dashboard
  if (pathname === '/' && isLoggedIn) {
    return NextResponse.redirect(new URL('/document-management', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}