import { useState } from "react"
import { GREETING_SUGGESTIONS, getGreetingsByLanguage } from "@/lib/greeting-suggestions"
import { useTranslation } from "@/lib/i18n"

interface MessageEditorProps {
  senderName: string
  message: string
  onSenderNameChange: (name: string) => void
  onMessageChange: (message: string) => void
}

export function MessageEditor({
  senderName,
  message,
  onSenderNameChange,
  onMessageChange,
}: MessageEditorProps) {
  const { t } = useTranslation()
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = getGreetingsByLanguage(language)
  const charCount = message.length
  const maxChars = 500

  return (
    <div className="space-y-4">
      {/* Sender Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.message.senderLabel}
        </label>
        <input
          type="text"
          value={senderName}
          onChange={(e) => onSenderNameChange(e.target.value)}
          placeholder={t.message.senderPlaceholder}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      {/* Message Textarea */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.message.messageLabel}
          </label>
          <span
            className={`text-sm ${charCount > maxChars ? "text-red-600" : "text-gray-500 dark:text-gray-400"}`}
          >
            {charCount}/{maxChars}
          </span>
        </div>
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={t.message.messagePlaceholder}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-rose-500 focus:border-transparent
                   resize-none"
        />
      </div>

      {/* Greeting Suggestions */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700
                     flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {showSuggestions ? t.messageEditor.hide : t.messageEditor.show} {t.message.suggestions}
          </button>

          {showSuggestions && (
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  language === "en"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("vi")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  language === "vi"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Tiếng Việt
              </button>
            </div>
          )}
        </div>

        {showSuggestions && (
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => onMessageChange(suggestion.text)}
                className="text-left p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200
                         dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600
                         hover:shadow-sm transition-all text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-700 dark:text-gray-300">{suggestion.text}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize whitespace-nowrap">
                    {suggestion.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
