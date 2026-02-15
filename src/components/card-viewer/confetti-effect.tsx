"use client"

import { motion } from "motion/react"
import { useMemo } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  velocityX: number
  velocityY: number
  width: number
  height: number
}

export function ConfettiEffect() {
  const pieces = useMemo(() => {
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50,
      y: 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 100,
      velocityY: 20 + Math.random() * 30,
      width: 6 + Math.random() * 6,
      height: 12 + Math.random() * 8
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: piece.rotation,
            opacity: 1
          }}
          animate={{
            x: piece.velocityX,
            y: piece.velocityY + 100,
            rotate: piece.rotation + 720,
            opacity: 0,
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
    </div>
  )
}
