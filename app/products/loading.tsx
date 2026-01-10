export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid Skeleton */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-3 bg-gray-100 rounded w-16 mb-2 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                    <div className="h-6 bg-gray-100 rounded w-12 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
