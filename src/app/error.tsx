"use client"

import { useTranslation } from "@/lib/i18n"

// Global error boundary for the entire application

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const { t } = useTranslation()

  return (
    <html>
      <body>
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error icon */}
            <div className="w-20 h-20 mx-auto bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-rose-600 dark:text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.error.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {error.message || t.error.description}
              </p>
              {error.digest && (
                <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
              >
                {t.error.tryAgain}
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
              >
                {t.notFound.goHome}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
