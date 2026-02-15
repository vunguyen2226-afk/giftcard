"use client"

import { motion } from "motion/react"
import { useMemo } from "react"

interface Snowflake {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  sway: number
}

export function SnowEffect() {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 8 + Math.random() * 7,
      delay: Math.random() * 5,
      sway: 15 + Math.random() * 15
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white/80"
          style={{
            left: `${flake.x}%`,
            width: flake.size,
            height: flake.size,
            top: "-20px",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [
              0,
              flake.sway,
              -flake.sway,
              flake.sway,
              0
            ],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: flake.duration / 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </div>
  )
}
