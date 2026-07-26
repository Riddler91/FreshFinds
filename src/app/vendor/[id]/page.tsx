"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────── */
interface VendorProfile {
  id: number;
  name: string;
  businessName: string;
  email?: string;
  phone?: string;
  website?: string;
  socialLinks?: string;
  address: string;
  lat: number;
  lng: number;
  bio: string | null;
  photoUrl: string | null;
  verified: boolean;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  rating: number;
  reviewCount: number;
  listingCount: number;
  hasFreshItems: boolean;
  createdAt: string;
}

interface ListingItem {
  id: number;
  title: string;
  description: string;
  price: number | null;
  quantity?: number;
  photoUrl: string | null;
  dietaryTags: string | null;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  ingredients: string | null;
  allergenWarning: string | null;
  isFresh?: boolean;
  createdAt?: string;
}

interface ReviewItem {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/* ── Constants ─────────────────────────────────────────────── */
const FALLBACK_COVER = "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80";
const DIETARY_COLORS: Record<string, string> = {
  vegan: "bg-green-100 text-green-700",
  vegetarian: "bg-green-100 text-green-700",
  "gluten-free": "bg-amber-100 text-amber-700",
  "dairy-free": "bg-blue-100 text-blue-700",
  "nut-free": "bg-purple-100 text-purple-700",
  keto: "bg-pink-100 text-pink-700",
  organic: "bg-emerald-100 text-emerald-700",
};
const DIETARY_DEFAULTS = "bg-amber-50 text-amber-700";

/* ── Helpers ───────────────────────────────────────────────── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRating(rating: number): string {
  return rating.toFixed(1);
}

function renderStars(rating: number): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}

function parseDietaryTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

function memberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/* ── Component ─────────────────────────────────────────────── */
export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "fresh" | string>("all");
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<number | null>(null);

  // Mini-map refs
  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<any>(null);
  const miniMapInitDone = useRef(false);

