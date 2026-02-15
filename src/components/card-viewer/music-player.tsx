"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion } from "motion/react"

interface MusicPlayerProps {
  musicUrl?: string
}

export function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
    }
    setIsPlaying(!isPlaying)
  }

  if (!musicUrl) return null

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        onEnded={() => setIsPlaying(false)}
      />
      <motion.button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-40 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isPlaying ? {
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.4)",
            "0 0 0 10px rgba(239, 68, 68, 0)",
          ]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeOut"
        }}
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-rose-600" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-600" />
        )}
      </motion.button>
    </>
  )
}
