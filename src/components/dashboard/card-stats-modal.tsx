"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Copy, Check, Eye, Mail, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useTranslation } from "@/lib/i18n"

interface Recipient {
  id: string
  name: string
  email: string | null
  personalSlug: string
  viewCount: number
  firstViewedAt: string | null
}

interface CardStatsModalProps {
  cardId: string
  isOpen: boolean
  onClose: () => void
  onAddRecipients: (cardId: string) => void
}

export function CardStatsModal({ cardId, isOpen, onClose, onAddRecipients }: CardStatsModalProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [card, setCard] = useState<any>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && cardId) {
      fetchStats()
    }
  }, [isOpen, cardId])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cards/${cardId}/stats`)
      if (res.ok) {
        const data = await res.json()
        setCard(data.card)
        setRecipients(data.recipients)
        setTotalViews(data.totalViews)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyUrl = async (slug: string, recipientId: string) => {
    const url = `${window.location.origin}/card/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(recipientId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const maskEmail = (email: string | null) => {
    if (!email) return "—"
    const [local, domain] = email.split("@")
    return `${local.slice(0, 3)}***@${domain}`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.cardStats.title}</h2>
              {card && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {card.senderName} • Created {formatDistanceToNow(new Date(card.createdAt), { addSuffix: true })}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.cardStats.totalRecipients}</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {recipients.length}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.cardStats.totalViews}</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {totalViews}
                    </div>
                  </div>
                </div>

                {/* Add Recipients Button */}
                <button
                  onClick={() => {
                    onAddRecipients(cardId)
                    onClose()
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  {t.cardStats.addMoreRecipients}
                </button>

                {/* Recipients Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t.cardStats.recipients}
                  </h3>
                  <div className="space-y-2">
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {/* Name & Email */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {recipient.name}
                          </div>
                          {recipient.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-3 h-3" />
                              {maskEmail(recipient.email)}
                            </div>
                          )}
                        </div>

                        {/* View Stats */}
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                            <Eye className="w-4 h-4" />
                            <span className="font-semibold">{recipient.viewCount}</span>
                          </div>
                          {recipient.firstViewedAt && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(recipient.firstViewedAt), { addSuffix: true })}
                            </div>
                          )}
                          {!recipient.firstViewedAt && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {t.cardStats.notViewed}
                            </div>
                          )}
                        </div>

                        {/* Copy URL Button */}
                        <button
                          onClick={() => copyUrl(recipient.personalSlug, recipient.id)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={t.cardStats.copyLink}
                        >
                          {copiedId === recipient.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
