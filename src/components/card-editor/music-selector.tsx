import { useState, useRef, useEffect } from "react"
import { MusicOption } from "@/types"
import { useTranslation } from "@/lib/i18n"
import { playTestTone, checkMusicFileExists } from "@/lib/audio-fallback"

// Music options
const MUSIC_OPTIONS: MusicOption[] = [
  { id: "traditional", name: "Điệp Khúc Mùa Xuân", url: "/music/traditional.mp3", duration: 30 },
  { id: "xuan-da-ve", name: "Xuân Đã Về", url: "/music/xuan-da-ve.mp3", duration: 30 },
  { id: "mua-xuan-oi", name: "Mùa Xuân Ơi", url: "/music/mua-xuan-oi.mp3", duration: 30 },
]

interface MusicSelectorProps {
  selectedMusic?: string
  onSelect: (musicUrl: string | undefined) => void
}

export function MusicSelector({ selectedMusic, onSelect }: MusicSelectorProps) {
  const { t } = useTranslation()
  const [playing, setPlaying] = useState<string | null>(null)
  const [musicFilesAvailable, setMusicFilesAvailable] = useState<boolean | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const toneRef = useRef<{ stop: () => void } | null>(null)

  // Check if music files exist on mount
  useEffect(() => {
    checkMusicFileExists("/music/traditional.mp3").then((exists) => {
      setMusicFilesAvailable(exists)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (toneRef.current) {
        toneRef.current.stop()
        toneRef.current = null
      }
    }
  }, [])

  const stopAllPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (toneRef.current) {
      toneRef.current.stop()
      toneRef.current = null
    }
  }

  const handlePlay = (musicId: string, musicUrl: string) => {
    stopAllPlayback()

    if (playing === musicId) {
      setPlaying(null)
      return
    }

    // If files are not available, use test tones directly
    if (musicFilesAvailable === false) {
      toneRef.current = playTestTone(musicId)
      setPlaying(musicId)
      // Auto-stop after sequence completes (~2s)
      setTimeout(() => {
        setPlaying((prev) => (prev === musicId ? null : prev))
      }, 2000)
      return
    }

    // Try to play the actual file
    const audio = new Audio(musicUrl)
    audio.onerror = () => {
      // Fallback to test tones on error
      setMusicFilesAvailable(false)
      toneRef.current = playTestTone(musicId)
      setPlaying(musicId)
      setTimeout(() => {
        setPlaying((prev) => (prev === musicId ? null : prev))
      }, 2000)
    }
    audio.play().catch(() => {
      // Fallback to test tones
      setMusicFilesAvailable(false)
      toneRef.current = playTestTone(musicId)
      setPlaying(musicId)
      setTimeout(() => {
        setPlaying((prev) => (prev === musicId ? null : prev))
      }, 2000)
    })
    audio.onended = () => setPlaying(null)
    audioRef.current = audio
    setPlaying(musicId)
  }

  const handleSelect = (musicUrl?: string) => {
    stopAllPlayback()
    setPlaying(null)
    onSelect(musicUrl)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.music.label}
      </label>

      {/* Missing files warning banner */}
      {musicFilesAvailable === false && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {t.music.missingFilesBanner}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {t.music.missingFilesHint}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* No Music Option */}
        <button
          onClick={() => handleSelect(undefined)}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
            !selectedMusic
              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{t.common.noMusic}</span>
            </div>
            {!selectedMusic && (
              <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>

        {/* Music Options */}
        {MUSIC_OPTIONS.map((music) => (
          <MusicOptionItem
            key={music.id}
            music={music}
            displayName={music.name}
            isSelected={music.url === selectedMusic}
            isPlaying={playing === music.id}
            previewLabel={musicFilesAvailable === false ? t.music.testToneLabel : t.music.previewDuration}
            selectedLabel={t.common.selected}
            selectLabel={t.common.select}
            onPlay={() => handlePlay(music.id, music.url)}
            onSelect={() => handleSelect(music.url)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">{t.music.hint}</p>
    </div>
  )
}

// Extracted to keep parent under 200 lines
interface MusicOptionItemProps {
  music: MusicOption
  displayName: string
  isSelected: boolean
  isPlaying: boolean
  previewLabel: string
  selectedLabel: string
  selectLabel: string
  onPlay: () => void
  onSelect: () => void
}

function MusicOptionItem({
  music, displayName, isSelected, isPlaying,
  previewLabel, selectedLabel, selectLabel, onPlay, onSelect,
}: MusicOptionItemProps) {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      isSelected
        ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onPlay}
            className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{displayName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{music.duration}s {previewLabel}</p>
          </div>
        </div>
        <button
          onClick={onSelect}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isSelected
              ? "bg-rose-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {isSelected ? selectedLabel : selectLabel}
        </button>
      </div>
    </div>
  )
}
