"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import SongfestCardComponent from "@/components/songfest/SongfestCard";
import { type SongfestCard } from "@/types/songfest";

export default function SongfestPage() {
  const [songfests, setSongfests] = useState<SongfestCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSongfests() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error: supabaseError } = await supabase
          .from("songfests")
          .select("*")
          .order("created_at", { ascending: false });

        if (supabaseError) {
          throw new Error(`Error fetching songfests: ${supabaseError.message}`);
        }

        setSongfests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to fetch songfests:", err);
        setError("Failed to load songfests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSongfests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-300 to-purple-600 bg-clip-text text-transparent p-2">
        Songfest 12 SIJA A
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songfests.map((songfest) => (
            <SongfestCardComponent 
              key={songfest.id}
              songfest={songfest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
