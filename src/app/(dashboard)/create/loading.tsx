// Create page loading skeleton
export default function CreateLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Step indicator skeleton */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              {i < 3 && (
                <div className="h-0.5 w-12 bg-gray-200 dark:bg-gray-800 animate-pulse mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Form container skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Form title */}
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

            {/* Form fields */}
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* Grid items (for template selection) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between pt-6">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
