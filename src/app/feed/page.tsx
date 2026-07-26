"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  Flame,
  SlidersHorizontal,
  RefreshCw,
  MapPin,
  ChevronDown,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
type PostType = "baked_today" | "harvested_today" | "just_made" | "limited_batch" | "available_now";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | null;
  quantity: number | null;
  photoUrl: string | null;
  dietaryTags: string | null;
  vendorName: string;
  vendorId: number;
  categoryIcon: string | null;
  postType: PostType;
  postedAt: string;
  expiresAt: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
}

/* ── Post type config ──────────────────────────────────────── */
const POST_TYPE_CONFIG: Record<PostType, { emoji: string; label: string; bgClass: string; textClass: string }> = {
  baked_today: { emoji: "🥖", label: "Baked fresh this morning", bgClass: "bg-honey-50", textClass: "text-honey-700" },
  harvested_today: { emoji: "🌽", label: "Picked this morning", bgClass: "bg-sage-50", textClass: "text-sage-700" },
  just_made: { emoji: "🍪", label: "Cooling on the rack", bgClass: "bg-terra-50", textClass: "text-terra-600" },
  limited_batch: { emoji: "✨", label: "Small batch", bgClass: "bg-honey-50", textClass: "text-honey-700" },
  available_now: { emoji: "🛒", label: "Ready for pickup", bgClass: "bg-sage-50", textClass: "text-sage-600" },
};

/* ── Filter categories ─────────────────────────────────────── */
type FilterTab = "all" | "baked_today" | "harvested_today" | "just_made" | "limited_batch";

const FILTER_TABS: { key: FilterTab; label: string; emoji: string }[] = [
  { key: "all", label: "All Fresh", emoji: "🌟" },
  { key: "baked_today", label: "Baked Today", emoji: "🥖" },
  { key: "harvested_today", label: "Produce", emoji: "🌽" },
  { key: "just_made", label: "Just Made", emoji: "🍪" },
  { key: "limited_batch", label: "Limited", emoji: "✨" },
];

type SortMode = "newest" | "price-low" | "price-high" | "closest";

