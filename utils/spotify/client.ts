import { Track } from "@/types/track";

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
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  uri: string;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

async function getAccessToken(): Promise<string> {
  // Return existing token if it's still valid
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify credentials');
    throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in environment variables');
  }

  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + (data.expires_in - 300) * 1000;

    if (!accessToken) throw new Error('Failed to obtain access token');
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw new Error(`Failed to authenticate with Spotify: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function searchTracks(query: string): Promise<Track[]> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data: SpotifySearchResponse = await response.json();

    return data.tracks.items.map((track: SpotifyTrack) => {
      const images = track.album?.images || [];
      const mappedTrack: Track = {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        album: track.album?.name || 'Unknown Album',
        albumArt: images[0]?.url || images[1]?.url || undefined,
        album_images: images,
        duration: track.duration_ms,
        previewUrl: track.preview_url,
        externalUrl: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`
      };
      return mappedTrack;
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
}

export async function getTrackById(id: string): Promise<Track | null> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const track: SpotifyTrack = await response.json();

    const images = track.album?.images || [];
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album?.name || 'Unknown Album',
      albumArt: images[0]?.url || images[1]?.url || undefined,
      album_images: images,
      duration: track.duration_ms,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`
    };
  } catch (error) {
    console.error('Error fetching track:', error);
    return null;
  }
}
