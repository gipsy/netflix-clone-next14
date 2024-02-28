"use client"

import { Button } from "@/components/ui/button";
import { Heart, PlayCircle } from "lucide-react";
import PlayVideoModal from "./PlayVideoModal";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { addToWatchList, deleteFromWatchList } from "../action";

interface iAppProps {
  title: string;
  overview: string;
  movieId: number;
  watchList: boolean;
  watchListId: string;
  youtubeUrl: string;
  age: number;
  time: number;
  year: number;
}

export function MovieCard({
  title, 
  overview, 
  movieId, 
  watchList, 
  watchListId, 
  youtubeUrl,
  age,
  time,
  year
}: iAppProps) {

  const [open, setOpen] = useState(false)
  const pathName = usePathname()

  return (
    <>
      <button onClick={() => setOpen(true)} className="-mt-14">
        <PlayCircle className="h-20 w-20" />
      </button> 

      <div className="right-5 top-5 absolute z-10">
        {watchList ? (
          <form action={deleteFromWatchList}>
            <input type="hidden" name="watchlistId" value={watchListId} />
            <input type="hidden" name="pathname" value={pathName} />
            <Button onClick={() => setOpen(true)} variant="outline" size="icon">
              <Heart className="w-4 h-4 text-red-500" />
            </Button>
          </form>
        ) : (
          <form action={addToWatchList}>
            <input type="hidden" name="movieId" value={movieId} />
            <input type="hidden" name="pathname" value={pathName} />
            <Button variant="outline">
              <Heart className="w-4 h-4 text-red-500" />
            </Button>
          </form>
        )}
      </div>

      <div className="p-5 absolute bottom-0 left-0">
        <h1 className="font-bold text-lg line-clamp-1">{title}</h1>
        <div className="flex gap-x-2 items-center">
          <p className="font-normal text-sm">{year}</p>
          <p className="font-normal border py-0.5 border-gray-200 rounded text-sm">{age}+</p>
          <p className="font-normal text-sm">{time}h</p>
        </div>
        <p className="line-clamp-1 text-sm text-gray-200 font-light">{overview}</p>
      </div>

      <PlayVideoModal 
        key={movieId}
        title={title}
        overview={overview}
        youtubeUrl={youtubeUrl}
        state={open}
        changeState={setOpen}
        release={year}
        age={age}
        duration={time}
      />
    </>
  )
}