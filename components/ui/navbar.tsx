"use client"

import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"
import LoginModal from "@/components/auth/login-modal"
import ProfileMenu from "@/components/auth/profile-menu"
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"

function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
      <Link 
        href="/" 
        className={`text-sm relative font-medium transition-colors hover:text-primary w-fit
          after:content-[''] after:absolute after:left-0 after:w-0 after:duration-300 
          after:transition-all after:-bottom-[1.5px] hover:after:w-full 
          after:border-b-2 hover:after:border-dashed after:border-black dark:after:border-white ${
            pathname === "/" ? "text-blue-500" : ""
          }`}
      >
        Home
      </Link>
      <Link 
        href="/songfest" 
        className={`text-sm relative font-medium transition-colors hover:text-primary w-fit
          after:content-[''] after:absolute after:left-0 after:w-0 after:duration-300 
          after:transition-all after:-bottom-[1.5px] hover:after:w-full 
          after:border-b-2 hover:after:border-dashed after:border-black dark:after:border-white ${
            pathname === "/songfest" ? "text-blue-500" : ""
          }`}
      >
        Songfest
      </Link>
      <Link 
        href="/about" 
        className={`text-sm relative font-medium transition-colors hover:text-primary w-fit
          after:content-[''] after:absolute after:left-0 after:w-0 after:duration-300 
          after:transition-all after:-bottom-[1.5px] hover:after:w-full 
          after:border-b-2 hover:after:border-dashed after:border-black dark:after:border-white ${
            pathname === "/about" ? "text-blue-500" : ""
          }`}
      >
        About
      </Link>
      <Link 
        href="/gallery" 
        className={`text-sm relative font-medium transition-colors hover:text-primary w-fit
          after:content-[''] after:absolute after:left-0 after:w-0 after:duration-300 
          after:transition-all after:-bottom-[1.5px] hover:after:w-full 
          after:border-b-2 hover:after:border-dashed after:border-black dark:after:border-white ${
            pathname === "/gallery" ? "text-blue-500" : ""
          }`}
      >
        Gallery
      </Link>
    </>
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload() // Reload setelah sign out
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center">
              <div className="w-auto flex items-center gap-4">
                <Link href="/" className="text-xl font-bold">
                  12 SIJA A
                </Link>
                {/* Desktop Menu - Show beside logo when scrolled */}
                <div className={`hidden md:flex items-center space-x-6 transition-all duration-300 ease-in-out ${
                  isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
                }`}>
                  <NavLinks />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher></ThemeSwitcher>
              {user ? (
                <ProfileMenu user={user} />
              ) : (
                <Button onClick={() => setIsLoginModalOpen(true)}>
                  Login
                </Button>
              )}
              
              <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                redirectPath={pathname}
              />

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 py-4">
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Menu - Show below when not scrolled */}
          <div 
            className={`hidden md:flex items-start transition-all duration-300 ease-in-out border-t border-border/50 ${
              !isScrolled ? 'h-12 opacity-100 translate-y-0' : 'h-0 opacity-0 -translate-y-1 pointer-events-none overflow-hidden'
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
