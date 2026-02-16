"use client"

import { useTranslation } from "@/lib/i18n"

// Custom 404 page
export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 illustration */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Empty envelope */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-amber-200 dark:from-rose-900/30 dark:to-amber-900/30 rounded-lg shadow-lg opacity-50" />

          {/* Sad face on envelope */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            <span className="text-rose-400 dark:text-rose-600">😔</span>
          </div>

          {/* 404 text */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-6xl font-bold text-rose-500 dark:text-rose-400 opacity-20">
            404
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t.notFound.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.notFound.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
          >
            {t.notFound.goHome}
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
          >
            {t.nav.dashboard}
          </a>
        </div>
      </div>
    </div>
  )
}
