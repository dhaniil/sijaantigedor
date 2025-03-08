"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");
  const provider = searchParams.get("provider") || "layanan autentikasi";
  
  const supabase = createClient();

  const retryAuth = async () => {
    setIsRetrying(true);
    try {
      const providerName = searchParams.get("provider")?.toLowerCase() || 'spotify';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...(providerName === 'spotify' && {
            scopes: 'user-read-email user-read-private'
          })
        }
      });
      
      if (error) {
        console.error("Auth retry error:", error);
      }
    } catch (err) {
      console.error("Unexpected error during retry:", err);
    }
  };

  const isProfileError = error?.toLowerCase().includes("profile") || 
                        errorDescription?.toLowerCase().includes("profile");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Kesalahan Autentikasi</h1>
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900 dark:text-red-300">
            <p>Terjadi kesalahan saat autentikasi dengan {provider}.</p>
            
            {isProfileError ? (
              <div className="mt-2">
                <p>Kami tidak dapat mengakses informasi profil Anda.</p>
                <p className="mt-2">Hal ini mungkin terjadi jika Anda tidak memberikan izin yang diperlukan.</p>
              </div>
            ) : (
              <>
                {error && <p className="mt-2">Kesalahan: {error}</p>}
                {errorCode && <p className="mt-2">Kode kesalahan: {errorCode}</p>}
                {errorDescription && <p className="mt-2">Detail: {errorDescription}</p>}
              </>
            )}
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            <button
              onClick={retryAuth}
              disabled={isRetrying}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
            >
              {isRetrying ? "Menghubungkan..." : `Coba Lagi dengan ${provider}`}
            </button>
            
            <Link href="/sign-in" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center">
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
