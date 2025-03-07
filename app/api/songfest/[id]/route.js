import { createClient } from '@/utils/supabase/server'

export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }

  const { data, error } = await supabase
    .from('songfests')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }

  const body = await request.json()

  const { data: songfest } = await supabase
    .from('songfests')
    .select('user_id')
    .eq('id', params.id)
    .single()

  if (!songfest || songfest.user_id !== session.user.id) {
    return new Response(JSON.stringify({ error: 'Not found or unauthorized' }), {
      status: 404,
      headers: { 'content-type': 'application/json' }
    })
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
    return new Response(JSON.stringify({ error: 'Failed to update songfest' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }

  const { data: songfest } = await supabase
    .from('songfests')
    .select('user_id')
    .eq('id', params.id)
    .single()

  if (!songfest || songfest.user_id !== session.user.id) {
    return new Response(JSON.stringify({ error: 'Not found or unauthorized' }), {
      status: 404,
      headers: { 'content-type': 'application/json' }
    })
  }

  const { error } = await supabase
    .from('songfests')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id)

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete songfest' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}
