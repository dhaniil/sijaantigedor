import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { SongfestForm } from "@/components/songfest/SongfestForm"
import { SongCard } from "@/components/songfest/SongCard"
import LoginModal from "@/components/auth/login-modal"

export default async function SongfestPage() {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Session error:', sessionError)
  }

  // Fetch existing songfests
  const { data: songfests, error: songfestsError } = await supabase
    .from("songfests")
    .select("*")
    .order("created_at", { ascending: false })

  if (songfestsError) {
    console.error('Songfests error:', songfestsError)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-12">
        {session ? (
          <SongfestForm />
        ) : (
          <div className="text-center space-y-4 max-w-lg mx-auto p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold">Ingin mengirim Songfest?</h2>
            <p className="text-muted-foreground">
              Login dengan Spotify untuk mulai mengirim pesan dan lagu ke teman-temanmu.
            </p>
          <LoginModal redirectPath="/songfest" />
          </div>
        )}
      </div>

      {songfests && songfests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songfests.map((songfest) => (
            <SongCard
              key={songfest.id}
              sender={songfest.sender}
              receiver={songfest.receiver}
              message={songfest.message}
              trackId={songfest.track_id}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Belum ada kiriman Songfest.
        </p>
      )}
    </main>
  )
}
