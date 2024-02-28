"use client"

import { Button } from "@/components/ui/button"
import { InfoIcon, PlayCircle } from "lucide-react"
import { useState } from "react"
import PlayVideoModal from "./PlayVideoModal";

interface iAppProps {
  overview: string;
  youtubeUrl: string;
  id: number;
  age: number;
  title: string;
  releaseDate: number;
  duration: number;
}

export default function MovieButtons({
  overview,
  youtubeUrl,
  id,
  age,
  title,
  releaseDate,
  duration
}: iAppProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)} className="text-lg font-medium">
        <PlayCircle className="mr-2 w-6" /> Play
      </Button>
      <Button onClick={() => setOpen(true)} className="text-lg font-medium bg-white/40 hover:bg-white/40 text-white">
        <InfoIcon className="mr-2 w-6" /> Learn More
      </Button>

      <PlayVideoModal 
        key={id}
        state={open} 
        changeState={setOpen} 
        title={title}
        overview={overview}
        youtubeUrl={youtubeUrl}
        release={releaseDate}
        age={age}
        duration={duration}
      />
    </>
  )
}