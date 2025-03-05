"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Orb from "@/backgrounds/Orb/Orb"

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Orb Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        {isClient && (
          <div className="absolute inset-0 w-full h-[600px]">
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
            12 SIJA Antigedor
          </h1>
          
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground">
              Coming Soon
            </p>
            <p className="text-lg text-muted-foreground">
              Sementara itu, kirim pesan dan lagu untuk teman-temanmu di Songfest!
            </p>
          </div>

          <div className="pt-4">
            <Button asChild size="lg" className="animate-pulse hover:animate-none bg-gradient-to-r from-indigo-500 via-purple-500  text-white">
              <Link href="/songfest">
                Kirim Songfest Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
