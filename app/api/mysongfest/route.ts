import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function GET() {
  try {
    const supabase = await getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: songfests, error } = await supabase
      .from('songfests')
      .select()
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching songfests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch songfests' },
        { status: 500 }
      )
    }

    return NextResponse.json({ songfests })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const songfestId = searchParams.get('id')

    if (!songfestId) {
      return NextResponse.json(
        { error: 'Missing songfest ID' },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership before deletion
    const { data: songfest } = await supabase
      .from('songfests')
      .select('user_id')
      .eq('id', songfestId)
      .single()

    if (!songfest || songfest.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('songfests')
      .delete()
      .eq('id', songfestId)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error deleting songfest:', error)
      return NextResponse.json(
        { error: 'Failed to delete songfest' },
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
