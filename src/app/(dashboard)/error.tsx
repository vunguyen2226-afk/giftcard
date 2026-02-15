"use client"

// Dashboard-specific error boundary

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Unable to load dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || "We encountered an error loading your cards. Please try again."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
