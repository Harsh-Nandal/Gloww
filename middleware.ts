// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value;

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/checkout') ||
    request.nextUrl.pathname.startsWith('/payment');

  // ❌ Not logged in → redirect
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 🔥 APPLY ONLY ON THESE ROUTES
export const config = {
  matcher: ['/checkout/:path*', '/payment/:path*'],
}