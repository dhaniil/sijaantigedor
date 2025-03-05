import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
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
