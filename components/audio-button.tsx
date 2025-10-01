'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AudioButton() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/claire.mp3')
    audioRef.current.loop = true
  }, [])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <Button
  onClick={toggleAudio}
  variant="ghost"
  size="icon"
  className="fixed top-20 right-6 z-[40] bg-black/10 hover:bg-black/20 backdrop-blur-sm rounded-full p-2" // Changed top-4 to top-20
  aria-label={isPlaying ? "Mute background audio" : "Play background audio"}
>
      {isPlaying ? (
        <Volume2 className="h-6 w-6 text-white" />
      ) : (
        <VolumeX className="h-6 w-6 text-white" />
      )}
    </Button>
  )
}

