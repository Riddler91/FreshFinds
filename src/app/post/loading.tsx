export default function PostLoading() {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-cream-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-sage-200 border-t-sage-500 animate-spin" />
        <p className="text-ink-muted text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
