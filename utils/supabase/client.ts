import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Konfigurasi auth untuk persistensi session yang lebih baik
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: {
          getItem: (key: string) => {
            try {
              return localStorage.getItem(key);
            } catch (error) {
              console.error('Error accessing localStorage:', error);
              return null;
            }
          },
          setItem: (key: string, value: string) => {
            try {
              localStorage.setItem(key, value);
            } catch (error) {
              console.error('Error setting localStorage:', error);
            }
          },
          removeItem: (key: string) => {
            try {
              localStorage.removeItem(key);
            } catch (error) {
              console.error('Error removing from localStorage:', error);
            }
          }
        }
      },
      cookieOptions: {
        name: "sb-auth",
        maxAge: 60 * 60 * 24 * 7, // 1 minggu
        path: '/',
        sameSite: "lax" as "lax"
      }
    }
  );
