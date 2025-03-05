"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 500)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()
  const isDevelopment = process.env.NEXT_PUBLIC_APP_ENV === 'development'
  const [debug, setDebug] = useState<string | null>(null); // For debug info

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      if (isDevelopment) {
        setIsAuthenticated(true)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()
  }, [supabase, isDevelopment])

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return
    if (!isAuthenticated && !isDevelopment) return

    const searchTracks = async () => {
      setLoading(true)
      setError(null)
      setDebug(null)

      try {
        console.log(`Searching for "${debouncedQuery}"...`);
        const startTime = Date.now();
        
        const response = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}&type=track&limit=5`
        );
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`Search request took ${responseTime}ms`);
        
        // Log raw response details for debugging
        setDebug(`Status: ${response.status}, Time: ${responseTime}ms`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        // Try to parse the response
        let data;
        try {
          data = await response.json();
          console.log("Search results:", data);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          throw new Error("Invalid response format");
        }
        
        // Check if items exists and is an array
        if (data && data.items && Array.isArray(data.items)) {
          console.log(`Found ${data.items.length} results`);
          setResults(data.items);
          if (data.items.length === 0) {
            setDebug(prev => `${prev || ''} | No results found`);
          }
        } else {
          console.error("Unexpected response format:", data);
          setDebug(prev => `${prev || ''} | Invalid response: ${JSON.stringify(data).slice(0, 100)}...`);
          setError("Received invalid data format from server");
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(err instanceof Error ? err.message : "Failed to search tracks");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchTracks();
  }, [debouncedQuery, isAuthenticated, isDevelopment]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Cari lagu di Spotify..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading || (!isAuthenticated && !isDevelopment)}
          className="w-full"
        />
        {error && (
          <div className="text-xs text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded">
            Error: {error}
            {isDevelopment && debug && (
              <div className="mt-1 text-xs opacity-75">
                <code>{debug}</code>
              </div>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center p-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Mencari "{debouncedQuery}"...</p>
        </div>
      )}

      {/* Display results only when we have them and not loading */}
      {!loading && results.length > 0 && (
        <ul className="space-y-2 max-h-60 overflow-auto border rounded-md p-1">
          {results.map((track) => (
            <li key={track.id}>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto text-left"
                onClick={() => onTrackSelect(track)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <img
                    src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || "/placeholder.jpg"}
                    alt={track.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="text-left overflow-hidden">
                    <p className="font-medium truncate">{track.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artists?.map(a => a.name).join(", ") || "Unknown Artist"}
                    </p>
                  </div>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!loading && debouncedQuery && results.length === 0 && !error && debouncedQuery.length >= 2 && (
        <div className="text-sm text-center text-muted-foreground p-4 bg-muted rounded-md">
          <p>Tidak ada hasil untuk "{debouncedQuery}"</p>
          {isDevelopment && debug && <div className="text-xs mt-2 opacity-75">{debug}</div>}
        </div>
      )}
      
      {debouncedQuery && debouncedQuery.length < 2 && !loading && !error && (
        <p className="text-xs text-center text-muted-foreground">
          Ketikkan minimal 2 karakter untuk memulai pencarian
        </p>
      )}
    </div>
  )
}
