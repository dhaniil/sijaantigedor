"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SongfestForm } from "@/components/songfest/SongfestForm"
import { SongCard } from "@/components/songfest/SongCard"
import LoginModal from "@/components/auth/login-modal"
import { Session } from "@supabase/supabase-js"

interface Songfest {
  id: string
  sender: string
  receiver: string
  message: string
  track_id: string
  created_at: string
}

export default function SongfestPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [songfests, setSongfests] = useState<Songfest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const isDevelopment = process.env.NEXT_PUBLIC_APP_ENV === 'development'

  useEffect(() => {
    // Fetch session dan setup auth listener
    const fetchSession = async () => {
      try {
        // Skip session check in development mode
        if (!isDevelopment) {
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          setSession(currentSession)
        }

        // Fetch songfests jika sudah login atau dalam development mode
        if (isDevelopment || session) {
          const { data, error } = await supabase
            .from("songfests")
            .select("*")
            .order("created_at", { ascending: false })

          if (error) throw error
          setSongfests(data || [])
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    // Setup auth state change listener (skip in development)
    if (!isDevelopment) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        if (session) {
          // Refresh songfests when logged in
          supabase
            .from("songfests")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
              if (!error && data) {
                setSongfests(data)
              }
            })
        } else {
          // Clear songfests when logged out
          setSongfests([])
        }
      })

      // Cleanup subscription
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [supabase, isDevelopment, session])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-12">
        {session || isDevelopment ? (
          <SongfestForm isDevelopment={isDevelopment} />
        ) : (
          <div className="text-center space-y-4 max-w-lg mx-auto p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold">Ingin mengirim Songfest?</h2>
            <p className="text-muted-foreground">
              Login dengan Spotify untuk mulai mengirim pesan dan lagu ke teman-temanmu.
            </p>
            <LoginModal redirectPath="/songfest" />
          </div>
        )}
      </div>

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
