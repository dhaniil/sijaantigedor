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

    if (code) {
      const cookieStore = cookies()
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Auth error:", error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      // Successful authentication
      return NextResponse.redirect(`${origin}${next}`)
    }

    // No code present, redirect to error page
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }
}
