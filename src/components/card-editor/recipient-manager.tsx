import { useState } from "react"
import { useTranslation } from "@/lib/i18n"

interface Recipient {
  name: string
  email?: string
}

interface RecipientManagerProps {
  recipients: Recipient[]
  onAdd: (recipient: Recipient) => void
  onRemove: (index: number) => void
  onBulkAdd: (recipients: Recipient[]) => void
}

export function RecipientManager({ recipients, onAdd, onRemove, onBulkAdd }: RecipientManagerProps) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState("")

  const handleAdd = () => {
    if (!name.trim()) return

    onAdd({ name: name.trim(), email: email.trim() || undefined })
    setName("")
    setEmail("")
  }

  const handleBulkAdd = () => {
    const lines = bulkText.split("\n").filter((line) => line.trim())
    const newRecipients = lines.map((line) => {
      const parts = line.split(",").map((p) => p.trim())
      return {
        name: parts[0],
        email: parts[1] || undefined,
      }
    })

    if (newRecipients.length > 0) {
      onBulkAdd(newRecipients)
      setBulkText("")
      setBulkMode(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.recipients.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t.recipients.subtitle}
        </p>
      </div>

      {/* Toggle Bulk Mode */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setBulkMode(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !bulkMode
              ? "bg-rose-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          Add One by One
        </button>
        <button
          onClick={() => setBulkMode(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            bulkMode
              ? "bg-rose-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          Bulk Add
        </button>
      </div>

      {/* Single Add Mode */}
      {!bulkMode && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder={t.recipients.namePlaceholder}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder={t.recipients.emailPlaceholder}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="w-full md:w-auto px-6 py-2 bg-rose-600 text-white rounded-lg
                     hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
          >
            {t.recipients.addButton}
          </button>
        </div>
      )}

      {/* Bulk Add Mode */}
      {bulkMode && (
        <div className="space-y-3">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Enter one recipient per line&#10;Format: Name, Email (optional)&#10;Example:&#10;John Doe, john@example.com&#10;Jane Smith&#10;Bob Wilson, bob@example.com"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-rose-500 focus:border-transparent
                     resize-none font-mono text-sm"
          />
          <button
            onClick={handleBulkAdd}
            disabled={!bulkText.trim()}
            className="w-full md:w-auto px-6 py-2 bg-rose-600 text-white rounded-lg
                     hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
          >
            {t.recipients.addButton}
          </button>
        </div>
      )}

      {/* Recipients List */}
      {recipients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {recipients.length} {t.recipients.recipientCount}
            </h3>
            {recipients.length > 50 && (
              <span className="text-sm text-red-600 dark:text-red-400">
                {t.recipients.maxRecipients}
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {recipients.map((recipient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900
                         rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{recipient.name}</p>
                  {recipient.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{recipient.email}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label="Remove recipient"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recipients.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-3 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p>{t.recipients.noRecipients}</p>
        </div>
      )}
    </div>
  )
}
