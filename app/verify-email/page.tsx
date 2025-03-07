"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? null);
      }
      setIsLoading(false);
    }
    
    getUser();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Verify Your Email</h1>
          <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900 dark:text-blue-300">
            <p>We've sent a verification email to <strong>{email || "your email address"}</strong>.</p>
            <p className="mt-2">Please check your inbox and click the verification link to complete your registration.</p>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Didn't receive the email? Check your spam folder or request a new verification link.
            </p>
            <button
              onClick={async () => {
                if (email) {
                  await supabase.auth.resend({
                    type: 'signup',
                    email,
                  });
                  alert('Verification email resent!');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
        
        <div className="text-center pt-4">
          <Link href="/sign-in" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
