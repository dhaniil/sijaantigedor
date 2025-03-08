export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string | undefined;
  album_images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  duration: number;
  previewUrl?: string | null;
  externalUrl: string;
}
