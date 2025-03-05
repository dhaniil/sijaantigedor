import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Sample data for development mode
const SAMPLE_TRACKS = [
  {
    id: "sample1",
    name: "Avicii - Wake Me Up",
    artists: [{ name: "Avicii" }],
    album: { 
      name: "True",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }
      ] 
    }
  },
  {
    id: "sample2",
    name: "Martin Garrix - Animals",
    artists: [{ name: "Martin Garrix" }],
    album: { 
      name: "Animals",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273a91c33ae5588f47c0d3624c4" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273a91c33ae5588f47c0d3624c4" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273a91c33ae5588f47c0d3624c4" }
      ] 
    }
  },
  {
    id: "sample3",
    name: "David Guetta - Titanium ft. Sia",
    artists: [{ name: "David Guetta" }, { name: "Sia" }],
    album: { 
      name: "Nothing but the Beat",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }
      ] 
    }
  },
  {
    id: "sample4",
    name: "Lilas - French song",
    artists: [{ name: "French Artist" }],
    album: { 
      name: "French Album",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }
      ] 
    }
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "track"
  const limit = searchParams.get("limit") || "10"
  const isDevelopment = process.env.NEXT_PUBLIC_APP_ENV === 'development'

  console.log(`Search request: q=${query}, type=${type}, limit=${limit}, dev=${isDevelopment}`);

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  // Return mock data in development mode
  if (isDevelopment) {
    console.log("Development mode: returning sample tracks for query:", query);
    
    // Filter sample tracks based on the query
    const filteredTracks = SAMPLE_TRACKS.filter(track => 
      track.name.toLowerCase().includes(query.toLowerCase()) ||
      track.artists.some(a => a.name.toLowerCase().includes(query.toLowerCase()))
    );
    
    console.log(`Found ${filteredTracks.length} sample tracks matching "${query}"`);
    
    // Return in the same format as the Spotify API's tracks.items
    return NextResponse.json({
      items: filteredTracks
    });
  }

  // For production, use real Spotify API
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      console.error("No session found in Spotify search");
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 })
    }

    const spotifyToken = session.provider_token
    if (!spotifyToken) {
      console.error("No Spotify token found in session");
      return NextResponse.json({ error: "No Spotify access token" }, { status: 401 })
    }

    // Correctly format search parameter string
    const spotifySearchParams = new URLSearchParams({
      q: query,
      type: type,
      limit: limit,
      market: 'ID'
    }).toString();
    
    console.log(`Making Spotify API call: https://api.spotify.com/v1/search?${spotifySearchParams}`);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${spotifySearchParams}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
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
    console.log(`Spotify API response code: ${response.status}`);
    console.log(`Response has tracks: ${!!data.tracks}`);
    if (data.tracks) {
      console.log(`Found ${data.tracks.items?.length || 0} tracks`);
      console.log(`First track:`, data.tracks.items?.[0] ? {
        id: data.tracks.items[0].id,
        name: data.tracks.items[0].name,
        artist: data.tracks.items[0].artists?.[0]?.name || 'Unknown'
      } : 'None');
    }
    
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
