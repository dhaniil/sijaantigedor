import { SpotifyTrack } from "@/utils/spotify/client";

export interface Songfest {
  id: string;
  created_at: string;
  user_id: string;
  sender: string;
  receiver: string;
  message: string;
  track_id: string;
  user_name?: string;
  track?: SpotifyTrack | null;
}

export interface SongfestCard {
  id: string;
  created_at: string;
  user_id: string;
  sender: string;
  receiver: string;
  message: string;
  track_id: string;
  user_name: string;
  track?: SpotifyTrack | null;
}
