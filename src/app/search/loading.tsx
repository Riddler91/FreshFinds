export default function SearchLoading() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      <div className="sticky top-0 z-20 bg-cream-50/95 backdrop-blur border-b border-cream-200/60">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="skeleton-warm w-9 h-9 rounded-full" />
          <div className="flex-1 skeleton-warm h-11 rounded-full" />
        </div>
      </div>
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-sage-200 border-t-sage-500 animate-spin" />
          <p className="text-ink-muted text-sm font-medium">Searching...</p>
        </div>
      </div>
    </div>
  );
}
