"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  const handleSpotifyLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: 'user-read-email playlist-read-private user-library-read'
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center mb-8">Login to Songfest</h1>
        <Button 
          className="w-full" 
          onClick={handleGithubLogin}
          variant="outline"
        >
          Continue with Github
        </Button>
        <Button 
          className="w-full" 
          onClick={handleSpotifyLogin}
          variant="outline"
        >
          Continue with Spotify
        </Button>
      </div>
    </div>
  )
}
