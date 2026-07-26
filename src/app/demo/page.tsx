"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Star,
  Clock,
  MessageCircle,
  BadgeCheck,
  Leaf,
  ChefHat,
} from "lucide-react";

/* ── Static Demo Data ─────────────────────────────────────── */

const DEMO_VENDOR = {
  name: "Sunrise Bakery & Co.",
  businessName: "Sunrise Bakery & Co.",
  address: "1234 Neighborhood Lane, Austin, TX 78704",
  lat: 30.25,
  lng: -97.75,
  bio: "Small-batch artisan sourdough and pastries, baked fresh daily in my home kitchen. Every loaf is naturally leavened and hand-shaped with love. Located in the heart of our community.",
  photoUrl:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  verified: true,
  categoryIcon: "🥖",
  categoryName: "Bread & Pastries",
  rating: 4.9,
  reviewCount: 24,
  listingCount: 7,
  hasFreshItems: true,
  memberSince: "March 2025",
};

const DEMO_FRESH_ITEMS = [
  {
    id: 1,
    title: "Country Sourdough Loaf",
    price: 8.0,
    photoUrl:
      "https://images.unsplash.com/photo-1549931319-c545519f3f10?w=400&q=80",
    timeLabel: "Baked today at 7:00 AM",
    quantity: 4,
    dietaryTags: ["organic"],
  },
  {
    id: 2,
    title: "Cinnamon Rolls (6-pack)",
    price: 15.0,
    photoUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    timeLabel: "Just finished cooling",
    quantity: null,
    dietaryTags: ["vegetarian"],
  },
  {
    id: 3,
    title: "Everything Bagels",
    price: 10.0,
    photoUrl:
      "https://images.unsplash.com/photo-1611604548018-d56b4b53f958?w=400&q=80",
    timeLabel: "Available now",
    quantity: null,
    dietaryTags: ["vegan"],
  },
  {
    id: 4,
    title: "Seasonal Berry Galette",
    price: 18.0,
    photoUrl:
      "https://images.unsplash.com/photo-1464093515883-ec948246accf?w=400&q=80",
    timeLabel: "Made this morning",
    quantity: null,
    dietaryTags: ["organic", "vegetarian"],
  },
];

const DEMO_ALL_LISTINGS = [
  {
    id: 101,
    title: "Country Sourdough Loaf",
    description:
      "Our signature naturally leavened sourdough with a crackling crust and open crumb. Made with organic bread flour.",
    price: 8.0,
    photoUrl:
      "https://images.unsplash.com/photo-1549931319-c545519f3f10?w=400&q=80",
    dietaryTags: ["organic", "vegan"],
    pickupWindow: "Mon–Sat, 8AM–6PM",
    ingredients: "Organic bread flour, water, sea salt, sourdough starter",
    allergenWarning: "Contains gluten",
  },
  {
    id: 102,
    title: "Cinnamon Rolls (6-pack)",
    description:
      "Soft, gooey cinnamon rolls with cream cheese frosting. Perfect for weekend mornings.",
    price: 15.0,
    photoUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    dietaryTags: ["vegetarian"],
    pickupWindow: "Sat–Sun, 9AM–2PM",
    ingredients:
      "Flour, butter, brown sugar, cinnamon, cream cheese, powdered sugar",
    allergenWarning: "Contains gluten, dairy, eggs",
  },
  {
    id: 103,
    title: "Everything Bagels",
    description:
      "Chewy, New York–style bagels topped with our house everything seasoning blend. Sold by the dozen.",
    price: 10.0,
    photoUrl:
      "https://images.unsplash.com/photo-1611604548018-d56b4b53f958?w=400&q=80",
    dietaryTags: ["vegan"],
    pickupWindow: "Mon–Fri, 7AM–12PM",
    ingredients:
      "Bread flour, water, barley malt, yeast, salt, sesame seeds, poppy seeds, garlic, onion",
    allergenWarning: "Contains gluten, sesame",
  },
  {
    id: 104,
    title: "Seasonal Berry Galette",
    description:
      "Rustic free-form tart filled with whatever berries are at peak season. Buttery, flaky crust.",
    price: 18.0,
    photoUrl:
      "https://images.unsplash.com/photo-1464093515883-ec948246accf?w=400&q=80",
    dietaryTags: ["organic", "vegetarian"],
    pickupWindow: "Wed–Sat, 10AM–4PM",
    ingredients:
      "Flour, butter, seasonal berries, sugar, lemon zest, cornstarch",
    allergenWarning: "Contains gluten, dairy",
  },
];

