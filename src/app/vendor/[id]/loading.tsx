export default function VendorLoading() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      <div className="animate-pulse">
        <div className="aspect-[3/2] bg-cream-200" />
        <div className="max-w-lg mx-auto w-full px-4 -mt-6 relative z-10">
          <div className="bg-card rounded-3xl shadow-warm-lg p-5">
            <div className="skeleton-warm h-7 w-1/2 mb-2 rounded-lg" />
            <div className="skeleton-warm h-5 w-3/4 mb-4 rounded-lg" />
            <div className="skeleton-warm h-4 w-full mb-3 rounded-lg" />
            <div className="skeleton-warm h-4 w-2/3 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto w-full px-4 mt-6 space-y-4">
        <div className="skeleton-warm h-6 w-48 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="skeleton-warm w-28 h-28 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-warm h-5 w-3/4 rounded-lg" />
              <div className="skeleton-warm h-4 w-1/2 rounded-lg" />
              <div className="skeleton-warm h-4 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
