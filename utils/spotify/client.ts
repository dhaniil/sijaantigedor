interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    next: string | null;
    total: number;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  uri: string;
  duration_ms: number;
}

// Cache the token to avoid requesting it too frequently
let tokenCache: {
  token: string;
  expiry: number;
} | null = null;

// Use client credentials flow instead of OAuth
async function getAccessToken(): Promise<string> {
  // Return cached token if it's still valid
  if (tokenCache && tokenCache.expiry > Date.now()) {
    return tokenCache.token;
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify credentials');
    throw new Error('Spotify credentials not configured properly');
  }

  try {
    // Get new token using client credentials flow (no OAuth)
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBuffer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get Spotify access token: ${response.status}`);
    }

    const data: SpotifyTokenResponse = await response.json();
    
    // Cache the token
    tokenCache = {
      token: data.access_token,
      expiry: Date.now() + (data.expires_in * 1000 * 0.9), // 90% of expiry time for safety margin
    };
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

export async function searchTracks(query: string, limit = 10): Promise<SpotifyTrack[]> {
  if (!query) return [];
  
  try {
    const token = await getAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pencarian Spotify gagal: ${response.status}`);
    }
    
    const data: SpotifySearchResponse = await response.json();
    
    if (!data || !data.tracks || !Array.isArray(data.tracks.items)) {
      return [];
    }
    
    return data.tracks.items.map(item => ({
      id: item.id || '',
      name: item.name || '',
      artists: Array.isArray(item.artists) ? item.artists.map(artist => ({
        name: artist.name || ''
      })) : [],
      album: {
        name: item.album?.name || '',
        images: Array.isArray(item.album?.images) ? item.album.images.map(img => ({
          url: img.url || '',
          height: img.height || 0,
          width: img.width || 0
        })) : []
      },
      uri: item.uri || '',
      duration_ms: item.duration_ms || 0
    }));
  } catch (error) {
    console.error('Error pencarian track Spotify:', error);
    return [];
  }
}

// Function to get track details by ID
export async function getTrackById(trackId: string): Promise<SpotifyTrack | null> {
  if (!trackId) return null;
  
  try {
    const token = await getAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get track: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      artists: data.artists.map((artist: any) => ({ name: artist.name })),
      album: {
        name: data.album.name,
        images: data.album.images
      },
      uri: data.uri,
      duration_ms: data.duration_ms
    };
  } catch (error) {
    console.error('Error getting track from Spotify:', error);
    return null;
  }
}
