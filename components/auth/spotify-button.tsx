"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"

type SpotifyButtonProps = {
  redirectPath?: string;
}

export default function SpotifyButton({ redirectPath }: SpotifyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      
      // Menggunakan NEXT_PUBLIC_SITE_URL jika tersedia, atau fallback ke window.location.origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const currentPath = redirectPath || window.location.pathname
      const redirectTo = `${siteUrl}/auth/callback?redirect_to=${currentPath}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo,
          scopes: "user-read-email user-read-private streaming user-library-read",
          queryParams: {
            code_challenge_method: 'S256',
          }
        },
      })

      if (error) {
        console.error("Login error:", error.message)
        throw error
      }
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
    >
      {isLoading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
          />
        </svg>
      )}
      {isLoading ? "Connecting..." : "Continue with Spotify"}
    </Button>
  )
}
