"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    images: Array<{ url: string }>
  }
}

interface SpotifySearchProps {
  onTrackSelect: (track: Track) => void
}

export function SpotifySearch({ onTrackSelect }: SpotifySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchTracks = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=5`)
      const data = await res.json()
      setResults(data.tracks.items)
    } catch (error) {
      console.error("Error searching tracks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Cari lagu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchTracks()}
        />
        <Button 
          onClick={searchTracks}
          disabled={isLoading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground">
          Mencari lagu...
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent rounded-md"
              onClick={() => onTrackSelect(track)}
            >
              <img
                src={track.album.images[2]?.url}
                alt={track.name}
                className="w-10 h-10 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artists.map(a => a.name).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
