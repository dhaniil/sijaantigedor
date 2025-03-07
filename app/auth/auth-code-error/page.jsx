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
  const provider = searchParams.get("provider") || "Spotify";
  
  const supabase = createClient();

  // Function to retry Spotify authentication
  const retrySpotifyAuth = async () => {
    setIsRetrying(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'user-read-email user-read-private', // Request basic profile data
        }
      });
      
      if (error) {
        console.error("Auth retry error:", error);
      }
    } catch (err) {
      console.error("Unexpected error during retry:", err);
    }
  };

  // If the error is related to getting user profile, show a special message
  const isProfileError = error?.includes("Error getting user profile") || 
                        errorDescription?.includes("Error getting user profile");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Authentication Error</h1>
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900 dark:text-red-300">
            <p>There was an error authenticating with {provider}.</p>
            
            {isProfileError ? (
              <div className="mt-2">
                <p>We couldn't access your profile information from Spotify.</p>
                <p className="mt-2">This may happen if you did not grant permission to access your email or profile.</p>
              </div>
            ) : (
              <>
                {error && <p className="mt-2">Error: {error}</p>}
                {errorCode && <p className="mt-2">Error code: {errorCode}</p>}
                {errorDescription && <p className="mt-2">Details: {errorDescription}</p>}
              </>
            )}
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            <button
              onClick={retrySpotifyAuth}
              disabled={isRetrying}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
            >
              {isRetrying ? "Connecting..." : "Try Again with Spotify"}
            </button>
            
            <Link href="/sign-in" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
