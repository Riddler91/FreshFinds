export default function FeedLoading() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden pb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-honey-200/30 via-honey-100/20 to-cream-50" />
        <div className="relative max-w-lg mx-auto px-4 pt-8 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="skeleton-warm h-8 w-24 rounded-full" />
            <div className="skeleton-warm h-8 w-32 rounded-full" />
          </div>
          <div className="skeleton-warm h-9 w-64 mb-2 rounded-lg" />
          <div className="skeleton-warm h-5 w-48 rounded-lg" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-md border-b border-cream-200/60">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-warm h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* Content skeletons */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-warm">
            <div className="skeleton-warm h-52 rounded-2xl mb-3" />
            <div className="skeleton-warm h-6 w-3/4 mb-2 rounded-lg" />
            <div className="skeleton-warm h-4 w-1/2 mb-2 rounded-lg" />
            <div className="flex gap-2">
              <div className="skeleton-warm h-8 w-20 rounded-full" />
              <div className="skeleton-warm h-8 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
