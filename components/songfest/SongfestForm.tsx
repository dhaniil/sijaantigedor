"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SpotifySearch } from "./SpotifySearch"
import { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    images: Array<{ url: string }>
  }
}

interface SongfestFormData {
  sender: string
  receiver: string
  message: string
  trackId: string
}

interface SongfestFormProps {
  onSuccess?: () => void
}

export function SongfestForm({ onSuccess }: SongfestFormProps) {
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState<SongfestFormData>({
    sender: "",
    receiver: "",
    message: "",
    trackId: ""
  })
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session?.user) {
        setFormData(prev => ({ ...prev, sender: session.user.email || "" }))
      }
    }
    
    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        setFormData(prev => ({ ...prev, sender: session.user.email || "" }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    
    try {
      setLoading(true)
      
      const response = await fetch("/api/songfest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit songfest")
      }

      // Reset form after successful submission
      setFormData({
        sender: session?.user?.email || "",
        receiver: "",
        message: "",
        trackId: ""
      })
      setSelectedTrack(null)
      
      // Refresh page and call onSuccess if provided
      router.refresh()
      onSuccess?.()
      
    } catch (error) {
      console.error("Error submitting songfest:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Failed to submit songfest"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track)
    setFormData(prev => ({ ...prev, trackId: track.id }))
  }

  if (!session) return null

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">Kirim Songfest</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="sender" className="text-sm font-medium">
                Dari
              </label>
              <Input
                id="sender"
                value={formData.sender}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="receiver" className="text-sm font-medium">
                Untuk
              </label>
              <Input
                id="receiver"
                value={formData.receiver}
                onChange={(e) => setFormData(prev => ({ ...prev, receiver: e.target.value }))}
                placeholder="Nama penerima"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Pesan
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tulis pesanmu di sini..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pilih Lagu
            </label>
            <SpotifySearch onTrackSelect={handleTrackSelect} />
          </div>

          {selectedTrack && (
            <div className="flex items-center gap-3 p-2 bg-muted rounded-md">
              <img
                src={selectedTrack.album.images[2]?.url}
                alt={selectedTrack.name}
                className="w-10 h-10 rounded"
              />
              <div>
                <p className="text-sm font-medium">{selectedTrack.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedTrack.artists.map(a => a.name).join(", ")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Mengirim...</span>
              </div>
            ) : (
              "Kirim Songfest"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
