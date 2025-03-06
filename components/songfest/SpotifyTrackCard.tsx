import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import { type SpotifyTrack } from "@/types/spotify"

interface SpotifyTrackCardProps {
  track: SpotifyTrack
  onClick: () => void
  selected?: boolean
}

export function SpotifyTrackCard({ track, onClick, selected }: SpotifyTrackCardProps) {
  return (
    <Card 
      className={`
        hover:bg-accent/50 transition-all duration-300 cursor-pointer group
        ${selected ? "border-primary" : "border-border"}
        hover:shadow-md hover:-translate-y-0.5
      `}
      onClick={onClick}
    >
      <CardContent className="p-3 flex gap-4">
        {/* Album Art */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <img
            src={track.album?.images?.[1]?.url || "/placeholder.jpg"}
            alt={track.name}
            className="w-full h-full rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg"
            }}
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate pr-2">{track.name}</h4>
          <p className="text-sm text-muted-foreground truncate">
            {track.artists.map(a => a.name).join(", ")}
          </p>
          <p className="text-xs text-muted-foreground/75 truncate mt-1">
            {track.album.name}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
