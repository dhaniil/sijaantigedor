import { NextResponse } from "next/server"
import { getSpotifyToken } from "@/services/spotify-auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "track"
  const limit = searchParams.get("limit") || "10"

  // console.log(`Search request: q=${query}, type=${type}, limit=${limit}`);

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  try {
    const { token, error } = await getSpotifyToken()
    
    if (!token) {
      console.error("Spotify auth error:", error)
      return NextResponse.json({ error }, { status: 401 })
    }

    // Log token (hanya 20 karakter pertama untuk keamanan)
    // console.log('Spotify Bearer Token:', token.slice(0, 20) + '...');

    // Format search parameter string
    const spotifySearchParams = new URLSearchParams({
      q: query,
      type: type,
      limit: limit,
      market: 'ID'
    }).toString();
    
    // console.log(`Making Spotify API call: https://api.spotify.com/v1/search?${spotifySearchParams}`);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${spotifySearchParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify API error (${response.status}): ${errorText}`);
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Detailed logging to help debug
    // console.log(`Spotify API response code: ${response.status}`);
    // console.log(`Response has tracks: ${!!data.tracks}`);
    // if (data.tracks) {
    //   console.log(`Found ${data.tracks.items?.length || 0} tracks`);
    //   console.log(`First track:`, data.tracks.items?.[0] ? {
    //     id: data.tracks.items[0].id,
    //     name: data.tracks.items[0].name,
    //     artist: data.tracks.items[0].artists?.[0]?.name || 'Unknown'
    //   } : 'None');
    // }
    
    if (!data.tracks || !Array.isArray(data.tracks.items)) {
      console.error("Unexpected Spotify API response format:", JSON.stringify(data).slice(0, 200) + "...");
      // Return empty results instead of throwing an error
      return NextResponse.json({ items: [] });
    }
    
    return NextResponse.json({
      items: data.tracks.items
    });
  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search tracks", items: [] },
      { status: 500 }
    );
  }
}
