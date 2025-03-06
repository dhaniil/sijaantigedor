import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function PATCH(req, { params }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Verify ownership before updating
    const { data: songfest } = await supabase
      .from('songfests')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!songfest || songfest.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('songfests')
      .update({
        sender: body.sender,
        receiver: body.receiver,
        message: body.message,
        track_id: body.trackId
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error updating songfest:', error)
      return NextResponse.json(
        { error: 'Failed to update songfest' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Fixed GET function with correct type definitions
export async function GET(req, { params }) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('songfests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
