"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

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
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🕐 Fresh Right Now
          </h1>
          <span className="text-sm text-fresh-600 bg-fresh-50 px-3 py-1 rounded-full font-medium">
            {listings.length} available
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 animate-pulse shadow-sm"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🥬</span>
            <p className="text-gray-500 mt-3 text-lg">
              No fresh listings right now.
            </p>
            <p className="text-gray-400 mt-1 text-sm">
              Check back soon — vendors update their availability daily!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/vendor/${listing.vendorId}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {listing.photoUrl && (
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    <img
                      src={listing.photoUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {listing.description}
                      </p>
                    </div>
                    {listing.price && (
                      <span className="text-fresh-700 font-bold text-lg whitespace-nowrap">
                        ${listing.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {listing.vendorName}
                    </span>
                    {listing.categoryIcon && (
                      <span className="text-xs bg-fresh-50 text-fresh-700 px-2 py-1 rounded-full">
                        {listing.categoryIcon}
                      </span>
                    )}
                    {listing.dietaryTags && (() => {
                      try {
                        const tags = JSON.parse(listing.dietaryTags);
                        return tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
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

        <div className="h-8" />
      </div>
    </div>
  );
}
