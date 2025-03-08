import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
        <p className="mb-4">Welcome, {user.email || user.user_metadata?.name || 'User'}!</p>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Login Berhasil</h2>
          <p className="text-gray-600 mb-4">
          </p>
          <a 
            href="/songfest" 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            Go to Songfest
          </a>
        </div>
      </div>
    </div>
  );
}
