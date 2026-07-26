"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

interface Vendor {
  id: number;
  name: string;
  businessName: string;
  bio: string | null;
  address: string;
  photoUrl: string | null;
  verified: boolean;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | null;
  photoUrl: string | null;
  dietaryTags: string | null;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  ingredients: string | null;
  allergenWarning: string | null;
}

export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = params.id;
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/vendors?id=${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vendor) setVendor(data.vendor);
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl">🔍</span>
            <p className="text-gray-500 mt-3">Vendor not found</p>
            <Link href="/" className="text-fresh-600 mt-2 inline-block">
              ← Back to map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {/* Vendor hero */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {vendor.photoUrl && (
            <div className="aspect-[2/1] bg-gray-100 overflow-hidden">
              <img
                src={vendor.photoUrl}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">
                {vendor.businessName}
              </h1>
              {vendor.verified && (
                <span className="text-fresh-600 text-sm" title="Verified vendor">
                  ✓
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{vendor.address}</p>
            {vendor.bio && (
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                {vendor.bio}
              </p>
            )}
          </div>
        </div>

        {/* Listings */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          🕐 Available Now ({listings.length})
        </h2>
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.description}
                    </p>
                  </div>
                  {listing.price && (
                    <span className="text-fresh-700 font-bold text-lg whitespace-nowrap">
                      ${listing.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Pickup window */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <span>📅</span>
                  <span>
                    Pickup: {new Date(listing.pickupWindowStart).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {" • "}
                    {new Date(listing.pickupWindowStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {" – "}
                    {new Date(listing.pickupWindowEnd).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>

                {/* Ingredients */}
                {listing.ingredients && (
                  <p className="mt-2 text-xs text-gray-400">
                    <span className="font-medium">Ingredients:</span>{" "}
                    {listing.ingredients}
                  </p>
                )}

                {/* Allergens */}
                {listing.allergenWarning && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    ⚠️ {listing.allergenWarning}
                  </p>
                )}

                {/* Dietary tags */}
                {listing.dietaryTags && (() => {
                  try {
                    const tags = JSON.parse(listing.dietaryTags);
                    return (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">📭</span>
            <p className="text-gray-500 mt-3">
              No listings available right now. Check back soon!
            </p>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
