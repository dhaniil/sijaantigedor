"use client"

import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"
import LoginModal from "@/components/auth/login-modal"
import ProfileMenu from "@/components/auth/profile-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const NavLinks = () => (
    <>
      <Link href="/songfest" className="text-sm font-medium transition-colors hover:text-primary">
        Songfest
      </Link>
    </>
  )

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center">
              <div className="w-48">
                <Link href="/" className="text-xl font-bold">
                  12 SIJA Antigedor
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className={`hidden md:flex items-center ml-6 space-x-6 transition-all duration-300 ease-in-out ${
                !isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
              }`}>
                <NavLinks />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              {user ? <ProfileMenu user={user} /> : <LoginModal />}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col space-y-4 py-4">
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Scrolled Menu */}
          <div 
            className={`hidden md:flex items-start transition-all duration-300 ease-in-out border-t border-border/50 ${
              isScrolled ? 'h-12 opacity-100 translate-y-0' : 'h-0 opacity-0 -translate-y-1 pointer-events-none overflow-hidden'
            }`}
          >
            <div className="flex space-x-6 ml-0 mt-3">
              <NavLinks />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
