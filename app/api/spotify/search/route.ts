import { NextResponse } from "next/server";
import { searchTracks } from "@/utils/spotify/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });  
    }

    const tracks = await searchTracks(query);

    return NextResponse.json({ tracks });

  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Failed to search tracks" },
      { status: 500 }
    );
  }
}