/* ── Helpers ───────────────────────────────────────────────── */
const FALLBACK_FOOD_IMG = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getFreshnessLevel(postedAt: string): "just-posted" | "fresh" | "recent" | "stale" {
  const diff = Date.now() - new Date(postedAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return "just-posted";
  if (mins < 240) return "fresh";
  if (mins < 720) return "recent";
  return "stale";
}

function formatPickupWindow(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${fmt(s)}–${fmt(e)} today`;
}

function parseDietaryTags(tags: string | null): string[] {
  if (!tags) return [];
  try { return JSON.parse(tags); } catch { return []; }
}

function getHourCount(): number {
  // Count listings posted in the last hour
  return 0; // Will be computed from data
}

/* ── Component ─────────────────────────────────────────────── */
export default function FeedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [autoRefreshCount, setAutoRefreshCount] = useState(0);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Fetch listings ──────────────────────────────────────── */
  const fetchListings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/listings?fresh=true");
      const data = await res.json();
      setListings(data.listings || []);
      setLastRefreshed(new Date());
      setAutoRefreshCount((c) => c + 1);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
    // Auto-refresh every 60 seconds
    refreshTimer.current = setInterval(() => fetchListings(true), 60000);
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [fetchListings]);

  /* ── Derived data ────────────────────────────────────────── */
  const filteredListings = (() => {
    let result = listings.filter((l) => new Date(l.expiresAt).getTime() > Date.now());

    // Apply filter tab
    if (activeFilter !== "all") {
      result = result.filter((l) => l.postType === activeFilter);
    }

    // Sort
    switch (sortMode) {
      case "newest":
        result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "closest":
        // Keep original order for closest (no real location data in feed)
        break;
    }

    return result;
  })();

  const itemsPostedLastHour = listings.filter((l) => {
    const diff = Date.now() - new Date(l.postedAt).getTime();
    return diff < 3600000;
  }).length;

  const totalFresh = listings.filter((l) => new Date(l.expiresAt).getTime() > Date.now()).length;

  /* ── Loading skeleton ────────────────────────────────────── */
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-2xl p-4 shadow-warm animate-fade-in-up">
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
  );

  /* ── Freshness badge ─────────────────────────────────────── */
  const FreshnessBadge = ({ postedAt }: { postedAt: string }) => {
    const level = getFreshnessLevel(postedAt);
    const config = {
      "just-posted": { bg: "bg-honey-100", text: "text-honey-800", border: "border-honey-300/60", label: "Just Posted!", dot: "bg-honey-500", pulse: true },
      fresh: { bg: "bg-sage-50", text: "text-sage-700", border: "border-sage-200/60", label: "Fresh", dot: "bg-sage-500", pulse: false },
      recent: { bg: "bg-cream-100", text: "text-ink-light", border: "border-cream-300/60", label: timeAgo(postedAt), dot: "", pulse: false },
      stale: { bg: "bg-cream-50", text: "text-ink-muted", border: "border-cream-200/40", label: timeAgo(postedAt), dot: "", pulse: false },
    }[level];

    return (
      <div className={`absolute top-3 left-3 ${config.bg} ${config.text} border ${config.border} backdrop-blur rounded-full px-2.5 py-1 text-xs font-bold shadow-warm flex items-center gap-1.5 z-10`}>
        {config.dot && (
          <span className="relative flex h-2 w-2">
            {config.pulse && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-honey-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
          </span>
        )}
        {config.label}
      </div>
    );
  };

  /* ── Quantity bar ────────────────────────────────────────── */
  const QuantityBar = ({ quantity }: { quantity: number }) => {
    // Visual: low stock warning
    const isLow = quantity <= 3;
    const pct = Math.min(100, Math.max(0, (quantity / 12) * 100));
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold ${isLow ? "text-terra-500" : "text-ink-muted"}`}>
            {isLow ? `🔥 Only ${quantity} left!` : `${quantity} available`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-terra-400" : "bg-sage-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  /* ── Empty state ─────────────────────────────────────────── */
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-cream-100 flex items-center justify-center shadow-warm">
        <span className="text-5xl">🌅</span>
      </div>
      <p className="text-ink-light text-xl font-bold font-serif mb-3">
        Nothing fresh right now
      </p>
      <p className="text-ink-muted text-sm max-w-xs mx-auto leading-relaxed mb-6">
        Check back soon — vendors post throughout the day! Fresh bread, produce, and homemade goods appear here as they&apos;re made.
      </p>
      <div className="bg-honey-50 border border-honey-200/40 rounded-2xl p-4 max-w-sm mx-auto">
        <p className="text-sm text-honey-800 font-semibold">
          💡 Know a local vendor? Tell them to post their fresh items on FreshFinds!
        </p>
      </div>
    </div>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* ─── Golden gradient hero ───────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-honey-200/30 via-honey-100/20 to-cream-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-honey-300/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sage-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-lg mx-auto px-4 pt-8 pb-5">
          {/* Live indicator row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur border border-cream-200/60 rounded-full px-3 py-1.5 shadow-warm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
                </span>
                <span className="text-xs font-bold text-success tracking-wide uppercase">Live</span>
              </div>
              {itemsPostedLastHour > 0 && (
                <span className="text-xs text-ink-muted font-medium">
                  {itemsPostedLastHour} new in the last hour
                </span>
              )}
            </div>
            <button
              onClick={() => fetchListings()}
              className="flex items-center gap-1.5 bg-card/80 backdrop-blur border border-cream-200/60 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink-light transition-colors shadow-warm"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Refreshed </span>
              {lastRefreshed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </button>
          </div>

          {/* Main hero title */}
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-ink mb-2">
            <span className="inline-block">🍞</span> Fresh Right Now
          </h1>
          <p className="text-sm text-ink-muted max-w-sm leading-relaxed">
            What&apos;s available near you today — baked this morning, picked fresh, made with love.
          </p>
        </div>
      </div>

      {/* ─── Filter + Sort bar ──────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-md border-b border-cream-200/60">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-2">
          {/* Filter chips — scrollable */}
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key;
              const count = tab.key === "all"
                ? totalFresh
                : listings.filter((l) => l.postType === tab.key && new Date(l.expiresAt).getTime() > Date.now()).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-sage-500 text-white shadow-warm scale-105"
                      : "bg-card/90 text-ink-light border border-cream-200/60 hover:bg-cream-100 shadow-warm"
                  }`}
                >
                  {tab.emoji} {tab.label}
                  {count > 0 && (
                    <span className={`ml-1 text-[10px] ${isActive ? "text-white/80" : "text-ink-muted"}`}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 bg-card/90 border border-cream-200/60 rounded-full px-3 py-2 text-xs font-bold text-ink-light hover:bg-cream-100 transition-colors shadow-warm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {sortMode === "newest" ? "Newest" : sortMode === "price-low" ? "Price ↑" : sortMode === "price-high" ? "Price ↓" : "Closest"}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 top-full mt-1.5 bg-card rounded-2xl shadow-warm-lg border border-cream-200/60 p-1.5 z-50 min-w-[140px] animate-fade-in-up">
                  {[
                    { mode: "newest" as SortMode, label: "Newest first" },
                    { mode: "price-low" as SortMode, label: "Price: Low → High" },
                    { mode: "price-high" as SortMode, label: "Price: High → Low" },
                    { mode: "closest" as SortMode, label: "Closest" },
                  ].map((opt) => (
                    <button
                      key={opt.mode}
                      onClick={() => { setSortMode(opt.mode); setShowSortMenu(false); }}
                      className={`block w-full text-left px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                        sortMode === opt.mode
                          ? "bg-sage-50 text-sage-700"
                          : "text-ink-light hover:bg-cream-50"
                      }`}
                    >
                      {sortMode === opt.mode && "✓ "}{opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Feed content ────────────────────────────────────────── */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {loading && listings.length === 0 ? (
          renderSkeletons()
        ) : filteredListings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing, idx) => {
              const typeConfig = POST_TYPE_CONFIG[listing.postType] || POST_TYPE_CONFIG.available_now;
              const dietaryTags = parseDietaryTags(listing.dietaryTags);

              return (
                <Link
                  key={listing.id}
                  href={`/vendor/${listing.vendorId}`}
                  className={`block bg-card rounded-2xl shadow-warm border border-cream-200/40 overflow-hidden card-hover animate-fade-in-up ${
                    idx > 0 ? `animate-fade-in-up-delay-${Math.min(idx, 2)}` : ""
                  }`}
                >
                  {/* Photo */}
                  <div className="aspect-[16/9] bg-cream-100 overflow-hidden relative">
                    <img
                      src={listing.photoUrl || FALLBACK_FOOD_IMG}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Freshness badge */}
                    <FreshnessBadge postedAt={listing.postedAt} />
                  </div>

                  <div className="p-4">
                    {/* Post type banner */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-2 ${typeConfig.bgClass} ${typeConfig.textClass} border border-current/10`}>
                      {typeConfig.emoji} {typeConfig.label}
                    </div>

                    {/* Title + Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-ink font-serif leading-snug">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-ink-muted mt-1 line-clamp-2 leading-relaxed">
                          {listing.description}
                        </p>
                      </div>
                      {listing.price !== null && (
                        <span className="text-honey-600 font-bold text-xl whitespace-nowrap bg-honey-50 px-3 py-1.5 rounded-xl border border-honey-200/30">
                          ${listing.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity bar */}
                    {listing.quantity !== null && listing.quantity !== undefined && (
                      <QuantityBar quantity={listing.quantity} />
                    )}

                    {/* Pickup window */}
                    {listing.pickupWindowStart && listing.pickupWindowEnd && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-ink-muted">
                        <Clock className="w-3 h-3" />
                        <span>Pickup: {formatPickupWindow(listing.pickupWindowStart, listing.pickupWindowEnd)}</span>
                      </div>
                    )}

                    {/* Tags row */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {/* Vendor */}
                      <span className="text-xs font-semibold text-ink-muted bg-cream-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {listing.vendorName}
                      </span>

                      {/* Category */}
                      {listing.categoryIcon && (
                        <span className="text-xs font-semibold bg-sage-50 text-sage-600 px-2.5 py-1 rounded-full border border-sage-200/40">
                          {listing.categoryIcon}
                        </span>
                      )}

                      {/* Dietary tags */}
                      {dietaryTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs font-semibold bg-honey-50 text-honey-700 px-2.5 py-1 rounded-full border border-honey-200/40">
                          {tag}
                        </span>
                      ))}
                      {dietaryTags.length > 2 && (
                        <span className="text-xs font-semibold text-ink-muted">+{dietaryTags.length - 2}</span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-ink-muted mt-2 flex items-center gap-1">
                      🕐 Posted {timeAgo(listing.postedAt)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-24" />
      </div>
    </div>
  );
}
