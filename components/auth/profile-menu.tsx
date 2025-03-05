"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SongfestForm } from "@/components/songfest/SongfestForm"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ProfileMenuProps {
  user: {
    email?: string | undefined
    user_metadata: {
      avatar_url?: string
      full_name?: string
      name?: string
    }
  }
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const router = useRouter()
  const [isCreateSongfestOpen, setIsCreateSongfestOpen] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const avatarUrl = user.user_metadata.avatar_url
  const name = user.user_metadata.full_name || user.user_metadata.name || user.email

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateSongfestOpen(true)}>
            Buat Songfest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateSongfestOpen} onOpenChange={setIsCreateSongfestOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <SongfestForm onSuccess={() => {
            setIsCreateSongfestOpen(false)
            router.refresh()
          }} />
        </DialogContent>
      </Dialog>
    </>
  )
}
