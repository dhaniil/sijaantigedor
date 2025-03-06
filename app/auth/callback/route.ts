import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth exchange error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
    }

    if (!data.session?.provider_token) {
      console.error('No provider token in session')
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=missing_provider_token`)
    }

    // Test the token immediately to ensure it works
    const testResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { 
        Authorization: `Bearer ${data.session.provider_token}`
      }
    })

    if (!testResponse.ok) {
      console.error('Token validation failed:', await testResponse.text())
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=token_validation_failed`)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
