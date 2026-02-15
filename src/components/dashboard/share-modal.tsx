"use client"

import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { ShareButtons } from "@/components/shared/share-buttons"

interface ShareModalProps {
  cardUrl: string
  cardTitle: string
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ cardUrl, cardTitle, isOpen, onClose }: ShareModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Card</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <ShareButtons url={cardUrl} title={cardTitle} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
