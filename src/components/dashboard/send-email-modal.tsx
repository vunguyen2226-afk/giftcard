"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface SendEmailModalProps {
  cardId: string | null
  recipientCount: number
  isOpen: boolean
  onClose: () => void
}

export function SendEmailModal({ cardId, recipientCount, isOpen, onClose }: SendEmailModalProps) {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; errors: any[] } | null>(null)

  const handleSend = async () => {
    if (!cardId) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch(`/api/cards/${cardId}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send emails")
      }

      setResult(data)
    } catch (error) {
      console.error("Failed to send emails:", error)
      setResult({ sent: 0, failed: recipientCount, errors: [{ error: error instanceof Error ? error.message : "Unknown error" }] })
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setResult(null)
    onClose()
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.sendEmailDialog.title}</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {!result && !sending && (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/20 mx-auto">
                  <Mail className="w-8 h-8 text-rose-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {t.sendEmailDialog.description}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>{t.sendEmailDialog.note}</strong> {t.sendEmailDialog.noteDetail}
                  </p>
                </div>
              </>
            )}

            {sending && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-600 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">{t.sendEmailDialog.sending}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {result.sent > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        {t.sendEmailDialog.successTitle}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {result.sent} {t.sendEmailDialog.successMessage}
                      </p>
                    </div>
                  </div>
                )}

                {result.failed > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">
                        {t.sendEmailDialog.failTitle}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {result.failed} {t.sendEmailDialog.failMessage}
                      </p>
                      {result.errors.length > 0 && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                          {result.errors[0].error}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {!result && !sending && (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t.sendEmailDialog.sendButton}
                </button>
              </>
            )}

            {result && (
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                {t.sendEmailDialog.done}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
