import { NextResponse } from 'next/server';

export function middleware(req) {
  const response = NextResponse.next();

  // Security Headers
  // 1. Prevent clickjacking by not allowing the page to be embedded in an iframe
  response.headers.set('X-Frame-Options', 'DENY');

  // 2. Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 3. Control how much referrer information is included with requests
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // 4. Content Security Policy (CSP) - Baseline policy
  // Note: For a real production app, this should be more granular and include specific domains for APIs (Supabase, Gemini, etc.)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com;"
  );

  // 5. Permissions Policy - Restrict access to sensitive browser features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // 6. Strict-Transport-Security (HSTS) - Force HTTPS (only applied to HTTPS responses)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
