import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });

    if (!token) {
      // Store the original URL to redirect back after login
      const from = request.nextUrl.pathname;
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', from);
      
      // Redirect to login if not authenticated
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}; 