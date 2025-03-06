import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface SpotifyAuthResponse {
  token: string | null
  error?: string
}

async function refreshSpotifyToken(supabase: any): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    if (error) {
      console.error('Session refresh error:', error)
      return null
    }
    return session?.provider_token || null
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

async function verifySpotifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.status !== 401
  } catch (error) {
    console.error('Token verification error:', error)
    return false
  }
}

export async function getSpotifyToken(): Promise<SpotifyAuthResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return {
        token: null,
        error: 'No active session'
      }
    }

    // Check if user logged in with Spotify
    if (session.user?.app_metadata?.provider !== 'spotify') {
      return {
        token: null,
        error: 'Please login with Spotify to search tracks'
      }
    }

    // Check for provider token
    if (!session.provider_token) {
      return {
        token: null,
        error: 'No Spotify access token available'
      }
    }

    // Verify token and refresh if needed
    let currentToken = session.provider_token
    const isValid = await verifySpotifyToken(currentToken)
    
    if (!isValid) {
      console.log('Token expired, attempting refresh...')
      const newToken = await refreshSpotifyToken(supabase)
      if (newToken) {
        currentToken = newToken
      } else {
        return {
          token: null,
          error: 'Failed to refresh Spotify token'
        }
      }
    }

    return {
      token: currentToken
    }
  } catch (error) {
    console.error('Error getting Spotify token:', error)
    return {
      token: null,
      error: 'Failed to get Spotify token'
    }
  }
}
