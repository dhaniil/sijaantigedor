"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
}

interface SpotifySearchProps {
  onTrackSelect: (track: Track) => void
}

export function SpotifySearch({ onTrackSelect }: SpotifySearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultsContainerRef.current && !resultsContainerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Effect for searching when the debounced search term changes
  useEffect(() => {
    const searchSpotify = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResults([])
        setError(null)
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to search tracks")
        }
        
        setSearchResults(data.tracks || [])
        setShowResults(true)
      } catch (error) {
        console.error("Error searching tracks:", error)
        setError("Error searching tracks. Please try again.")
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    if (debouncedSearchTerm) {
      searchSpotify()
    }
  }, [debouncedSearchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value) {
      setShowResults(true)
    }
  }

  const handleTrackSelect = (track: Track) => {
    onTrackSelect(track)
    setSearchTerm("")
    setSearchResults([])
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Cari lagu di Spotify..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm && setShowResults(true)}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
      
      {showResults && (
        <div 
          ref={resultsContainerRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-popover border rounded-md shadow-md custom-scrollbar"
        >
          {error && (
            <div className="p-2 text-sm text-red-500">
              {error}
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Mencari lagu...</p>
              </div>
            </div>
          )}
          
          {!error && !isLoading && searchResults.length === 0 && searchTerm && (
            <div className="p-4 text-sm text-center text-muted-foreground">
              <p>Tidak ada lagu yang ditemukan untuk</p>
              <p className="font-medium">"{searchTerm}"</p>
            </div>
          )}
          
          {!isLoading && searchResults.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleTrackSelect(track)}
            >
              <div className="w-10 h-10 overflow-hidden rounded bg-muted flex-shrink-0">
                {track.album && track.album.images && track.album.images.length > 0 ? (
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {Array.isArray(track.artists) && track.artists.length > 0 
                    ? track.artists.map(a => a.name).join(", ")
                    : "Unknown Artist"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
