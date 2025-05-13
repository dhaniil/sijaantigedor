import ImageCard from "@/components/image-components"
// import TimelineScene from "@/components/TimelineScene"
// import Timeline from "@/components/Timeline"

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed bottom-20 right-30 rounded-full bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 h-96 w-96 blur-2xl -z-10 mt-10"></div>
      <div className="fixed top-0 right-20 rounded-full bg-gradient-to-r from-blue-900 to-purple-700 h-96 w-96 blur-2xl -z-10 mt-10"></div>
      <div className="fixed bottom-0 right-60 rounded-full bg-gradient-to-t from-cyan-700 to-purple-800 h-64 w-64 blur-2xl -z-10 mt-10"></div>
      <h1 className="text-4xl font-extrabold text-center bg-violet-600 bg-clip-text text-transparent p-2">
        Gallery
      </h1>
      <p className="text-center">
        disini semua tentang kita, semua kenangan bersama.
      </p>
      <main className="bg-gradient-to-br from-gray-900/10 to-slate-100/10 rounded-md p-5 backdrop-filter backdrop-blur-md bg-opacity-10">
        <div className="xl:columns-4 lg:columns-3 md:columns-2 sm:columns-1 gap-5">
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Nyate.JPG" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Ilham.jpg" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Bersama.JPG" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Tsabit.jpg" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Ade.jpg" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//2o.JPG" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Akbar.jpg" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Bersama.JPG" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Jaort.jpg" />
          <ImageCard image="https://wbivnltxlamokknfbxmd.supabase.co/storage/v1/object/public/Image//Ilham2.jpg" />
        </div>
        <a href="https://drive.google.com/drive/folders/1wt6mufIwDRlVZcXueAgP14DyfVjNd40-" className="block text-end mt-5 text-xl text-slate-200">
          Lihat Semua..
        </a>
      </main>
    </div>
    
  )
}
