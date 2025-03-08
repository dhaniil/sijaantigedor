'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { SpotifyTrack } from '@/utils/spotify/client';

interface SpotifySearchProps {
  onTrackSelect: (track: SpotifyTrack) => void;
}

export function SpotifySearch({ onTrackSelect }: SpotifySearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Untuk pengembangan
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return;

    const searchTracks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}`);
        
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          setError('Failed to parse server response');
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          setError(data.error || 'Search failed');
          setResults([]);
        } else if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
          setError(null);
        } else if (data.tracks && Array.isArray(data.tracks)) {
          setResults(data.tracks);
          setError(null);
        } else {
          console.error("Unexpected response format:", data);
          setError("Received invalid data format from server");
          setResults([]);
        }
      } catch (err: any) {
        console.error("Search error:", err);
        setError(err.message || 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchTracks();
  }, [debouncedQuery]);

  return (
    <div className="spotify-search">
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari lagu..."
          className="w-full p-2 border rounded-md bg-white dark:bg-black"
        />
      </div>
      
      {loading && <div className="mt-4">Loading...</div>}
      {error && <div className="mt-2 text-red-500">{error}</div>}
      
      <div className="mt-4 relative">
        <ul className="space-y-2 max-h-60 md:max-h-96 overflow-y-auto pr-1 custom-scrollbar">
          {results.map((track) => (
            <li
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className="flex gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              {track.album?.images?.[0]?.url ? (
                <img
                  src={track.album.images[0].url}
                  alt="Album art"
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div>
                <div className="font-medium">{track.name}</div>
                <div className="text-sm text-gray-600">
                  {track.artists?.map(artist => artist.name).join(", ")}
                </div>
              </div>
            </li>
          ))}
          {!loading && results.length === 0 && debouncedQuery && (
            <li className="text-center text-gray-500 p-4">No tracks found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
