"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Leaf, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      <div className="flex-1 max-w-lg mx-auto w-full px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-terra-50 flex items-center justify-center shadow-warm">
          <Leaf className="w-12 h-12 text-terra-400" strokeWidth={1} />
        </div>
        <h1 className="text-2xl font-bold font-serif text-ink mb-3">
          Something went wrong
        </h1>
        <p className="text-ink-muted mb-8 max-w-xs leading-relaxed">
          We hit a snag loading this page. It might be a temporary hiccup — give it another try.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-terra-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-card text-ink-light font-bold px-6 py-3.5 rounded-2xl border border-cream-200 hover:bg-cream-50 transition-all shadow-warm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
