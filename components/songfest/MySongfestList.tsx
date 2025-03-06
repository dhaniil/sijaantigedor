"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { SongfestForm } from "./SongfestForm"

interface Songfest {
  id: string
  created_at: string
  sender: string
  receiver: string
  message: string
  track_id: string
}

export function MySongfestList() {
  const [songfests, setSongfests] = useState<Songfest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingSongfest, setEditingSongfest] = useState<Songfest | null>(null)
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  // Fetch songfests on mount
  useEffect(() => {
    fetchSongfests()
  }, [])

  const fetchSongfests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/mysongfest')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch songfests')
      }
      
      const { songfests: data } = await response.json()
      setSongfests(data)
    } catch (error) {
      console.error('Error fetching songfests:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch songfests')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/mysongfest?id=${deleteId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete songfest')
      }

      // Remove from local state
      setSongfests(current => current.filter(sf => sf.id !== deleteId))
      setDeleteId(null)
      router.refresh() // Refresh server components
    } catch (error) {
      console.error('Error deleting songfest:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete songfest')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="mt-2 text-muted-foreground">Loading your songfests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Error: {error}</p>
        <Button
          onClick={() => fetchSongfests()}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (songfests.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">You haven't created any songfests yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      {songfests.map((songfest) => (
        <Card 
          key={songfest.id} 
          className="p-4 bg-gradient-to-br from-background via-background to-muted shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20"
        >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Dari</span>
                  <span className="px-3 py-1 text-sm bg-primary/10 rounded-full text-primary">
                    {songfest.sender}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Untuk</span>
                  <span className="px-3 py-1 text-sm bg-primary/10 rounded-full text-primary">
                    {songfest.receiver}
                  </span>
                </div>
              </div>

              <div className="relative">
                <blockquote className="pl-4 border-l-2 border-primary italic text-muted-foreground">
                  "{songfest.message}"
                </blockquote>
                <div className="absolute -left-[2px] top-0 h-full w-[2px] bg-gradient-to-b from-primary/50 to-primary/0" />
              </div>

              {/* Spotify Player */}
              <div className="relative">
                <iframe
                  key={`${songfest.id}-${resolvedTheme}`}
                  src={`https://open.spotify.com/embed/track/${songfest.track_id}?utm_source=generator&theme=${resolvedTheme === 'dark' ? '0' : '1'}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-md transition-all duration-300"
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(songfest.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSongfest(songfest)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(songfest.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
        </Card>
      ))}

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Songfest</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this songfest? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={!!editingSongfest} 
        onOpenChange={(open) => !open && setEditingSongfest(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Songfest</DialogTitle>
          </DialogHeader>
          {editingSongfest && (
            <SongfestForm
              mode="edit"
              initialData={{
                id: editingSongfest.id,
                sender: editingSongfest.sender,
                receiver: editingSongfest.receiver,
                message: editingSongfest.message,
                track_id: editingSongfest.track_id
              }}
              onSuccess={() => {
                setEditingSongfest(null)
                fetchSongfests()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
