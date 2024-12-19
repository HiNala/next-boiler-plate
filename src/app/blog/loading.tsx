export default function BlogLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="h-12 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="flex-1 bg-white p-6">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="mt-6 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="ml-3">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 