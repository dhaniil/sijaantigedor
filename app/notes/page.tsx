import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function NotesPage() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set: (name: string, value: string, options: any) => {
          cookieStore.set(name, value, options)
        },
        remove: (name: string, options: any) => {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data: notes } = await supabase.from('notes').select()

  return (
    <div className="mx-auto max-w-4xl mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Notes</h1>
      {notes?.length === 0 ? (
        <p className="text-gray-500">No notes found.</p>
      ) : (
        <div className="space-y-4">
          {notes?.map((note) => (
            <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <pre className="whitespace-pre-wrap">{JSON.stringify(note, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}