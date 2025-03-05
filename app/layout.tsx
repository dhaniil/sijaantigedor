import Navbar from "@/components/ui/navbar";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "12 SIJA A - Kenangan & Songfest",
  description: "Website profile kelas 12 SIJA A berisi kenangan dan dokumentasi songfest",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-8">
              {children}
            </div>
            <footer className="border-t py-8 text-center text-sm">
              <p>12 SIJA A. All rights reserved.</p>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
