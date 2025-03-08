"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SpotifySearch } from "./SpotifySearch"
import { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

// Fix the import to use the correct type
interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
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
  initialData?: {
    id: string
    sender: string
    receiver: string
    message: string
    track_id: string
  }
  mode?: 'create' | 'edit'
}

export function SongfestForm({ onSuccess, initialData, mode = 'create' }: SongfestFormProps) {
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState<SongfestFormData>({
    sender: initialData?.sender || "",
    receiver: initialData?.receiver || "",
    message: initialData?.message || "",
    trackId: initialData?.track_id || ""
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
    }
    
    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
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
      
      const response = await fetch(`/api/songfest${initialData ? `/${initialData.id}` : ''}`, {
        method: mode === 'create' ? "POST" : "PATCH",
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
        sender: "",
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
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="sender" className="text-sm font-medium">
                Dari
              </label>
              <Input
                id="sender"
                value={formData.sender}
                onChange={(e) => setFormData(prev => ({ ...prev, sender: e.target.value }))}
                placeholder="Nama pengirim"
                required
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
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                {selectedTrack.album?.images && selectedTrack.album.images.length > 0 ? (
                  <img
                    src={selectedTrack.album.images[0].url}
                    alt={selectedTrack.name}
                    className="w-full h-full object-cover"
                    loading="eager" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Try with no-cors as fallback
                      fetch(selectedTrack.album.images[0].url, { mode: 'no-cors' })
                        .catch(() => {/* Silently handle error */});
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{selectedTrack.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Array.isArray(selectedTrack.artists) && selectedTrack.artists.length > 0 
                    ? selectedTrack.artists.map(a => a.name).join(", ")
                    : "Unknown Artist"}
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
              mode === 'create' ? "Kirim Songfest" : "Update Songfest"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
