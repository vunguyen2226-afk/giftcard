"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { en, TranslationKeys } from "./en"
import { vi } from "./vi"
import React from "react"

// Supported locales
export type Locale = "en" | "vi"

const STORAGE_KEY = "giftcard-locale"
const DEFAULT_LOCALE: Locale = "vi"

const translations: Record<Locale, TranslationKeys> = { en, vi }

// Context
interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: vi,
})

// Provider
interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // Load saved locale on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved && translations[saved]) {
        setLocaleState(saved)
      }
    } catch {
      // localStorage unavailable (SSR or privacy mode)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // localStorage unavailable
    }
    // Update html lang attribute
    document.documentElement.lang = newLocale
  }, [])

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return React.createElement(LanguageContext.Provider, { value }, children)
}

// Hook
export function useTranslation() {
  return useContext(LanguageContext)
}

// Re-exports
export type { TranslationKeys }
export { en, vi }
