/**
 * Domain & URL Configuration for Sovranly IP
 * Handles routing between public marketing pages and the web app subdomain.
 */

export const DOMAIN_CONFIG = {
  // Public Marketing Site (Landing, About, Wiki, Privacy, Pricing)
  publicUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://savranlyip.com',
  // Sovereign App / Console (Dashboard, Licenses, Onboarding, Developer)
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.sovranlyip.com',
  // Whitelisted origins for CORS and multi-tenant security
  allowedOrigins: [
    'https://savranlyip.com',
    'https://www.savranlyip.com',
    'https://app.savranlyip.com',
    'https://sovranlyip.com',
    'https://www.sovranlyip.com',
    'https://app.sovranlyip.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
};

/**
 * Returns true if the given origin is permitted for cross-origin API access.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  // Allow all local dev and Cloud Run preview domains
  if (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('.run.app')
  ) {
    return true;
  }
  return DOMAIN_CONFIG.allowedOrigins.some((allowed) =>
    origin.toLowerCase().startsWith(allowed.toLowerCase())
  );
}

/**
 * Dynamic link helper: returns an absolute URL to the App subdomain if in production,
 * or a relative path in local development and AI Studio preview.
 */
export function getAppRoute(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // In dev / preview environments, use relative links
    if (host.includes('localhost') || host.includes('run.app')) {
      return cleanPath;
    }
  }
  // When running across separate subdomains in production
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}${cleanPath}`;
  }
  return cleanPath;
}

/**
 * Dynamic link helper: returns the public marketing site URL.
 */
export function getPublicRoute(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('localhost') || host.includes('run.app')) {
      return cleanPath;
    }
  }
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}${cleanPath}`;
  }
  return cleanPath;
}
