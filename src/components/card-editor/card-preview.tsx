import { useState } from "react"
import { useRouter } from "next/navigation"
import { getTemplateComponent, getTemplate } from "@/templates"
import { EditorState } from "@/types"
import { useTranslation } from "@/lib/i18n"

interface CardPreviewProps {
  editorState: EditorState
}

export function CardPreview({ editorState }: CardPreviewProps) {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const template = getTemplate(editorState.templateId)
  const TemplateComponent = getTemplateComponent(editorState.templateId)

  const recipientCount = editorState.recipientNames.length

  const handleSubmit = async () => {
    setError("")
    setSubmitting(true)

    try {
      const recipients = editorState.recipientNames.map((name) => ({
        name,
      }))

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: editorState.templateId,
          senderName: editorState.senderName,
          message: editorState.message,
          fontFamily: editorState.fontFamily,
          primaryColor: editorState.primaryColor,
          effect: editorState.effect,
          imageUrl: editorState.imageUrl,
          backgroundMusic: editorState.backgroundMusic,
          backgroundPresetId: editorState.backgroundPresetId,
          recipients,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create card")
      }

      const { card } = await response.json()

      // Redirect to dashboard with success message
      router.push(`/dashboard?created=${card.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create card")
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.cardPreview.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t.cardPreview.subtitle}
        </p>
      </div>

      {/* Card Preview */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
        <div className="aspect-[4/3] flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800">
          <div className="w-full max-w-2xl transform scale-90">
            <TemplateComponent
              senderName={editorState.senderName}
              recipientName={editorState.recipientNames[0] || "Recipient"}
              message={editorState.message}
              fontFamily={editorState.fontFamily}
              primaryColor={editorState.primaryColor}
              imageUrl={editorState.imageUrl}
              backgroundPresetId={editorState.backgroundPresetId}
            />
          </div>
        </div>
      </div>

      {/* Card Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t.cardPreview.summary}</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">{t.cardPreview.template}</p>
            <p className="font-medium text-gray-900 dark:text-white">{template?.name || "Unknown"}</p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">{t.cardPreview.effect}</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {editorState.effect.replace("_", " ")}
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">{t.cardPreview.recipientsLabel}</p>
            <p className="font-medium text-gray-900 dark:text-white">{recipientCount} {t.cardPreview.people}</p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">{t.cardPreview.backgroundMusic}</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {editorState.backgroundMusic ? t.cardPreview.yes : t.cardPreview.no}
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">{t.cardPreview.customImage}</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {editorState.imageUrl ? t.cardPreview.yes : t.cardPreview.no}
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">{t.cardPreview.font}</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {editorState.fontFamily.replace("-", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 bg-rose-600 text-white rounded-lg font-semibold text-lg
                 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            {t.cardPreview.sending}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {t.cardPreview.sendButton}
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {t.cardPreview.uniqueLinkNote}
      </p>
    </div>
  )
}
