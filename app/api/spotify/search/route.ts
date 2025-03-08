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
    
    // Transform tracks to match UI expectations
    const transformedTracks = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artists: [{ name: track.artist }], // Convert string to expected array format
      album: {
        name: track.album,
        images: track.album_images || [] // Use album_images array
      }
    }));

    return NextResponse.json({ tracks: transformedTracks });

  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Failed to search tracks" },
      { status: 500 }
    );
  }
}
