// Card viewer loading placeholder
export default function CardViewerLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Envelope silhouette with pulse animation */}
        <div className="relative w-64 h-40 mx-auto mb-8 animate-pulse">
          {/* Envelope body */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-amber-200 dark:from-rose-900/50 dark:to-amber-900/50 rounded-lg shadow-lg" />

          {/* Envelope flap */}
          <div
            className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-rose-300 to-amber-300 dark:from-rose-800/50 dark:to-amber-800/50 rounded-t-lg"
            style={{
              clipPath: "polygon(0 0, 50% 50%, 100% 0)"
            }}
          />

          {/* Envelope seal */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-400 dark:from-amber-600 dark:to-rose-600 rounded-full shadow-md" />
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
            Loading your card...
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-rose-500 dark:bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-rose-500 dark:bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-rose-500 dark:bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
