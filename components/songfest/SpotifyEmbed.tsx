'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface SpotifyEmbedProps {
  trackId: string;
  compact?: boolean;
}

export default function SpotifyEmbed({ trackId, compact = false }: SpotifyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();
  
  // Reset loading state when trackId changes
  useEffect(() => {
    if (!trackId) return;
    setIsLoaded(false);
  }, [trackId]);

  const height = compact ? 80 : 352;
  
  // Adjust theme parameter based on current theme
  const themeParam = theme === 'dark' ? '&theme=0' : '';
  const url = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator${compact ? '&view=minimal' : ''}${themeParam}`;

  return (
    <div ref={containerRef} className="w-full">
      {!isLoaded && (
        <div 
          className="bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-md"
          style={{ height: `${height}px` }}
        >
          <span className="text-gray-400 dark:text-gray-500">Loading Spotify Player...</span>
        </div>
      )}
      <iframe
        src={url}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className={`rounded-md ${isLoaded ? 'block' : 'hidden'}`}
        onLoad={() => setIsLoaded(true)}
      ></iframe>
    </div>
  );
}
