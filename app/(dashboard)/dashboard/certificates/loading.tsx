export default function CertificatesLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-9 w-64 bg-slate-200 rounded" />
          <div className="h-5 w-96 bg-slate-100 rounded" />
        </div>
        <div className="h-11 w-40 bg-slate-200 rounded-lg" />
      </div>

      {/* Certificate cards skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-1 bg-slate-200" />
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-slate-200 rounded" />
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-16 bg-slate-100 rounded" />
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <div className="h-10 w-24 bg-slate-100 rounded-lg" />
                <div className="h-10 w-36 bg-slate-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
