import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/'

  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    error,
    error_description,
    next,
    origin,
    allParams: Object.fromEntries(searchParams.entries())
  })

  // Handle OAuth provider errors
  if (error) {
    console.error('OAuth provider error:', {
      error,
      description: error_description
    })
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(error_description || error)}`
    )
  }

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

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth exchange error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        })
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            'Gagal menukar kode autentikasi: ' + error.message
          )}`
        )
      }

      if (!data.session) {
        console.error('No session data received')
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            'Gagal membuat sesi: Tidak ada data sesi diterima'
          )}`
        )
      }

      console.log('Session data received:', {
        hasProviderToken: !!data.session.provider_token,
        provider: data.session.user?.app_metadata?.provider,
        userId: data.session.user?.id,
        email: data.session.user?.email
      })

      if (!data.session?.provider_token) {
        console.error('No provider token in session')
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(
            'Gagal mendapatkan token akses Spotify. Pastikan Anda mengizinkan akses yang diperlukan.'
          )}`
        )
      }

      return NextResponse.redirect(`${origin}${next}`)
    } catch (e) {
      console.error('Unexpected error during auth exchange:', e)
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent(
          'Terjadi kesalahan yang tidak terduga saat proses autentikasi'
        )}`
      )
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent(
      'Tidak ada kode autentikasi diterima dari Spotify'
    )}`
  )
}
