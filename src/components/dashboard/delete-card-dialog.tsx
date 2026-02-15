"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Trash2, X, AlertTriangle } from "lucide-react"

interface DeleteCardDialogProps {
  cardId: string | null
  cardName: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (cardId: string) => Promise<void>
}

export function DeleteCardDialog({
  cardId,
  cardName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteCardDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!cardId) return

    setDeleting(true)
    try {
      await onConfirm(cardId)
      onClose()
    } catch (error) {
      console.error("Failed to delete card:", error)
    } finally {
      setDeleting(false)
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
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6"
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>

          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Delete Card
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Are you sure you want to delete <strong>{cardName}</strong>? This will permanently
            delete the card and all recipient links. This action cannot be undone.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
