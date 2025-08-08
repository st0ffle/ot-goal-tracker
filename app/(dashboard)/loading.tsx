export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm border-b h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-4">
            <div className="h-32 bg-white rounded-lg shadow"></div>
            <div className="h-32 bg-white rounded-lg shadow"></div>
            <div className="h-32 bg-white rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    </div>
  )
}