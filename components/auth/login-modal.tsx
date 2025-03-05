"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SpotifyButton from "./spotify-button"
import GitHubButton from "./github-button"

type LoginModalProps = {
  redirectPath?: string;
}

export default function LoginModal({ redirectPath }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selamat Datang!</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SpotifyButton redirectPath={redirectPath} />
            <GitHubButton />
          <p className="text-center text-sm text-muted-foreground">
            Login untuk memeriahkan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