const DEMO_REVIEWS = [
  {
    id: 201,
    userName: "Maria G.",
    rating: 5,
    comment:
      "The sourdough is incredible — best I've had outside of San Francisco. You can really taste the love and craftsmanship in every loaf.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 202,
    userName: "James K.",
    rating: 5,
    comment:
      "Those cinnamon rolls are dangerous! Picked up a 6-pack for Sunday brunch and they disappeared in minutes. Ordering again this weekend.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 203,
    userName: "Sarah L.",
    rating: 5,
    comment:
      "I love that everything is made fresh that morning. The everything bagels have the perfect chew and the seasoning is spot on. A neighborhood gem!",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 204,
    userName: "David R.",
    rating: 4,
    comment:
      "Great quality and super convenient pickup. The berry galette was fantastic — only wish it was available every day instead of just Wed–Sat!",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

/* ── Diet tag color map ───────────────────────────────────── */

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

/* ── Helpers ──────────────────────────────────────────────── */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function parseDietaryTags(tags: string[]): string[] {
  return tags;
}

/* ── Star distribution for demo ──────────────────────────── */
const STAR_DIST = [
  { star: 5, count: 21, pct: 87.5 },
  { star: 4, count: 3, pct: 12.5 },
  { star: 3, count: 0, pct: 0 },
  { star: 2, count: 0, pct: 0 },
  { star: 1, count: 0, pct: 0 },
];

/* ── Component ────────────────────────────────────────────── */

export default function DemoPage() {
  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInitDone = useRef(false);

  const { lat, lng } = DEMO_VENDOR;

  /* ── Leaflet mini map ──────────────────────────────────── */
  useEffect(() => {
    if (!miniMapRef.current || miniMapInitDone.current) return;
    miniMapInitDone.current = true;

    const initMiniMap = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(miniMapRef.current!, {
        center: [lat, lng],
        zoom: 14,
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

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;border-radius:50%;background:#C2765C;border:3px solid #FFFBF5;box-shadow:0 3px 10px rgba(61,44,30,0.2);display:flex;align-items:center;justify-content:center;font-size:16px;">🥖</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([lat, lng], { icon }).addTo(map);
    };

    initMiniMap();
  }, [lat, lng]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* ─── DEMO BANNER ─────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-sage-500 shadow-warm-md">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-center gap-2">
          <span className="text-white font-bold text-sm flex items-center gap-1.5">
            👀 DEMO — See what your vendor profile could look like
          </span>
        </div>
      </div>

      {/* ─── Cover Photo ─────────────────────────────────── */}
      <div className="relative">
        <div className="aspect-[3/2] bg-cream-200 overflow-hidden">
          <img
            src={DEMO_VENDOR.photoUrl}
            alt={DEMO_VENDOR.businessName}
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
              navigator.share({
                title: DEMO_VENDOR.businessName,
                url: window.location.href,
              });
            }
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* ─── Info Card (overlaps cover) ──────────────────── */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-10 relative z-10">
        <div className="bg-card rounded-3xl shadow-warm-lg p-5 animate-fade-in-up">
          {/* Business name + Verified badge */}
          <div className="flex items-start gap-2 mb-1">
            <h1 className="text-2xl font-bold font-serif text-ink flex-1">
              {DEMO_VENDOR.businessName}
            </h1>
            {DEMO_VENDOR.verified && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 bg-sage-50 text-sage-700 text-xs font-bold px-2.5 py-1 rounded-full border border-sage-200">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>

          {/* Category + Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-cream-100 text-ink-light px-2.5 py-1 rounded-full font-semibold border border-cream-200/40">
              {DEMO_VENDOR.categoryIcon} {DEMO_VENDOR.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-honey-500 fill-honey-500" />
              <span className="text-sm font-bold text-ink">
                {DEMO_VENDOR.rating}
              </span>
              <span className="text-xs text-ink-muted">
                ({DEMO_VENDOR.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Address */}
          <p className="text-sm text-ink-muted mb-3 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {DEMO_VENDOR.address}
          </p>

          {/* Bio */}
          <p className="text-sm text-ink-light leading-relaxed mb-4">
            {DEMO_VENDOR.bio}
          </p>

          {/* Quick stats */}
          <div className="flex gap-4 py-3 border-t border-cream-200/60">
            <div className="text-center flex-1">
              <p className="text-xl font-bold font-serif text-ink">
                {DEMO_VENDOR.listingCount}
              </p>
              <p className="text-xs text-ink-muted font-medium">
                Active Listings
              </p>
            </div>
            <div className="text-center flex-1 border-x border-cream-200/60">
              <p className="text-xl font-bold text-ink">
                <span className="inline-flex items-center gap-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-500" />
                  </span>
                  Yes
                </span>
              </p>
              <p className="text-xs text-ink-muted font-medium">Fresh Now</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold font-serif text-ink">
                {DEMO_VENDOR.memberSince}
              </p>
              <p className="text-xs text-ink-muted font-medium">Member Since</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4">
        {/* ─── FRESH RIGHT NOW ───────────────────────────── */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-serif text-ink flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-500" />
              </span>
              Fresh Right Now
            </h2>
            <span className="text-xs font-bold text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200/40">
              {DEMO_FRESH_ITEMS.length} available
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {DEMO_FRESH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-64 snap-start bg-card rounded-3xl shadow-warm border border-cream-200/40 overflow-hidden card-hover"
              >
                <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
                  <img
                    src={item.photoUrl}
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
                    <span className="text-sage-600 font-bold text-sm whitespace-nowrap bg-sage-50 px-2 py-0.5 rounded-lg">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-ink-muted">
                      {item.timeLabel}
                    </span>
                    {item.quantity !== null && (
                      <span className="text-xs font-semibold text-terra-600">
                        • Only {item.quantity} left!
                      </span>
                    )}
                  </div>
                  {item.dietaryTags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {item.dietaryTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                            DIETARY_COLORS[tag] || DIETARY_DEFAULTS
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ALL LISTINGS ──────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold font-serif text-ink mb-3">
            All Listings ({DEMO_ALL_LISTINGS.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            <button className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-sage-500 text-white shadow-warm">
              All
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100 transition-colors">
              Available Now
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100 transition-colors">
              organic
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100 transition-colors">
              vegan
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-card text-ink-light border border-cream-200/60 hover:bg-cream-100 transition-colors">
              vegetarian
            </button>
          </div>

          {/* Listing cards */}
          <div className="space-y-3">
            {DEMO_ALL_LISTINGS.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-3xl shadow-warm border border-cream-200/40 overflow-hidden card-hover"
              >
                <div className="flex">
                  <div className="w-28 h-28 flex-shrink-0 bg-cream-100">
                    <img
                      src={item.photoUrl}
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
                      <span className="text-sage-600 font-bold text-sm whitespace-nowrap bg-sage-50 px-2 py-0.5 rounded-lg">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
                      <Clock className="w-3 h-3" />
                      <span>{item.pickupWindow}</span>
                    </div>

                    {item.dietaryTags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {item.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-1.5 py-0.5 rounded-full font-semibold border ${
                              DIETARY_COLORS[tag] || DIETARY_DEFAULTS
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.ingredients && (
                      <p className="mt-2 text-xs text-ink-muted truncate">
                        <span className="font-semibold">Ingredients:</span>{" "}
                        {item.ingredients}
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
            ))}
          </div>
        </section>

        {/* ─── REVIEWS ───────────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-lg font-bold font-serif text-ink mb-3">
            Reviews ({DEMO_REVIEWS.length})
          </h2>

          {/* Rating summary */}
          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-5 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl font-bold font-serif text-ink">
                {DEMO_VENDOR.rating}
              </span>
              <div>
                <div className="flex items-center gap-0.5 text-honey-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(DEMO_VENDOR.rating)
                          ? "fill-honey-500"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  {DEMO_VENDOR.reviewCount} reviews
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              {STAR_DIST.map(({ star, count, pct }) => (
                <div
                  key={star}
                  className="w-full flex items-center gap-2 text-xs opacity-70"
                >
                  <span className="w-3 text-ink-muted font-semibold">
                    {star}
                  </span>
                  <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-honey-400 rounded-full"
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-ink-muted font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-3">
            {DEMO_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-4 card-hover"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-sm font-bold font-serif border border-sage-200/40">
                      {review.userName.charAt(0)}
                    </div>
                    <span className="font-bold text-sm text-ink">
                      {review.userName}
                    </span>
                  </div>
                  <span className="text-xs text-ink-muted">
                    {timeAgo(review.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= review.rating
                          ? "text-honey-500 fill-honey-500"
                          : "text-cream-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-ink-light leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PICKUP INFO ────────────────────────────────── */}
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
                  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
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
                <MapPin className="w-4 h-4 text-terra-500" />{" "}
                {DEMO_VENDOR.address}
              </p>
              <p className="text-xs text-ink-muted mt-1">
                <span className="font-semibold">Pickup hours:</span> Mon–Sat,
                8AM–6PM
              </p>
              <p className="text-xs text-ink-muted mt-0.5 italic">
                Your real address and hours would appear here
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-terra-500 hover:text-terra-400 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* ─── CTA SECTION ────────────────────────────────── */}
        <section className="mt-8 mb-6">
          <div className="bg-card rounded-3xl shadow-warm-lg border border-cream-200/40 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-50 flex items-center justify-center border border-sage-200/40">
              <Leaf className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold font-serif text-ink mb-2">
              ✨ Ready to build your own storefront?
            </h2>
            <p className="text-sm text-ink-light mb-5">
              It&apos;s free to list your cottage food business on FreshFinds.
              Share what you&apos;re making today and connect with customers in
              your neighborhood.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-terra-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-terra-400 transition-all shadow-warm-md active:scale-[0.98] text-base w-full sm:w-auto"
            >
              Start Selling — It&apos;s Free →
            </Link>
            <div className="mt-4">
              <Link
                href="/"
                className="text-sm text-sage-600 hover:text-sage-500 font-semibold transition-colors"
              >
                ← Back to Map
              </Link>
            </div>
          </div>
        </section>

        {/* Spacer for bottom nav */}
        <div className="h-20" />
      </div>
    </div>
  );
}
