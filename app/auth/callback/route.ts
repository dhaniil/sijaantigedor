import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const cookieStore = cookies()
  
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          return response
        },
      },
    }
  )

  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const { data: { session }, error: exchangeError } = 
        await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError || !session) {
        console.error('Exchange error:', exchangeError)
        return NextResponse.redirect(
          new URL('/sign-in?error=Exchange+failed', requestUrl.origin)
        )
      }

      // Return response with cookies
      const redirectResponse = NextResponse.redirect(
        new URL('/protected', requestUrl.origin)
      )

      // Copy all cookies from response to redirectResponse
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options)
      })

      return redirectResponse

    } catch (error) {
      console.error('Error:', error)
      return NextResponse.redirect(
        new URL('/sign-in?error=Authentication+failed', requestUrl.origin)
      )
    }
  }

  return NextResponse.redirect(new URL('/sign-in', requestUrl.origin))
}
