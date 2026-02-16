"use client"

import { useState } from "react"
import { Copy, Facebook, MessageCircle, Share2, Check } from "lucide-react"
import { motion } from "motion/react"
import { useTranslation } from "@/lib/i18n"

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    zalo: `https://zalo.me/share?url=${encodeURIComponent(url)}`,
    messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=&redirect_uri=${encodeURIComponent(url)}`
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{t.shareButtons.shareThisCard}</h3>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* Copy Link */}
        <motion.button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              {t.common.copied}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {t.shareButtons.copyLink}
            </>
          )}
        </motion.button>

        {/* Facebook */}
        <motion.a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </motion.a>

        {/* WhatsApp */}
        <motion.a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </motion.a>

        {/* Zalo */}
        <motion.a
          href={shareLinks.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4" />
          Zalo
        </motion.a>

        {/* Messenger */}
        <motion.a
          href={shareLinks.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-4 h-4" />
          Messenger
        </motion.a>
      </div>
    </div>
  )
}
