import Image from "next/image"
import prisma from "@/app/utils/db"
import { MovieCard } from "./MovieCard"

async function getData() {
  const data = await prisma?.movie.findMany({
    select: {
      id: true,
      overview: true,
      title: true,
      WatchLists: true,
      imageString: true,
      youtubeString: true,
      release: true,
      age: true,
      duration: true,
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 4
  })

  return data
}

export default async function RecentlyAdded() {
  const data = await getData()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-6">
      {data?.map((movie) => (
        <div key={movie.id} className="relative h-48">
          <Image
            src={movie.imageString}
            alt="Movie"
            width="100"
            height="100"
            className="rounded-sm absolute w-full h-full object-cover"
          />


          <div className="h-60 relative z-10 w-full tranform transition duraciot-500 hover:scale-125 opacity-0 hover:opacity-100">
            <div className="bg-gradient-to-b from-transparent via-black/50 to-black z-10 w-full h-full rounded-lg flex items-center justify-center">
              <Image 
                src={movie.imageString} 
                alt="Movie" 
                width={800} 
                height={800} 
                className="absolute w-full h-full -z-10 rounded-lg object-cover"
              />
              <MovieCard 
                key={movie.id}
                movieId={movie.id}
                overview={movie.overview}
                title={movie.title}
                watchListId={movie.WatchLists[0]?.id}
                youtubeUrl={movie.youtubeString}
                watchList={movie.WatchLists.length > 0 ? true : false}
                age={movie.age}
                time={movie.duration}
                year={movie.release}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}