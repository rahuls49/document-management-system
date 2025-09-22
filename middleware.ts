import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Redirect away from login page if logged in
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/document-management', request.url))
  }

  // Redirect to login if not logged in and trying to access a protected page
  if (!token && (pathname.startsWith('/document-management') || pathname.startsWith('/users'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/document-management/:path*', '/users/:path*'],
}