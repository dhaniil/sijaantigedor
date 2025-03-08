'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SongfestCard } from '@/types/songfest';
import SpotifyEmbed from '@/components/songfest/SpotifyEmbed';

interface SongfestCardProps {
  songfest: SongfestCard;
  isNew?: boolean;
}

export default function SongfestCardComponent({ songfest, isNew = false }: SongfestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(isNew);
  
  // Format tanggal sederhana
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'hari ini';
      } else if (diffDays === 1) {
        return 'kemarin';
      } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} minggu yang lalu`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} bulan yang lalu`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} tahun yang lalu`;
      }
    } catch (e) {
      return 'tanggal tidak valid';
    }
  };
  
  const formattedDate = formatDate(songfest.created_at);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isNew) {
      timer = setTimeout(() => {
        setShowNewBadge(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isNew]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border 
      ${isNew ? 'border-blue-300 dark:border-blue-700 animate-pulse-light' : 'border-gray-100 dark:border-gray-700'}
      transition-all duration-300 ease-in-out`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold truncate text-gray-800 dark:text-gray-200">
            {songfest.sender} → {songfest.receiver}
          </h2>
          
          {showNewBadge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Baru
            </span>
          )}
        </div>
        
        <blockquote className="text-gray-600 dark:text-gray-300 text-sm mb-4 italic border-l-4 border-gray-300 dark:border-gray-600 pl-4">
          "{songfest.message}"
        </blockquote>
        
        <div className="mb-4">
          <SpotifyEmbed 
            trackId={songfest.track_id}
            compact={!isExpanded}
          />
        </div>
        
        <div className="flex justify-between items-center">
          
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
