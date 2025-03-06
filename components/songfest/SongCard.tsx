"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useTheme } from "next-themes"

interface SongCardProps {
  sender: string
  receiver: string
  message: string
  trackId: string
}

export function SongCard({ sender, receiver, message, trackId }: SongCardProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-background via-background to-muted shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Dari</span>
            <span className="px-3 py-1 text-sm bg-primary/10 rounded-full text-primary">
              {sender}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Untuk</span>
            <span className="px-3 py-1 text-sm bg-primary/10 rounded-full text-primary">
              {receiver}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="relative">
          <blockquote className="pl-4 border-l-2 border-primary italic text-muted-foreground">
            "{message}"
          </blockquote>
          <div className="absolute -left-[2px] top-0 h-full w-[2px] bg-gradient-to-b from-primary/50 to-primary/0" />
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <div className="w-full rounded-b-lg overflow-hidden bg-background/50">
          <iframe
            key={resolvedTheme} // Force re-render when theme changes
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=${resolvedTheme === 'dark' ? '0' : '1'}`}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-none transition-all duration-300"
          />
        </div>
      </CardFooter>
    </Card>
  )
}
