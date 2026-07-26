export default function OnboardingLoading() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      <div className="bg-cream-50/95 backdrop-blur-md border-b border-cream-200/60 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <div className="skeleton-warm w-5 h-5 rounded mr-3" />
          <div className="skeleton-warm h-6 w-40 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-1 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className="skeleton-warm w-10 h-10 rounded-full" />
              </div>
              {i < 3 && <div className="flex-1 h-1 rounded-full skeleton-warm" />}
            </div>
          ))}
        </div>
        <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton-warm h-5 w-24 rounded-lg" />
              <div className="skeleton-warm h-12 w-full rounded-2xl" />
            </div>
          ))}
          <div className="skeleton-warm h-12 w-full rounded-2xl mt-6" />
        </div>
      </div>
    </div>
  );
}
