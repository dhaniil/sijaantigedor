import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getTrackById } from '@/utils/spotify/client';

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in again" },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { sender, receiver, message, trackId } = body

    console.log("Received songfest submission:", { sender, receiver, message, trackId });

    // Validate required fields
    if (!sender) {
      return NextResponse.json({ error: "Sender is required" }, { status: 400 })
    }
    if (!receiver) {
      return NextResponse.json({ error: "Receiver is required" }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    if (!trackId) {
      return NextResponse.json({ error: "No track selected" }, { status: 400 })
    }

    // Insert into songfests table
    const { data, error } = await supabase
      .from("songfests")
      .insert([
        {
          sender,
          receiver,
          message,
          track_id: trackId,
          user_id: session.user.id
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}

// Fix the issue where we might be trying to access length on an undefined value
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    
    // Get all songfests
    const { data: songfests, error } = await supabase
      .from('songfests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message, results: [] }, { status: 500 });
    }

    // Ensure songfests is always an array
    const songfestsArray = Array.isArray(songfests) ? songfests : [];
    
    if (songfestsArray.length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    // Process track data
    try {
      // Collect unique track IDs using Array.filter for better compatibility
      const trackIds = songfestsArray
        .map(item => item.track_id)
        .filter((value, index, self) => self.indexOf(value) === index);
      
      // Get track data using our utility
      const trackPromises = trackIds.map(async (trackId) => {
        try {
          const track = await getTrackById(trackId);
          return { id: trackId, track };
        } catch (error) {
          console.error(`Error fetching track ${trackId}:`, error);
          return { id: trackId, track: null };
        }
      });
      
      const trackResults = await Promise.all(trackPromises);
      
      // Create map of track_id to track data
      const trackMap = new Map();
      trackResults.forEach(result => {
        trackMap.set(result.id, result.track);
      });
      
      // Update track data in songfests
      songfestsArray.forEach(songfest => {
        if (trackMap.has(songfest.track_id)) {
          songfest.track = trackMap.get(songfest.track_id);
        }
      });
    } catch (error) {
      console.error('Error fetching track data from Spotify:', error);
    }

    return NextResponse.json({ results: songfestsArray }, { status: 200 });
  } catch (error) {
    console.error('Error in songfests API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error', results: [] },
      { status: 500 }
    );
  }
}

// Helper function to get Spotify token
async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

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
    throw new Error('Failed to get Spotify token');
  }
  
  const data = await response.json();
  return data.access_token;
}