  /* ── Fetch data ──────────────────────────────────────────── */
  useEffect(() => {
    fetch(`/api/vendors?id=${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vendor) setVendor(data.vendor);
        setListings(data.listings || []);
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  /* ── Mini map ────────────────────────────────────────────── */
  useEffect(() => {
    if (!vendor || !miniMapRef.current || miniMapInitDone.current) return;
    miniMapInitDone.current = true;

    const initMiniMap = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(miniMapRef.current!, {
        center: [vendor.lat, vendor.lng],
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.marker([vendor.lat, vendor.lng]).addTo(map);
      miniMapInstance.current = map;
    };

    initMiniMap();
  }, [vendor]);

  /* ── Filtered listings ───────────────────────────────────── */
  const filteredListings = listings.filter((l) => {
    if (filterTab === "fresh") return l.isFresh;
    if (dietaryFilter) {
      const tags = parseDietaryTags(l.dietaryTags);
      if (!tags.includes(dietaryFilter)) return false;
    }
    return true;
  });

  const freshListings = listings.filter((l) => l.isFresh);

  const filteredReviews = reviewFilter
    ? reviews.filter((r) => r.rating === reviewFilter)
    : reviews;

  /* ── Star distribution ───────────────────────────────────── */
  const starDist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  const allDietaryTags = Array.from(
    new Set(listings.flatMap((l) => parseDietaryTags(l.dietaryTags)))
  ).sort();

  /* ── Loading skeleton ────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gray-50">
        <div className="animate-pulse">
          <div className="aspect-[3/2] bg-gray-200" />
          <div className="max-w-lg mx-auto w-full px-4 -mt-6 relative z-10">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ───────────────────────────────────────────── */
  if (!vendor) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-600 text-lg font-medium">Vendor not found</p>
            <p className="text-gray-400 text-sm mt-1">This vendor may have moved or no longer exists.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 bg-fresh-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-fresh-600 transition-colors"
            >
              ← Back to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full profile ────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* ─── Cover Photo ─────────────────────────────────────── */}
      <div className="relative">
        <div className="aspect-[3/2] bg-gray-200 overflow-hidden">
          <img
            src={vendor.photoUrl || FALLBACK_COVER}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-white transition-colors"
        >
          ←
        </Link>

        {/* Share button */}
        <button
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-white transition-colors"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: vendor.businessName, url: window.location.href });
            }
          }}
        >
          ↗
        </button>
      </div>

      {/* ─── Info card (overlaps cover) ──────────────────────── */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          {/* Business name + badge */}
          <div className="flex items-start gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 flex-1">
              {vendor.businessName}
            </h1>
            {vendor.verified && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 bg-fresh-50 text-fresh-700 text-xs font-semibold px-2 py-1 rounded-full border border-fresh-200">
                ✓ Verified Cottage Food
              </span>
            )}
          </div>

          {/* Category + Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
              {vendor.categoryIcon} {vendor.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">{renderStars(vendor.rating)}</span>
              <span className="text-sm font-semibold text-gray-800">{formatRating(vendor.rating)}</span>
              <span className="text-xs text-gray-400">({vendor.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Address + distance */}
          <p className="text-sm text-gray-500 mb-3">📍 {vendor.address}</p>

          {/* Bio */}
          {vendor.bio && (
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{vendor.bio}</p>
          )}

          {/* Quick stats */}
          <div className="flex gap-4 py-3 border-t border-gray-100">
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-gray-900">{vendor.listingCount}</p>
              <p className="text-xs text-gray-400">Active Listings</p>
            </div>
            <div className="text-center flex-1 border-x border-gray-100">
              <p className="text-lg font-bold text-gray-900">
                {vendor.hasFreshItems ? "🟢" : "—"}
              </p>
              <p className="text-xs text-gray-400">Fresh Now</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-gray-900">
                {memberSince(vendor.createdAt)}
              </p>
              <p className="text-xs text-gray-400">Member Since</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4">

        {/* ─── FRESH RIGHT NOW ──────────────────────────────────── */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fresh-500" />
              </span>
              Fresh Right Now
            </h2>
            {freshListings.length > 0 && (
              <span className="text-xs text-fresh-600 bg-fresh-50 px-2 py-0.5 rounded-full font-medium">
                {freshListings.length} available
              </span>
            )}
          </div>

          {freshListings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <span className="text-3xl">🥬</span>
              <p className="text-gray-500 mt-2 font-medium">Nothing fresh right now</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon — this vendor updates their availability daily!</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {freshListings.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 snap-start bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={item.photoUrl || FALLBACK_COVER}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.price !== null && (
                        <span className="text-fresh-700 font-bold text-sm whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        🕐 {item.createdAt ? timeAgo(item.createdAt) : "Recently"}
                      </span>
                      {item.quantity !== undefined && item.quantity !== null && (
                        <span className="text-xs text-gray-400">
                          • {item.quantity} left
                        </span>
                      )}
                    </div>
                    {/* Dietary tags */}
                    {item.dietaryTags && parseDietaryTags(item.dietaryTags).length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {parseDietaryTags(item.dietaryTags).slice(0, 2).map((tag) => (
                          <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-full ${DIETARY_COLORS[tag] || DIETARY_DEFAULTS}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── ALL LISTINGS ─────────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            📋 All Listings ({listings.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => { setFilterTab("all"); setDietaryFilter(null); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterTab === "all" && !dietaryFilter
                  ? "bg-fresh-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setFilterTab("fresh"); setDietaryFilter(null); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterTab === "fresh"
                  ? "bg-fresh-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Available Now
            </button>
            {allDietaryTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setDietaryFilter(dietaryFilter === tag ? null : tag);
                  setFilterTab("all");
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  dietaryFilter === tag
                    ? "bg-amber-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Listing cards */}
          <div className="space-y-3">
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <span className="text-2xl">📭</span>
                <p className="text-gray-500 mt-2 text-sm">No listings match this filter.</p>
              </div>
            ) : (
              filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="flex">
                    {item.photoUrl && (
                      <div className="w-28 h-28 flex-shrink-0 bg-gray-100">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-3 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                          {item.title}
                        </h3>
                        {item.price !== null && (
                          <span className="text-fresh-700 font-bold text-sm whitespace-nowrap">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Pickup window */}
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                        <span>📅</span>
                        <span>
                          {new Date(item.pickupWindowStart).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          {" • "}
                          {new Date(item.pickupWindowStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          {"–"}
                          {new Date(item.pickupWindowEnd).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Dietary tags */}
                      {item.dietaryTags && parseDietaryTags(item.dietaryTags).length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {parseDietaryTags(item.dietaryTags).map((tag) => (
                            <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-full ${DIETARY_COLORS[tag] || DIETARY_DEFAULTS}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Ingredients preview */}
                      {item.ingredients && (
                        <p className="mt-2 text-xs text-gray-400 truncate">
                          <span className="font-medium">Ingredients:</span> {item.ingredients}
                        </p>
                      )}

                      {/* Allergens */}
                      {item.allergenWarning && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                          ⚠️ {item.allergenWarning}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ─── REVIEWS ──────────────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            ⭐ Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <span className="text-3xl">💬</span>
              <p className="text-gray-500 mt-2 font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to review this vendor!</p>
            </div>
          ) : (
            <>
              {/* Rating summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold text-gray-900">{formatRating(vendor.rating)}</span>
                  <div>
                    <div className="text-yellow-500 text-sm">{renderStars(vendor.rating)}</div>
                    <p className="text-xs text-gray-400">{vendor.reviewCount} review{vendor.reviewCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                {/* Distribution bars */}
                <div className="space-y-1.5">
                  {starDist.map(({ star, count, pct }) => (
                    <button
                      key={star}
                      onClick={() => setReviewFilter(reviewFilter === star ? null : star)}
                      className={`w-full flex items-center gap-2 text-xs ${reviewFilter === star ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                    >
                      <span className="w-3 text-gray-500">{star}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-gray-400">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-3">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-fresh-100 text-fresh-600 flex items-center justify-center text-sm font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <span className="font-medium text-sm text-gray-900">{review.userName}</span>
                      </div>
                      <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                    </div>
                    <div className="text-yellow-500 text-xs mb-1">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ─── PICKUP INFO ──────────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            📍 Pickup Info
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mini map */}
            <div
              ref={miniMapRef}
              className="w-full h-40 bg-gray-100 cursor-pointer"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}`,
                  "_blank"
                );
              }}
            />

            <div className="p-4">
              <p className="text-sm font-medium text-gray-900">{vendor.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                Pickup hours: contact vendor for availability
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-fresh-600 hover:text-fresh-700 transition-colors"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─────────────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            💬 Contact
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
            <button
              className="w-full bg-fresh-500 text-white font-semibold py-3 rounded-xl hover:bg-fresh-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => alert("📬 Messaging coming soon! You'll be able to message vendors directly.")}
            >
              💬 Message Vendor
            </button>

            {vendor.phone && (
              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center gap-3 py-2 text-sm text-gray-700 hover:text-fresh-600 transition-colors"
              >
                <span className="text-lg">📞</span>
                <span>{vendor.phone}</span>
              </a>
            )}

            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2 text-sm text-gray-700 hover:text-fresh-600 transition-colors"
              >
                <span className="text-lg">🌐</span>
                <span className="truncate">{vendor.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}

            {vendor.socialLinks && (
              <div className="flex items-center gap-3 py-2 text-sm text-gray-700">
                <span className="text-lg">📱</span>
                <span className="truncate">{vendor.socialLinks}</span>
              </div>
            )}

            {!vendor.phone && !vendor.website && !vendor.socialLinks && (
              <p className="text-sm text-gray-400 text-center py-2">
                Contact info not provided — use the message button above!
              </p>
            )}
          </div>
        </section>

        {/* ─── Bottom safe area ────────────────────────────────── */}
        <div className="pb-24" />
      </div>
    </div>
  );
}
