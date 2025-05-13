export default function ImageCard({image, alt}: {image: string; alt?: string}) {
    return (
          <a href="https://youtu.be/xvFZjo5PgG0?si=r7BigReETFBBd31p" className="relative group h-fit ">
            <div className="pointer-events-none rounded-md absolute bg-gradient-to-b from-transparent to-violet-900/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 inset-0"></div>
            <img className="mt-4 rounded-md transition h-fit border border-slate-100/10" 
            src={image} />
          </a>
    )
}