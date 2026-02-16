"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Trash2, UserPlus } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface AddRecipientsModalProps {
  cardId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface RecipientInput {
  id: string
  name: string
}

export function AddRecipientsModal({ cardId, isOpen, onClose, onSuccess }: AddRecipientsModalProps) {
  const { t } = useTranslation()
  const [recipients, setRecipients] = useState<RecipientInput[]>([
    { id: "1", name: "" },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      { id: Date.now().toString(), name: "" },
    ])
  }

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((r) => r.id !== id))
    }
  }

  const updateRecipient = (id: string, value: string) => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, name: value } : r))
    )
  }

  const handleSubmit = async () => {
    setError(null)

    // Validate
    const validRecipients = recipients.filter((r) => r.name.trim())
    if (validRecipients.length === 0) {
      setError(t.addRecipientsDialog.errorNoName)
      return
    }

    if (!cardId) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/cards/${cardId}/recipients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: validRecipients.map((r) => ({
            name: r.name.trim(),
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add recipients")
      }

      onSuccess()
      onClose()
      // Reset form
      setRecipients([{ id: "1", name: "" }])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add recipients")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.addRecipientsDialog.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {recipients.map((recipient, index) => (
              <div
                key={recipient.id}
                className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t.addRecipientsDialog.namePlaceholder}
                    value={recipient.name}
                    onChange={(e) => updateRecipient(recipient.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                  />
                </div>
                {recipients.length > 1 && (
                  <button
                    onClick={() => removeRecipient(recipient.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                )}
              </div>
            ))}

            {/* Add Recipient Button */}
            <button
              onClick={addRecipient}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-rose-600 dark:hover:border-rose-600 text-gray-600 dark:text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.addRecipientsDialog.addAnother}
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {t.addRecipientsDialog.adding}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {t.addRecipientsDialog.addButton}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
