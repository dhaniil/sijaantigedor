import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import LoginModal from "@/components/auth/login-modal"

export default async function AuthCodeError({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessage = searchParams.error
  console.log('Auth error page loaded with error:', errorMessage)
  return (
    <div className="container mx-auto max-w-lg py-16 px-4">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          Terjadi kesalahan saat proses autentikasi dengan Spotify: 
          {errorMessage && (
            <div className="mt-2 p-2 bg-destructive/10 rounded-md">
              <code className="text-sm break-all">{errorMessage}</code>
            </div>
          )}
          <p className="mt-2">Ini mungkin terjadi karena:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Sesi autentikasi telah kadaluarsa</li>
            <li>Token tidak valid atau telah digunakan</li>
            <li>Masalah koneksi dengan Spotify</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          Silahkan coba login kembali dengan Spotify
        </p>
        <div className="flex flex-col gap-4 items-center">
          <LoginModal />
          <Button variant="outline" asChild>
            <Link href="/">
              Kembali ke Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
