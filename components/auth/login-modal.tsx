"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SpotifyButton from "./spotify-button"

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SpotifyButton />
          <p className="text-center text-sm text-muted-foreground">
            Login to access exclusive features and content
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
