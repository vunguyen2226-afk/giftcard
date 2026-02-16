"use client"

import { useTranslation, Locale } from "@/lib/i18n"

const LOCALE_LABELS: Record<Locale, { flag: string; short: string }> = {
  en: { flag: "🇬🇧", short: "EN" },
  vi: { flag: "🇻🇳", short: "VI" },
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const nextLocale: Locale = locale === "en" ? "vi" : "en"
  const next = LOCALE_LABELS[nextLocale]

  return (
    <button
      onClick={() => setLocale(nextLocale)}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium
                 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors border border-gray-200 dark:border-gray-700"
      title={`Switch to ${nextLocale === "vi" ? "Tiếng Việt" : "English"}`}
    >
      <span>{next.flag}</span>
      <span>{next.short}</span>
    </button>
  )
}
