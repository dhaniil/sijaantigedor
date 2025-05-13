"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Squares from "@/src/blocks/Backgrounds/Squares/Squares"
import BlurText from "@/src/blocks/TextAnimations/BlurText/BlurText"
import SpotlightCard from "@/src/blocks/Components/SpotlightCard/SpotlightCard"

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  const [activeText, setActiveText] = useState(
    "Nikmati musik favoritmu sambil berbagi dengan teman-temanmu. Tambahkan lagu-lagu yang kamu suka dan lihat apa yang teman-temanmu bagikan."
  );

  const handleCardClick = (type: string) => {
    switch (type) {
      case "SONGFEST":
        setActiveText("Songfest adalah tempat kamu menemukan lagu-lagu yang sedang tren dan ikut serta dalam festival musik digital.");
        break;
      case "GALLERY":
        setActiveText("Gallery menyimpan momen-momen visual dari kegiatan dan kenangan terbaik bersama teman-temanmu.");
        break;
      case "MBG":
        setActiveText("Makan Bergizi Gratis, yang selalu di tunggu tunggu.");
        break;
    } 
  };
  
  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Orb Background */}
      <div className="absolute inset-0 -z-10">
        <Squares 
          speed={0.2} 
          squareSize={40}
          direction='down' // up, down, left, right, diagonal
          borderColor='#363636'
          hoverFillColor='#222'
        />
      </div>

      {/* Content */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl  mx-auto text-center space-y-8">
          <div className="h-screen w-full max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
            <BlurText
              text="SIJA ANTIGEDOR"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-8xl font-extrabold w-full"
            />
            <BlurText
              text="Sistem Informasi Jaringan Aplikasi #ANTIGEDOR" 
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-lg font-extralight italic text-muted-foreground w-full mt-2"
            />
          </div>
            <section className="w-full h-screen max-w-6xl space-y-6 px-4 justify-center flex flex-col">
              <h2 className="text-2xl font-bold italic text-start">
                Yang akan datang <span className="text-muted font-normal">lalu meninggalkan luka?</span>
              </h2>

      {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 roundend-md ">
                <div onClick={() => handleCardClick("SONGFEST")}>
                  <SpotlightCard className="cursor-pointer hover:scale-105 transition duration-300 bg-slate-100/10 border-slate-200/10 shadow-sm  " spotlightColor="rgb(127, 0, 255)">
                    <h3 className="font-bold text-xl">SONGFEST</h3>
                  </SpotlightCard>
                </div>
                <div onClick={() => handleCardClick("GALLERY")}>
                  <SpotlightCard className="cursor-pointer hover:scale-105 transition duration-300 bg-slate-100/10 border-slate-200/10 shadow-sm" spotlightColor="rgb(127, 0, 255)"> 
                    <h3 className="font-bold text-xl">GALLERY</h3>
                  </SpotlightCard>
                </div>
                <div onClick={() => handleCardClick("MBG")}>
                  <SpotlightCard className="cursor-pointer hover:scale-105 transition duration-300 bg-slate-100/10 border-slate-200/10 shadow-sm" spotlightColor="rgb(127, 0, 255)">
                    <h3 className="font-bold text-xl">MBG</h3>
                  </SpotlightCard>
                </div>
              </div>

      {/* Dynamic Text */}
              <p className="text-sm md:text-base max-w-2xl text-muted-foreground justify-start">{activeText}</p>
              <Button 
              asChild 
              size="lg" 
              className="animate-pulse bg-gradient-to-r from-slate-200/10 via-violet-900/10 to-slate-300/10 shadow-md"
            >
              <Link href="/songfest">
                Kirim Songfest Sekarang
              </Link>
            </Button>
            </section>
        </div>
      </div>
    </main>
  )
}
