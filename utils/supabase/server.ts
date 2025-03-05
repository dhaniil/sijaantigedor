import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch (error) {
            console.error('Error getting cookies:', error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Tambahkan opsi security untuk cookies
              const secureOptions = {
                ...options,
                secure: true,
                sameSite: "lax" as "lax",
                httpOnly: true
              };
              cookieStore.set(name, value, secureOptions);
            });
          } catch (error) {
            // Log error untuk debugging tapi tetap jalankan
            console.error('Error setting cookies:', error);
            // Mencoba set cookies satu per satu untuk menghindari kegagalan total
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                const secureOptions = {
                  ...options,
                secure: true,
                sameSite: "lax" as "lax",
                httpOnly: true
                };
                cookieStore.set(name, value, secureOptions);
              } catch (e) {
                console.error(`Failed to set cookie ${name}:`, e);
              }
            });
          }
        },
      },
      // Tambahkan auth config untuk persistensi
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    },
  );
};
