import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAllowedOrigin } from './lib/domains';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const origin = request.headers.get('origin');

  // 1. Handle API Route Cross-Origin Requests (CORS)
  if (pathname.startsWith('/api')) {
    const isAllowed = isAllowedOrigin(origin);
    const allowOriginHeader = isAllowed && origin ? origin : '*';

    // Handle Preflight OPTIONS
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set('Access-Control-Allow-Origin', allowOriginHeader);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
      return response;
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', allowOriginHeader);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // 2. Open Access Compliance & Routing
  // The home page '/' is always 100% public across all domains and subdomains
  // without requiring authentication, allowing Google verification and users
  // to review full platform information without a login wall.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
