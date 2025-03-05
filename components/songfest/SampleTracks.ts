export const SAMPLE_TRACKS = [
  {
    id: "sample1",
    name: "Avicii - Wake Me Up",
    artists: [{ name: "Avicii" }],
    album: { 
      name: "True",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc" }
      ] 
    }
  },
  {
    id: "sample2",
    name: "Martin Garrix - Animals",
    artists: [{ name: "Martin Garrix" }],
    album: { 
      name: "Animals",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273a91c33ae5588f47c0d3624c4" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273a91c33ae5588f47c0d3624c4" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273a91c33ae5588f47c0d3624c4" }
      ] 
    }
  },
  {
    id: "sample3",
    name: "David Guetta - Titanium ft. Sia",
    artists: [{ name: "David Guetta" }, { name: "Sia" }],
    album: { 
      name: "Nothing but the Beat",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }
      ] 
    }
  },
  {
    id: "sample4",
    name: "Lilas - French Song",
    artists: [{ name: "French Artist" }],
    album: { 
      name: "French Album",
      images: [
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }, 
        { url: "https://i.scdn.co/image/ab67616d0000b273af1647262b7fc6bc9a8385d7" }
      ] 
    }
  }
];

export function searchSampleTracks(query: string) {
  if (!query) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return SAMPLE_TRACKS.filter(track => 
    track.name.toLowerCase().includes(lowercaseQuery) ||
    track.artists.some(artist => artist.name.toLowerCase().includes(lowercaseQuery))
  );
}
