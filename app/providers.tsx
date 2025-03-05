"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export const AuthContext = createContext<{ user: any | null }>({ user: null })

interface ProvidersProps {
  children: React.ReactNode
  defaultTheme?: string | undefined
  attribute?: "class" | "data-theme" | undefined
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function Providers({ 
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = true
}: ProvidersProps) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const supabase = createClientComponentClient()

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
  if (!mounted) return null

  return (
    <AuthContext.Provider value={{ user }}>
      <NextThemesProvider 
        attribute={attribute}
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        disableTransitionOnChange={disableTransitionOnChange}
      >
        {children}
      </NextThemesProvider>
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
