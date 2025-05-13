"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { ThemeProvider } from "@/context/theme-context"

export const AuthContext = createContext<{ user: any | null }>({ user: null })

interface ProvidersProps {
  children: React.ReactNode
  defaultTheme?: | "dark" | "system"
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function Providers({ 
  children,
  defaultTheme = "system",
  // These props are kept for compatibility but not used in our custom implementation
  attribute,
  enableSystem = true,
  disableTransitionOnChange = true
}: ProvidersProps) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setMounted(true)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Prevent flash of unstyled content
  if (!mounted) return <>{children}</>;

  return (
    <AuthContext.Provider value={{ user }}>
      <ThemeProvider defaultTheme={defaultTheme} storageKey="sija-theme-preference">
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
