import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type")
  const limit = searchParams.get("limit")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  // Pastikan user sudah login
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Ambil Spotify access token dari session
  const spotifyToken = session.provider_token

  if (!spotifyToken) {
    return NextResponse.json({ error: "No Spotify access token" }, { status: 401 })
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type || "track"}&limit=${limit || "5"}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search tracks" },
      { status: 500 }
    )
  }
}
