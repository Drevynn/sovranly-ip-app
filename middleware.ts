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

  // 2. Intelligent Subdomain Routing (Production only)
  // When accessed via app.sovranlyip.com or app.savranlyip.com:
  // Visiting root '/' on the app subdomain seamlessly opens the Dashboard
  const isAppSubdomain =
    host.startsWith('app.sovranlyip.com') ||
    host.startsWith('app.savranlyip.com');

  if (isAppSubdomain && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/',
  ],
};
