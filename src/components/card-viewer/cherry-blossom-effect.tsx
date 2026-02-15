"use client"

import { motion } from "motion/react"
import { useMemo } from "react"

interface Petal {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  sway: number
  rotation: number
}

export function CherryBlossomEffect() {
  const petals = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 8,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 6,
      sway: 30 + Math.random() * 40,
      rotation: Math.random() * 360
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute rounded-full"
          style={{
            left: `${petal.x}%`,
            width: petal.size,
            height: petal.size * 1.2,
            background: "linear-gradient(135deg, #fecdd3 0%, #fda4af 50%, #fb7185 100%)",
            top: "-20px",
            borderRadius: "50% 0 50% 0",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [
              0,
              petal.sway,
              -petal.sway / 2,
              petal.sway / 2,
              0
            ],
            rotate: [petal.rotation, petal.rotation + 360]
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: petal.duration / 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: petal.duration / 3,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      ))}
    </div>
  )
}
