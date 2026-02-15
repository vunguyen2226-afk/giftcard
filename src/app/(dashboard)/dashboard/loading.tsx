// Dashboard loading skeleton
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Action button skeleton */}
        <div className="mb-8">
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 animate-pulse"
            >
              {/* Template image skeleton */}
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />

              {/* Card info skeleton */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />

                {/* Stats skeleton */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>

                {/* Actions skeleton */}
                <div className="flex gap-2 pt-4">
                  <div className="h-9 flex-1 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
