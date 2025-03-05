"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { SongCard } from "@/components/songfest/SongCard"

interface Songfest {
  id: string
  sender: string
  receiver: string
  message: string
  track_id: string
  created_at: string
}

export default function SongfestPage() {
  const [songfests, setSongfests] = useState<Songfest[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchSongfests = async () => {
      try {
        const { data, error } = await supabase
          .from("songfests")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setSongfests(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSongfests()

    // Subscribe to changes
    const channel = supabase
      .channel('songfests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songfests' }, () => {
        fetchSongfests()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Songfest</h1>
      {songfests && songfests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songfests.map((songfest) => (
            <SongCard
              key={songfest.id}
              sender={songfest.sender}
              receiver={songfest.receiver}
              message={songfest.message}
              trackId={songfest.track_id}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Belum ada kiriman Songfest.
        </p>
      )}
    </main>
  )
}
