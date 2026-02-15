"use client"

import { motion } from "motion/react"
import { useMemo } from "react"

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  color: string
  delay: number
}

export function FireworksEffect() {
  const bursts = useMemo(() => {
    const burstCount = 4
    const particlesPerBurst = 12
    const colors = ["#fbbf24", "#ef4444", "#fb923c", "#ffffff"]

    return Array.from({ length: burstCount }, (_, burstIndex) => {
      const burstX = 20 + Math.random() * 60 // 20-80% of screen width
      const burstY = 20 + Math.random() * 40 // 20-60% of screen height
      const delay = burstIndex * 0.8

      const particles = Array.from({ length: particlesPerBurst }, (_, i) => ({
        id: burstIndex * particlesPerBurst + i,
        x: burstX,
        y: burstY,
        angle: (i / particlesPerBurst) * 360,
        distance: 80 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay
      }))

      return particles
    }).flat()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bursts.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
            y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
          }}
          transition={{
            duration: 1.2,
            delay: particle.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
      ))}
    </div>
  )
}
