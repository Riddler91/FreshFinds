"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Clock, PlusCircle, Store } from "lucide-react";

const navItems = [
  { href: "/", label: "Map", icon: MapPin },
  { href: "/feed", label: "Fresh Now", icon: Clock },
  { href: "/post", label: "Post", icon: PlusCircle },
  { href: "/onboarding", label: "Sell", icon: Store },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-md border-t border-cream-200/60 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-xs gap-0.5 transition-all duration-200 relative ${
                isActive
                  ? "text-sage-600"
                  : "text-ink-muted hover:text-ink-light"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? "scale-110" : ""
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`font-semibold ${isActive ? "" : "font-medium"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-8 h-0.5 bg-sage-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
