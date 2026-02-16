"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { CardListItem } from "@/components/dashboard/card-list-item"
import { CardStatsModal } from "@/components/dashboard/card-stats-modal"
import { DeleteCardDialog } from "@/components/dashboard/delete-card-dialog"
import { ShareModal } from "@/components/dashboard/share-modal"
import { AddRecipientsModal } from "@/components/dashboard/add-recipients-modal"

interface Card {
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

interface DashboardClientProps {
  cards: Card[]
  userName: string
  stats: {
    totalCards: number
    totalRecipients: number
    totalViews: number
  }
}

export function DashboardClient({ cards: initialCards, userName, stats }: DashboardClientProps) {
  const [cards, setCards] = useState(initialCards)
  const [statsModalCardId, setStatsModalCardId] = useState<string | null>(null)
  const [deleteDialogCard, setDeleteDialogCard] = useState<{ id: string; name: string } | null>(null)
  const [shareModalData, setShareModalData] = useState<{ url: string; title: string } | null>(null)
  const [addRecipientsCardId, setAddRecipientsCardId] = useState<string | null>(null)

  const handleDelete = async (cardId: string) => {
    const res = await fetch(`/api/cards/${cardId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setCards(cards.filter((c) => c.id !== cardId))
    } else {
      throw new Error("Failed to delete card")
    }
  }

  const handleViewStats = (cardId: string) => {
    setStatsModalCardId(cardId)
  }

  const handleShare = (cardId: string, url: string) => {
    const card = cards.find((c) => c.id === cardId)
    setShareModalData({
      url,
      title: `${card?.senderName}'s New Year Card`,
    })
  }

  const handleAddRecipients = (cardId: string) => {
    setAddRecipientsCardId(cardId)
  }

  const refreshCards = async () => {
    // Refresh cards list after adding recipients
    const res = await fetch("/api/cards")
    if (res.ok) {
      const data = await res.json()
      setCards(
        data.cards.map((card: any) => ({
          id: card.id,
          templateId: card.templateId,
          senderName: card.senderName,
          message: card.message,
          primaryColor: card.primaryColor,
          createdAt: card.createdAt,
          recipients: card.recipients,
        }))
      )
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your greeting cards and create new ones
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Card
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Cards
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalCards}
          </div>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Recipients
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalRecipients}
          </div>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Views
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalViews}
          </div>
        </div>
      </div>

      {/* Cards Grid or Empty State */}
      {cards.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-gray-400 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                No cards yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Get started by creating your first greeting card. Choose from beautiful templates
                and personalize it with your message.
              </p>
            </div>
            <Link
              href="/create"
              className="mt-4 rounded-lg bg-rose-600 px-6 py-3 text-sm font-medium text-white hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Card
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardListItem
              key={card.id}
              card={card}
              onDelete={(id) => setDeleteDialogCard({ id, name: card.senderName })}
              onViewStats={handleViewStats}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CardStatsModal
        cardId={statsModalCardId || ""}
        isOpen={!!statsModalCardId}
        onClose={() => setStatsModalCardId(null)}
        onAddRecipients={handleAddRecipients}
      />

      <DeleteCardDialog
        cardId={deleteDialogCard?.id || null}
        cardName={deleteDialogCard?.name || ""}
        isOpen={!!deleteDialogCard}
        onClose={() => setDeleteDialogCard(null)}
        onConfirm={handleDelete}
      />

      <ShareModal
        cardUrl={shareModalData?.url || ""}
        cardTitle={shareModalData?.title || ""}
        isOpen={!!shareModalData}
        onClose={() => setShareModalData(null)}
      />

      <AddRecipientsModal
        cardId={addRecipientsCardId}
        isOpen={!!addRecipientsCardId}
        onClose={() => setAddRecipientsCardId(null)}
        onSuccess={refreshCards}
      />
    </div>
  )
}
