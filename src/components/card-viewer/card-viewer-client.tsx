"use client"

import { useState, useEffect } from "react"
import { EnvelopeAnimation } from "./envelope-animation"
import { CardDisplay } from "./card-display"
import { FireworksEffect } from "./fireworks-effect"
import { SnowEffect } from "./snow-effect"
import { CherryBlossomEffect } from "./cherry-blossom-effect"
import { ConfettiEffect } from "./confetti-effect"
import { MusicPlayer } from "./music-player"
import { ShareButtons } from "../shared/share-buttons"
import { QrCodeGenerator } from "../shared/qr-code-generator"
import { CardData, RecipientData, EffectType, FontFamily } from "@/types"
import { useTranslation } from "@/lib/i18n"
import { motion } from "motion/react"
import Link from "next/link"

interface CardViewerClientProps {
  card: CardData
  recipient: RecipientData
}

export function CardViewerClient({ card, recipient }: CardViewerClientProps) {
  const { t } = useTranslation()
  const [showEnvelope, setShowEnvelope] = useState(true)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    // Track view only once per session
    const storageKey = `viewed_${recipient.personalSlug}`
    if (typeof window !== "undefined" && !sessionStorage.getItem(storageKey)) {
      fetch(`/api/view/${recipient.personalSlug}/track`, {
        method: "POST",
      }).catch((error) => console.error("Failed to track view:", error))

      sessionStorage.setItem(storageKey, "1")
    }
  }, [recipient.personalSlug])

  const handleEnvelopeComplete = () => {
    setShowEnvelope(false)
    setTimeout(() => setShowCard(true), 100)
  }

  const cardUrl = typeof window !== "undefined" ? window.location.href : ""

  const EffectComponent = {
    fireworks: FireworksEffect,
    snow: SnowEffect,
    cherry_blossom: CherryBlossomEffect,
    confetti: ConfettiEffect,
  }[card.effect as EffectType] || ConfettiEffect

  return (
    <>
      {showEnvelope && <EnvelopeAnimation onComplete={handleEnvelopeComplete} />}

      {showCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50"
        >
          {/* Visual Effect Layer */}
          <EffectComponent />

          {/* Card Content */}
          <div className="relative z-10">
            <CardDisplay
              senderName={card.senderName}
              recipientName={recipient.name}
              message={card.message}
              fontFamily={card.fontFamily as FontFamily}
              primaryColor={card.primaryColor}
              imageUrl={card.imageUrl}
              backgroundPresetId={card.backgroundPresetId}
              className={card.templateId}
            />

            {/* Share Section */}
            <div className="max-w-4xl mx-auto px-4 pb-12 space-y-6">
              <ShareButtons
                url={cardUrl}
                title={`New Year Card for ${recipient.name}`}
              />

              <QrCodeGenerator
                url={cardUrl}
                title={`Card for ${recipient.name}`}
              />

              {/* CTA Button */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
                >
                  {t.viewer.createYourOwn}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Music Player */}
          <MusicPlayer musicUrl={card.backgroundMusic} />
        </motion.div>
      )}
    </>
  )
}
