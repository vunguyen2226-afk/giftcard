// Web Audio API test tone generator
// Plays a short unique melodic sequence per music ID as a preview fallback
// when MP3 files don't exist in /public/music/

type NoteSequence = { freq: number; duration: number }[]

// Unique melodic sequences per music ID
const TONE_SEQUENCES: Record<string, NoteSequence> = {
  festive: [
    { freq: 523, duration: 0.15 }, // C5
    { freq: 659, duration: 0.15 }, // E5
    { freq: 784, duration: 0.15 }, // G5
    { freq: 1047, duration: 0.3 }, // C6
    { freq: 784, duration: 0.15 }, // G5
    { freq: 1047, duration: 0.4 }, // C6
  ],
  calm: [
    { freq: 392, duration: 0.4 }, // G4
    { freq: 440, duration: 0.4 }, // A4
    { freq: 494, duration: 0.4 }, // B4
    { freq: 523, duration: 0.6 }, // C5
  ],
  playful: [
    { freq: 523, duration: 0.1 }, // C5
    { freq: 587, duration: 0.1 }, // D5
    { freq: 659, duration: 0.1 }, // E5
    { freq: 523, duration: 0.1 }, // C5
    { freq: 659, duration: 0.15 }, // E5
    { freq: 784, duration: 0.3 }, // G5
  ],
  traditional: [
    { freq: 440, duration: 0.3 }, // A4
    { freq: 523, duration: 0.2 }, // C5
    { freq: 587, duration: 0.3 }, // D5
    { freq: 659, duration: 0.2 }, // E5
    { freq: 440, duration: 0.5 }, // A4
  ],
  "xuan-da-ve": [
    { freq: 523, duration: 0.2 }, // C5
    { freq: 587, duration: 0.2 }, // D5
    { freq: 659, duration: 0.3 }, // E5
    { freq: 784, duration: 0.2 }, // G5
    { freq: 659, duration: 0.3 }, // E5
    { freq: 523, duration: 0.4 }, // C5
  ],
  "mua-xuan-oi": [
    { freq: 659, duration: 0.25 }, // E5
    { freq: 784, duration: 0.25 }, // G5
    { freq: 880, duration: 0.3 },  // A5
    { freq: 784, duration: 0.2 },  // G5
    { freq: 659, duration: 0.4 },  // E5
  ],
  "ly-ngua-o": [
    { freq: 587, duration: 0.15 }, // D5
    { freq: 659, duration: 0.15 }, // E5
    { freq: 784, duration: 0.15 }, // G5
    { freq: 880, duration: 0.15 }, // A5
    { freq: 784, duration: 0.2 },  // G5
    { freq: 659, duration: 0.15 }, // E5
    { freq: 587, duration: 0.4 },  // D5
  ],
}

// Default sequence for unknown IDs
const DEFAULT_SEQUENCE: NoteSequence = [
  { freq: 440, duration: 0.2 },
  { freq: 554, duration: 0.2 },
  { freq: 659, duration: 0.3 },
]

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export function playTestTone(musicId: string): { stop: () => void } {
  const ctx = getAudioContext()
  const sequence = TONE_SEQUENCES[musicId] || DEFAULT_SEQUENCE
  const gainNode = ctx.createGain()
  gainNode.connect(ctx.destination)
  gainNode.gain.value = 0.3

  let currentTime = ctx.currentTime
  const oscillators: OscillatorNode[] = []

  for (const note of sequence) {
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.value = note.freq

    // Envelope for smooth attack/release
    const noteGain = ctx.createGain()
    noteGain.connect(gainNode)
    noteGain.gain.setValueAtTime(0, currentTime)
    noteGain.gain.linearRampToValueAtTime(1, currentTime + 0.02)
    noteGain.gain.linearRampToValueAtTime(0, currentTime + note.duration - 0.02)

    osc.connect(noteGain)
    osc.start(currentTime)
    osc.stop(currentTime + note.duration)
    oscillators.push(osc)

    currentTime += note.duration
  }

  return {
    stop: () => {
      oscillators.forEach((osc) => {
        try { osc.stop() } catch { /* already stopped */ }
      })
    },
  }
}

export async function checkMusicFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}
