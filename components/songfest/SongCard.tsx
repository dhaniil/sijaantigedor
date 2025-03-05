import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface SongCardProps {
  sender: string
  receiver: string
  message: string
  trackId: string
}

export function SongCard({ sender, receiver, message, trackId }: SongCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Dari: {sender}</span>
          <span>Untuk: {receiver}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{message}</p>
      </CardContent>
      <CardFooter>
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          className="rounded-md"
        />
      </CardFooter>
    </Card>
  )
}
