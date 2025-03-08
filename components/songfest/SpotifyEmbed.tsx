'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface SpotifyEmbedProps {
  trackId: string;
  compact?: boolean;
}

export default function SpotifyEmbed({ trackId, compact = false }: SpotifyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    // Reset loading state when trackId changes
    if (!trackId) return;
    setIsLoading(true);
    
    // Force set loading to false after a short timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [trackId]);

  const height = compact ? 80 : 352;
  
  // Create a unique key to force iframe refresh when trackId changes
  const iframeKey = `spotify-${trackId}-${resolvedTheme}-${Date.now()}`;
  
  return (
    <div ref={containerRef} className="w-full relative">
      {/* Always display the iframe */}
      <iframe
        key={iframeKey}
        src={`https://open.spotify.com/embed/track/${trackId}`}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        className="rounded-md"
        onLoad={() => setIsLoading(false)}
      ></iframe>
      
      {/* Overlay loading indicator that disappears */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md animate-pulse"
        >
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-gray-400 dark:text-gray-500">Loading Spotify Player...</span>
          </div>
        </div>
      )}
    </div>
  );
}
