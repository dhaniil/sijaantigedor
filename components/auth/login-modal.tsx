"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import GitHubButton from "./github-button"
import GoogleButton from "./google-button"
import DiscordButton from "./discord-button"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export default function LoginModal({ isOpen, onClose, redirectPath }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selamat Datang!</DialogTitle>
          <DialogDescription>
            Login untuk mengakses semua fitur
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <GitHubButton redirectPath={redirectPath} />
            <GoogleButton redirectPath={redirectPath} />
            <DiscordButton redirectPath={redirectPath} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
