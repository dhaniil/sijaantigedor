export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-300 to-purple-600 bg-clip-text text-transparent p-2">
        Tentang 12 SIJA A
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        <section className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">12 SIJA A</h2>
          <p className="text-muted-foreground">
            12 SIJA A adalah kelas dari jurusan Sistem Informatika, Jaringan, dan Aplikasi 
            di SMK N 2 Depok Sleman. Kami adalah sekelompok siswa yang unik. 
          </p>
        </section>

        {/* <section className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Tentang Web ini</h2>
          <p className="text-muted-foreground mb-4">
                Ntahlah belum jadi
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Mencari lagu dari Spotify</li>
            <li>Berbagi lagu dengan pesan personal</li>
            <li>Melihat lagu-lagu yang dibagikan oleh teman sekelas</li>
          </ul>
        </section> */}

        <section className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Teknologi yang Digunakan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Next.js 15",
              "TypeScript",
              "Tailwind CSS",
              "BaaS: Supabase",
              "Spotify API",
              "Shadcn/ui"
            ].map((tech) => (
              <div 
                key={tech}
                className="bg-muted p-3 rounded-md text-center text-sm font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
