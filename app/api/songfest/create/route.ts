import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sender, receiver, message, trackId } = await request.json();

    // Validasi input
    if (!sender) {
      return NextResponse.json({ error: "Sender is required" }, { status: 400 });
    }
    if (!receiver) {
      return NextResponse.json({ error: "Receiver is required" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!trackId) {
      return NextResponse.json({ error: "Track ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Periksa status autentikasi user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a songfest' },
        { status: 401 }
      );
    }

    // Simpan songfest ke database sesuai struktur tabel
    const { data, error } = await supabase
      .from('songfests')
      .insert({
        sender,
        receiver,
        message,
        track_id: trackId,
        user_id: user.id,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating songfest:', error);
      return NextResponse.json(
        { error: 'Failed to create songfest' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error in creating songfest:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
