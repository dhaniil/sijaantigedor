import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const origin = requestUrl.origin
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()
    const next = redirectTo || "/"

    // Check jika ada error dari Spotify OAuth
    const error = requestUrl.searchParams.get("error")
    const errorDescription = requestUrl.searchParams.get("error_description")

    if (error) {
      console.error("Spotify OAuth error:", error, errorDescription)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    if (!code) {
      console.error("No code present in callback")
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const cookieStore = cookies()
    const supabase = await createClient()

    // Exchange code untuk session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error("Session exchange error:", exchangeError)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    // Get session untuk verifikasi
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      console.error("Session verification error:", sessionError)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    // Verifikasi token Spotify
    if (!session.provider_token) {
      console.error("No Spotify token in session")
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      return NextResponse.redirect(`${origin}${next}`)
    }
  } catch (error) {
    console.error("Unexpected error in callback:", error)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }
}
