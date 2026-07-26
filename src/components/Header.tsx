"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥬</span>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            FreshFinds
          </span>
        </Link>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Austin, TX
        </span>
      </div>
    </header>
  );
}
