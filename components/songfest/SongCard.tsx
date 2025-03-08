"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface SongCardProps {
  sender: string
  receiver: string
  message: string
  trackId: string
}

interface TrackInfo {
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
}

export function SongCard({ sender, receiver, message, trackId }: SongCardProps) {
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        // Fetch track info from Spotify API through our API endpoint
        const res = await fetch(`/api/spotify/track?id=${trackId}`)
        
        if (!res.ok) {
          throw new Error("Failed to fetch track")
        }
        
        const data = await res.json()
        setTrackInfo(data)
      } catch (error) {
        console.error("Error fetching track:", error)
      } finally {
        setLoading(false)
      }
    }

    if (trackId) {
      fetchTrackInfo()
    }
  }, [trackId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col animate-pulse">
        <div className="bg-gray-200 h-32 w-32 rounded-md self-center mb-4"></div>
        <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
        <div className="bg-gray-200 h-16 w-full rounded"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      {trackInfo && trackInfo.album.images[0] && (
        <div className="mb-4 self-center">
          <Image
            src={trackInfo.album.images[0].url}
            alt={trackInfo.name}
            width={128}
            height={128}
            className="rounded-md"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">
        {trackInfo ? trackInfo.name : "Unknown Track"}
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        {trackInfo
          ? trackInfo.artists.map((a) => a.name).join(", ")
          : "Unknown Artist"}
      </p>
      <p className="text-sm text-gray-700 italic mb-2">"{message}"</p>
      <div className="mt-auto text-xs text-gray-500">
        From {sender} to {receiver}
      </div>
    </div>
  )
}
