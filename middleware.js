import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith('/dashboard') || 
    req.nextUrl.pathname.startsWith('/campaigns') || 
    req.nextUrl.pathname.startsWith('/campaign/') ||
    req.nextUrl.pathname.startsWith('/settings') || 
    req.nextUrl.pathname.startsWith('/billing')

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/campaigns/:path*', 
    '/campaign/:path*',
    '/settings/:path*', 
    '/billing/:path*',
    '/login',
    '/signup'
  ]
}
