import { NextResponse } from 'next/server' 

export function middleware(req) { 
  return NextResponse.next() 
} 

export const config = { 
  matcher: ['/dashboard/:path*', '/campaigns/:path*', '/settings/:path*', '/billing/:path*'] 
}
