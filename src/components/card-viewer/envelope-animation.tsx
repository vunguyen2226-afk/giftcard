"use client"

import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"

interface EnvelopeAnimationProps {
  onComplete: () => void
}

export function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Auto-play after 2s delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpening) {
        setIsOpening(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isOpening])

  const handleClick = () => {
    if (!isOpening) {
      setIsOpening(true)
    }
  }

  const handleAnimationComplete = () => {
    setIsComplete(true)
    setTimeout(onComplete, 300)
  }

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-100 to-amber-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative cursor-pointer"
            onClick={handleClick}
            style={{ width: "320px", height: "240px" }}
          >
            {/* Envelope body */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-300 rounded-b-lg shadow-xl"
              style={{ height: "180px" }}
            />

            {/* Envelope flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{
                height: "120px",
                transformStyle: "preserve-3d",
              }}
              animate={
                isOpening
                  ? { rotateX: 180 }
                  : { rotateX: 0 }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-rose-200 to-rose-300 border-2 border-rose-300"
                style={{
                  clipPath: "polygon(0 0, 50% 60%, 100% 0)",
                  backfaceVisibility: "hidden"
                }}
              />
            </motion.div>

            {/* Card inside */}
            <motion.div
              className="absolute left-1/2 bottom-8 bg-white rounded-lg shadow-2xl"
              style={{
                width: "240px",
                height: "180px",
                x: "-50%",
              }}
              initial={{ y: 0, scale: 0.8, opacity: 0 }}
              animate={
                isOpening
                  ? { y: -100, scale: 1, opacity: 1 }
                  : { y: 0, scale: 0.8, opacity: 0 }
              }
              transition={{
                delay: 0.6,
                duration: 0.8,
                ease: "easeOut"
              }}
              onAnimationComplete={handleAnimationComplete}
            >
              <div className="flex items-center justify-center h-full text-6xl">
                🎉
              </div>
            </motion.div>

            {/* Click hint */}
            {!isOpening && (
              <motion.p
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-rose-600 text-sm font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to open
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
