"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion } from "motion/react"
import { playTestTone, checkMusicFileExists } from "@/lib/audio-fallback"
import { useTranslation } from "@/lib/i18n"

interface MusicPlayerProps {
  musicUrl?: string
}

function getMusicIdFromUrl(url: string): string {
  const fileName = url.split("/").pop() || ""
  return fileName.replace(/\.\w+$/, "")
}

export function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [useTestTones, setUseTestTones] = useState(false)
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const toneIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const toneRef = useRef<{ stop: () => void } | null>(null)

  const musicId = musicUrl ? getMusicIdFromUrl(musicUrl) : ""

  const stopToneLoop = useCallback(() => {
    if (toneIntervalRef.current) {
      clearInterval(toneIntervalRef.current)
      toneIntervalRef.current = null
    }
    if (toneRef.current) {
      toneRef.current.stop()
      toneRef.current = null
    }
  }, [])

  const startToneLoop = useCallback(() => {
    stopToneLoop()
    toneRef.current = playTestTone(musicId)
    toneIntervalRef.current = setInterval(() => {
      if (toneRef.current) toneRef.current.stop()
      toneRef.current = playTestTone(musicId)
    }, 3000)
  }, [musicId, stopToneLoop])

  useEffect(() => {
    if (!musicUrl || hasAttemptedAutoplay) return
    setHasAttemptedAutoplay(true)

    checkMusicFileExists(musicUrl).then((exists) => {
      if (!exists) {
        setUseTestTones(true)
        startToneLoop()
        setIsPlaying(true)
      } else if (audioRef.current) {
        audioRef.current.volume = 0.5
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          // Autoplay blocked by browser - user will need to click
        })
      }
    })

    return () => stopToneLoop()
  }, [musicUrl, hasAttemptedAutoplay, startToneLoop, stopToneLoop])

  if (!musicUrl) return null

  const togglePlay = () => {
    if (useTestTones) {
      if (isPlaying) {
        stopToneLoop()
      } else {
        startToneLoop()
      }
      setIsPlaying(!isPlaying)
      return
    }

    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        setUseTestTones(true)
        startToneLoop()
      })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      {!useTestTones && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setUseTestTones(true)
            if (isPlaying) startToneLoop()
          }}
        />
      )}
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
        aria-label={isPlaying ? t.musicPlayer.mute : t.musicPlayer.play}
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
