import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "12 SIJA Antigedor",
  description: "Created by 12 SIJA Antigedor",
  icons: {
    icon: [
      {
        url: 'https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Remake%20SJ2PNG.ico',
        sizes: 'any',
      },
    ],
    shortcut: [
      {
        url: 'https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Remake%20SJ2PNG.ico',
        sizes: 'any',
      },
    ],
  },
  openGraph: {
    title: "12 SIJA Antigedor",
    description: "Created by 12 SIJA Antigedor",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "12 SIJA Antigedor",
    locale: "id_ID",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Spotify domains for faster initial connection */}
        <link rel="preconnect" href="https://open.spotify.com" />
        <link rel="preconnect" href="https://i.scdn.co" />
      </head>
      <body>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
