"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200/60">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center group-hover:bg-sage-200 transition-colors">
            <Leaf className="w-4 h-4 text-sage-600" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold font-serif text-ink tracking-tight">
            FreshFinds
          </span>
        </Link>
        <span className="text-xs text-ink-muted bg-cream-100 px-2.5 py-1 rounded-full font-medium border border-cream-200/50">
          Austin, TX
        </span>
      </div>
    </header>
  );
}
