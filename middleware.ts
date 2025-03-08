import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createClient()

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check protected routes and redirect to login if not authenticated
  const isProtectedRoute = 
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.includes('.');

  if (!user && isProtectedRoute) {
    // Redirect to login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Keep the original url for redirecting after login
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect from old sign-in and sign-up pages to the new login page
  if (
    !user && 
    (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
