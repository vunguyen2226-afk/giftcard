"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { MoreVertical, Eye, Edit, Share2, Trash2, Mail, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useTranslation } from "@/lib/i18n"

interface CardListItemProps {
  card: {
    id: string
    templateId: string
    senderName: string
    message: string
    primaryColor: string
    createdAt: string
    recipients: Array<{
      id: string
      personalSlug: string
      viewCount: number
    }>
  }
  onDelete: (id: string) => void
  onViewStats: (id: string) => void
  onShare: (id: string, url: string) => void
  onSendEmail: (id: string) => void
}

export function CardListItem({
  card,
  onDelete,
  onViewStats,
  onShare,
  onSendEmail,
}: CardListItemProps) {
  const { t } = useTranslation()
  const [showMenu, setShowMenu] = useState(false)

  const totalViews = card.recipients.reduce((sum, r) => sum + r.viewCount, 0)
  const recipientCount = card.recipients.length
  const firstRecipientSlug = card.recipients[0]?.personalSlug || ""
  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/card/${firstRecipientSlug}`

  const messagePreview =
    card.message.length > 100 ? card.message.slice(0, 100) + "..." : card.message

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Color accent bar */}
      <div
        className="h-2"
        style={{ backgroundColor: card.primaryColor }}
      />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {card.senderName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(card.createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <Link
                  href={cardUrl}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Eye className="w-4 h-4" />
                  {t.dashboardMenu.viewCard}
                </Link>
                <button
                  onClick={() => {
                    onViewStats(card.id)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Users className="w-4 h-4" />
                  {t.dashboardMenu.viewStats}
                </button>
                <button
                  onClick={() => {
                    onShare(card.id, cardUrl)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4" />
                  {t.dashboardMenu.share}
                </button>
                <button
                  onClick={() => {
                    onSendEmail(card.id)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Mail className="w-4 h-4" />
                  {t.dashboardMenu.sendEmails}
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button
                  onClick={() => {
                    onDelete(card.id)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.dashboardMenu.delete}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Preview */}
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {messagePreview}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipientCount} {t.dashboardMenu.recipientsSuffix}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{totalViews} {t.dashboardMenu.viewsSuffix}</span>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  )
}
