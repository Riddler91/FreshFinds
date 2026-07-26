"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Star,
  Clock,
  MessageCircle,
  Phone,
  Globe,
  BadgeCheck,
  Leaf,
  ChefHat,
  Navigation,
} from "lucide-react";

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
  acceptsMessages: boolean;
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
const FALLBACK_COVER = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80";

const DIETARY_COLORS: Record<string, string> = {
  vegan: "bg-sage-50 text-sage-700 border-sage-200/40",
  vegetarian: "bg-sage-50 text-sage-700 border-sage-200/40",
  "gluten-free": "bg-honey-50 text-honey-700 border-honey-200/40",
  "dairy-free": "bg-cream-100 text-ink-light border-cream-300/40",
  "nut-free": "bg-terra-50 text-terra-600 border-terra-200/40",
  keto: "bg-sage-50 text-sage-700 border-sage-200/40",
  organic: "bg-sage-100 text-sage-700 border-sage-200/40",
};
const DIETARY_DEFAULTS = "bg-honey-50 text-honey-700 border-honey-200/40";

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

      // Use a custom divIcon for the mini map
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;border-radius:50%;background:#C2765C;border:3px solid #FFFBF5;box-shadow:0 3px 10px rgba(61,44,30,0.2);display:flex;align-items:center;justify-content:center;font-size:16px;">${vendor.categoryIcon}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([vendor.lat, vendor.lng], { icon }).addTo(map);
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
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="animate-pulse">
          <div className="aspect-[3/2] bg-cream-200" />
          <div className="max-w-lg mx-auto w-full px-4 -mt-6 relative z-10">
            <div className="bg-card rounded-3xl shadow-warm-lg p-5">
              <div className="skeleton-warm h-6 w-1/2 mb-2" />
              <div className="skeleton-warm h-4 w-3/4 mb-4" />
              <div className="skeleton-warm h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ───────────────────────────────────────────── */
  if (!vendor) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 max-w-sm">
            <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-cream-100 flex items-center justify-center shadow-warm">
              <Leaf className="w-12 h-12 text-sage-400" strokeWidth={1} />
            </div>
            <h1 className="text-ink text-2xl font-bold font-serif mb-3">Vendor Not Found</h1>
            <p className="text-ink-muted text-sm leading-relaxed mb-2">
              This vendor may not exist yet — or their page may have moved. FreshFinds is growing and new vendors join every day!
            </p>
            <p className="text-ink-muted text-xs mb-6">
              Are you a local food maker? This could be your spot. 🌱
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-terra-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Map
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-sage-100 text-sage-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-sage-200 transition-all border border-sage-200/40 active:scale-[0.98]"
              >
                🚀 Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full profile ────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* ─── Cover Photo ─────────────────────────────────────── */}
      <div className="relative">
        <div className="aspect-[3/2] bg-cream-200 overflow-hidden">
          <img
            src={vendor.photoUrl || FALLBACK_COVER}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Warm overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-50" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-card/90 backdrop-blur rounded-full flex items-center justify-center shadow-warm-lg text-ink hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Share button */}
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-card/90 backdrop-blur rounded-full flex items-center justify-center shadow-warm-lg text-ink hover:bg-card transition-colors"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: vendor.businessName, url: window.location.href });
            }
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* ─── Info card (overlaps cover) ──────────────────────── */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-10 relative z-10">
        <div className="bg-card rounded-3xl shadow-warm-lg p-5 animate-fade-in-up">
          {/* Business name + badge */}
          <div className="flex items-start gap-2 mb-1">
            <h1 className="text-2xl font-bold font-serif text-ink flex-1">
              {vendor.businessName}
            </h1>
            {vendor.verified && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 bg-sage-50 text-sage-700 text-xs font-bold px-2.5 py-1 rounded-full border border-sage-200">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>

          {/* Category + Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-cream-100 text-ink-light px-2.5 py-1 rounded-full font-semibold border border-cream-200/40">
              {vendor.categoryIcon} {vendor.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-honey-500 fill-honey-500" />
              <span className="text-sm font-bold text-ink">{formatRating(vendor.rating)}</span>
              <span className="text-xs text-ink-muted">({vendor.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Address */}
          <p className="text-sm text-ink-muted mb-3 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {vendor.address}
          </p>

          {/* Bio */}
          {vendor.bio && (
            <p className="text-sm text-ink-light leading-relaxed mb-4">{vendor.bio}</p>
          )}

          {/* Quick stats */}
          <div className="flex gap-4 py-3 border-t border-cream-200/60">
            <div className="text-center flex-1">
              <p className="text-xl font-bold font-serif text-ink">{vendor.listingCount}</p>
              <p className="text-xs text-ink-muted font-medium">Active Listings</p>
            </div>
            <div className="text-center flex-1 border-x border-cream-200/60">
              <p className="text-xl font-bold text-ink">
                {vendor.hasFreshItems ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-500" />
                    </span>
                    Yes
                  </span>
                ) : "—"}
              </p>
              <p className="text-xs text-ink-muted font-medium">Fresh Now</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold font-serif text-ink">
                {memberSince(vendor.createdAt)}
              </p>
              <p className="text-xs text-ink-muted font-medium">Member Since</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4">

        {/* ─── FRESH RIGHT NOW ──────────────────────────────────── */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-serif text-ink flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-500" />
              </span>
              Fresh Right Now
            </h2>
            {freshListings.length > 0 && (
              <span className="text-xs font-bold text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200/40">
                {freshListings.length} available
              </span>
            )}
          </div>

          {freshListings.length === 0 ? (
            <div className="bg-card rounded-3xl border border-cream-200/40 p-8 text-center shadow-warm">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cream-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-ink-muted" strokeWidth={1.5} />
              </div>
              <p className="text-ink-light font-bold font-serif mb-1">Nothing fresh right now</p>
              <p className="text-ink-muted text-sm">Check back soon — this vendor updates their availability daily!</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {freshListings.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 snap-start bg-card rounded-3xl shadow-warm border border-cream-200/40 overflow-hidden card-hover"
                >
                  <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
                    <img
                      src={item.photoUrl || FALLBACK_COVER}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-sage-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-warm">
                      Fresh
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-ink font-serif line-clamp-1">
                        {item.title}
                      </h3>
                      {item.price !== null && (
                        <span className="text-sage-600 font-bold text-sm whitespace-nowrap bg-sage-50 px-2 py-0.5 rounded-lg">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-ink-muted">
                        {item.createdAt ? timeAgo(item.createdAt) : "Recently"}
                      </span>
                      {item.quantity !== undefined && item.quantity !== null && (
                        <span className="text-xs text-ink-muted">
                          • {item.quantity} left
                        </span>
                      )}
                    </div>
                    {item.dietaryTags && parseDietaryTags(item.dietaryTags).length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {parseDietaryTags(item.dietaryTags).slice(0, 2).map((tag) => (
                          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${DIETARY_COLORS[tag] || DIETARY_DEFAULTS}`}>
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
          <h2 className="text-lg font-bold font-serif text-ink mb-3">
            All Listings ({listings.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => { setFilterTab("all"); setDietaryFilter(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                filterTab === "all" && !dietaryFilter
                  ? "bg-sage-500 text-white shadow-warm"
                  : "bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setFilterTab("fresh"); setDietaryFilter(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                filterTab === "fresh"
                  ? "bg-sage-500 text-white shadow-warm"
                  : "bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100"
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
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  dietaryFilter === tag
                    ? "bg-honey-500 text-white shadow-warm"
                    : "bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Listing cards */}
          <div className="space-y-3">
            {filteredListings.length === 0 ? (
              <div className="bg-card rounded-3xl border border-cream-200/40 p-8 text-center shadow-warm">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-cream-100 flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-ink-muted" strokeWidth={1.5} />
                </div>
                <p className="text-ink-light font-medium text-sm">No listings match this filter.</p>
              </div>
            ) : (
              filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-3xl shadow-warm border border-cream-200/40 overflow-hidden card-hover"
                >
                  <div className="flex">
                    <div className="w-28 h-28 flex-shrink-0 bg-cream-100">
                      <img
                        src={item.photoUrl || FALLBACK_COVER}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-ink font-serif line-clamp-1">
                          {item.title}
                        </h3>
                        {item.price !== null && (
                          <span className="text-sage-600 font-bold text-sm whitespace-nowrap bg-sage-50 px-2 py-0.5 rounded-lg">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(item.pickupWindowStart).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          {" • "}
                          {new Date(item.pickupWindowStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          {"–"}
                          {new Date(item.pickupWindowEnd).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>

                      {item.dietaryTags && parseDietaryTags(item.dietaryTags).length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {parseDietaryTags(item.dietaryTags).map((tag) => (
                            <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-full font-semibold border ${DIETARY_COLORS[tag] || DIETARY_DEFAULTS}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.ingredients && (
                        <p className="mt-2 text-xs text-ink-muted truncate">
                          <span className="font-semibold">Ingredients:</span> {item.ingredients}
                        </p>
                      )}

                      {item.allergenWarning && (
                        <p className="mt-1 text-xs text-terra-600 font-semibold">
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
          <h2 className="text-lg font-bold font-serif text-ink mb-3">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-card rounded-3xl border border-cream-200/40 p-8 text-center shadow-warm">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-cream-100 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-ink-muted" strokeWidth={1.5} />
              </div>
              <p className="text-ink-light font-bold font-serif mb-1">No reviews yet</p>
              <p className="text-ink-muted text-sm">Be the first to review this vendor!</p>
            </div>
          ) : (
            <>
              {/* Rating summary */}
              <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-5 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-bold font-serif text-ink">{formatRating(vendor.rating)}</span>
                  <div>
                    <div className="flex items-center gap-0.5 text-honey-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(vendor.rating) ? "fill-honey-500" : ""}`} />
                      ))}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">{vendor.reviewCount} review{vendor.reviewCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {starDist.map(({ star, count, pct }) => (
                    <button
                      key={star}
                      onClick={() => setReviewFilter(reviewFilter === star ? null : star)}
                      className={`w-full flex items-center gap-2 text-xs ${reviewFilter === star ? "opacity-100" : "opacity-70 hover:opacity-100"} transition-opacity`}
                    >
                      <span className="w-3 text-ink-muted font-semibold">{star}</span>
                      <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-honey-400 rounded-full transition-all"
                          style={{ width: `${Math.max(pct, 3)}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-ink-muted font-medium">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-3">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-4 card-hover">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-sm font-bold font-serif border border-sage-200/40">
                          {review.userName.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-ink">{review.userName}</span>
                      </div>
                      <span className="text-xs text-ink-muted">{timeAgo(review.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-honey-500 fill-honey-500" : "text-cream-300"}`} />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-ink-light leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ─── PICKUP INFO ──────────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold font-serif text-ink mb-3">
            Pickup Info
          </h2>

          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 overflow-hidden">
            <div
              ref={miniMapRef}
              className="w-full h-40 bg-cream-100 cursor-pointer relative group"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}`,
                  "_blank"
                );
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 group-hover:bg-ink/5 transition-colors z-10">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur rounded-full px-4 py-2 text-sm font-bold text-ink shadow-warm">
                  Open in Maps →
                </span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm font-bold text-ink flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-terra-500" /> {vendor.address}
              </p>
              <p className="text-xs text-ink-muted mt-1">
                Pickup hours: contact vendor for availability
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-terra-500 hover:text-terra-400 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─────────────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold font-serif text-ink mb-3">
            Contact
          </h2>

          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-5 space-y-3">
            {vendor.acceptsMessages ? (
              <Link
                href={`/messages/${vendor.id}`}
                className="w-full bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" /> Message Vendor
              </Link>
            ) : (
              <div className="w-full bg-cream-100 text-ink-muted font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" /> This vendor hasn&apos;t enabled messaging yet
              </div>
            )}

            {vendor.phone && (
              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center gap-3 py-2.5 px-3 text-sm text-ink-light hover:text-terra-500 transition-colors rounded-2xl hover:bg-cream-50"
              >
                <Phone className="w-4 h-4 text-sage-500" />
                <span className="font-medium">{vendor.phone}</span>
              </a>
            )}

            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2.5 px-3 text-sm text-ink-light hover:text-terra-500 transition-colors rounded-2xl hover:bg-cream-50"
              >
                <Globe className="w-4 h-4 text-sage-500" />
                <span className="font-medium truncate">{vendor.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}

            {vendor.socialLinks && (
              <div className="flex items-center gap-3 py-2.5 px-3 text-sm text-ink-light">
                <Share2 className="w-4 h-4 text-sage-500" />
                <span className="font-medium truncate">{vendor.socialLinks}</span>
              </div>
            )}

            {!vendor.phone && !vendor.website && !vendor.socialLinks && (
              <p className="text-sm text-ink-muted text-center py-2">
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
