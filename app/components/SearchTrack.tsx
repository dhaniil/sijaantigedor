"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
}

export default function SearchTrack({ onSelect }: { onSelect?: (track: Track) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const searchTracks = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.tracks || []);
    } catch (error) {
      console.error("Error searching tracks:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchTracks(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for a song..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        {/* Results container with fixed height and scroll for mobile */}
        {(results.length > 0 || loading) && (
          <div 
            ref={resultsContainerRef}
            className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg overflow-y-auto max-h-60 md:max-h-96"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : (
              results.map((track) => (
                <div 
                  key={track.id}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelect && onSelect(track)}
                >
                  {track.imageUrl && (
                    <img src={track.imageUrl} alt={track.album} className="w-12 h-12 object-cover rounded mr-3" />
                  )}
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
