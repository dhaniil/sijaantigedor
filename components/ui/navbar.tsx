"use client"

import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"
import LoginModal from "@/components/auth/login-modal"
import ProfileMenu from "@/components/auth/profile-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

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

              {/* Default Menu (Visible before scroll) */}
              <div className={`hidden md:flex items-center ml-6 space-x-6 transition-all duration-300 ease-in-out ${
                !isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
              }`}>
                <NavLinks />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              {user ? <ProfileMenu user={user} /> : <LoginModal />}
              <button className="md:hidden p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrolled Menu */}
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
