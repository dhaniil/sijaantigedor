import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Always verify user with getUser()
  const { data: { user }, error } = await supabase.auth.getUser()

  // Public routes
  const isPublicRoute = request.nextUrl.pathname.startsWith('/sign-in') || 
                       request.nextUrl.pathname.startsWith('/auth') ||
                       request.nextUrl.pathname === '/'

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && request.nextUrl.pathname.startsWith('/sign-in')) {
    const redirectUrl = new URL('/protected', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
