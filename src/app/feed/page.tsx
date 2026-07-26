"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { Clock, Sparkles, ChefHat, Leaf } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | null;
  photoUrl: string | null;
  dietaryTags: string | null;
  vendorName: string;
  vendorId: number;
  categoryIcon: string | null;
}

const FALLBACK_FOOD_IMG = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80";

export default function FeedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      <Header />
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        {/* Hero header */}
        <div className="mb-6 golden-glow rounded-3xl p-5 border border-honey-100/50 bg-card">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold font-serif text-ink">
              Fresh Right Now
            </h1>
            <div className="flex items-center gap-1.5 bg-sage-50 text-sage-600 px-3 py-1.5 rounded-full border border-sage-200/50">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="text-sm font-bold">{listings.length} available</span>
            </div>
          </div>
          <p className="text-sm text-ink-muted">
            What&apos;s fresh and available from local makers right now — baked this morning, picked today, crafted with care.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-warm animate-fade-in-up">
                <div className="skeleton-warm h-48 mb-3" />
                <div className="skeleton-warm h-5 w-3/4 mb-2" />
                <div className="skeleton-warm h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center">
              <Leaf className="w-10 h-10 text-sage-400" strokeWidth={1.5} />
            </div>
            <p className="text-ink-light text-lg font-bold font-serif mb-2">
              Nothing fresh just yet
            </p>
            <p className="text-ink-muted text-sm max-w-xs mx-auto leading-relaxed">
              Vendors update their listings throughout the day. Check back soon — something delicious is always baking!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing, idx) => (
              <Link
                key={listing.id}
                href={`/vendor/${listing.vendorId}`}
                className={`block bg-card rounded-2xl shadow-warm border border-cream-200/40 overflow-hidden card-hover animate-fade-in-up ${
                  idx > 0 ? `animate-fade-in-up-delay-${Math.min(idx, 2)}` : ""
                }`}
              >
                <div className="aspect-[16/9] bg-cream-100 overflow-hidden relative">
                  <img
                    src={listing.photoUrl || FALLBACK_FOOD_IMG}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Fresh badge overlay */}
                  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-bold text-sage-600 border border-sage-200/50 shadow-warm flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500" />
                    </span>
                    Fresh
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-ink font-serif truncate text-lg">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-ink-muted mt-0.5 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>
                    {listing.price && (
                      <span className="text-sage-600 font-bold text-lg whitespace-nowrap bg-sage-50 px-2.5 py-1 rounded-xl">
                        ${listing.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-xs font-semibold text-ink-muted bg-cream-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ChefHat className="w-3 h-3" /> {listing.vendorName}
                    </span>
                    {listing.categoryIcon && (
                      <span className="text-xs font-semibold bg-sage-50 text-sage-600 px-2.5 py-1 rounded-full border border-sage-200/40">
                        {listing.categoryIcon}
                      </span>
                    )}
                    {listing.dietaryTags && (() => {
                      try {
                        const tags = JSON.parse(listing.dietaryTags);
                        return tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-xs font-semibold bg-honey-50 text-honey-700 px-2.5 py-1 rounded-full border border-honey-200/40">
                            {tag}
                          </span>
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="h-24" />
      </div>
    </div>
  );
}
