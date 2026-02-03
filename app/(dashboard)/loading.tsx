export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-9 w-64 bg-slate-200 rounded mb-2" />
        <div className="h-5 w-48 bg-slate-100 rounded" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-1 bg-slate-200" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="w-10 h-10 bg-slate-100 rounded-full" />
              </div>
              <div className="h-10 w-12 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-slate-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
