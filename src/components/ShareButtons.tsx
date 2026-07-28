"use client";

import { ExternalLink } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // Simple feedback
    const btn = document.activeElement as HTMLButtonElement;
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = orig; }, 1500);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopyLink}
        className="px-4 py-2 bg-cream-100 text-ink-light text-sm font-semibold rounded-xl hover:bg-cream-200 transition-colors"
      >
        Copy Link
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-sage-100 text-sage-700 text-sm font-semibold rounded-xl hover:bg-sage-200 transition-colors flex items-center gap-1"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Share
      </a>
    </div>
  );
}
