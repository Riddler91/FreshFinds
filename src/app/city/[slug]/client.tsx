"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Clock, Leaf, Package, Store } from "lucide-react";
import { type CityDef, CITIES } from "@/lib/data";

interface Vendor {
  id: number;
  businessName: string;
  lat: number;
  lng: number;
  address: string;
  photoUrl: string | null;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  rating: number;
  reviewCount: number;
  listingCount: number;
  hasFreshItems: boolean;
  bio?: string;
  state?: string;
  city?: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  photoUrl: string;
  dietaryTags: string;
  vendorName: string;
  vendorId: number;
  categoryIcon: string;
  categorySlug: string;
  postType: string;
  postedAt: string;
  expiresAt: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  city?: string;
}

interface Props {
  city: CityDef;
  vendorCount: number;
  freshCount: number;
  categories: string[];
  initialVendors: any[];
  initialListings: any[];
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const POST_TYPE_LABELS: Record<string, string> = {
  baked_today: "🥖 Baked today",
  harvested_today: "🌽 Harvested today",
  just_made: "🍪 Just made",
  limited_batch: "✨ Limited batch",
  available_now: "🛒 Available now",
};

export default function CityPageClient({ city, vendorCount, freshCount, categories, initialVendors, initialListings }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors as Vendor[]);
  const [listings, setListings] = useState<Listing[]>(initialListings as Listing[]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [city.lat, city.lng],
        zoom: city.defaultZoom,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstance.current = map;
      setMapReady(true);
    };

    initMap();
  }, [city]);

  // Place markers
  useEffect(() => {
    if (!mapReady) return;

    const initMarkers = async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstance.current;
      if (!map) return;

      vendors.forEach((vendor) => {
        const markerColor = vendor.hasFreshItems ? "fresh" : "stale";
        const icon = L.divIcon({
          className: `vendor-marker ${markerColor}`,
          html: `<span>${vendor.categoryIcon}</span>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const marker = L.marker([vendor.lat, vendor.lng], { icon });
        marker.bindPopup(`
          <div style="font-family:system-ui;padding:4px 0;">
            <strong>${vendor.businessName}</strong><br/>
            <span style="font-size:12px;color:#666;">${vendor.categoryName} • ⭐${vendor.rating}</span><br/>
            <a href="/vendor/${vendor.id}" style="color:#7C9082;font-weight:600;font-size:12px;">View vendor →</a>
          </div>
        `);
        marker.addTo(map);
      });
    };

    initMarkers();
  }, [mapReady, vendors]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-sage-100/60 to-cream-50">
        <div className="max-w-lg mx-auto px-4 pt-14 pb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all cities
          </Link>
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">
            {city.name}, {city.state}
          </h1>
          <p className="text-lg text-ink-muted mb-4 font-medium">
            Discover fresh, local food in {city.name}
          </p>
          <p className="text-sm text-ink-light italic max-w-md">
            {city.tagline}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-warm text-sm font-semibold text-ink">
              <Store className="w-4 h-4 text-sage-500" />
              {vendorCount} vendors
            </div>
            <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-warm text-sm font-semibold text-ink">
              <Package className="w-4 h-4 text-terra-500" />
              {freshCount} fresh items
            </div>
            <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-warm text-sm font-semibold text-ink">
              <Leaf className="w-4 h-4 text-honey-500" />
              {categories.length} categories
            </div>
          </div>

          {/* Compliance badge */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted bg-cream-100/80 rounded-full px-3 py-1.5 max-w-fit">
            <span>🛡️</span> {city.complianceNote}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-2 mb-6">
        <div className="rounded-3xl overflow-hidden shadow-warm border border-cream-200/40 h-64 bg-cream-100">
          <div ref={mapRef} className="w-full h-full" />
        </div>
        <p className="text-xs text-ink-muted mt-2 text-center font-medium">
          📍 {vendorCount} cottage food vendors across {city.name}
        </p>
      </div>

      {/* Fresh Right Now Feed */}
      <div className="max-w-lg mx-auto w-full px-4 mb-8">
        <h2 className="text-xl font-bold font-serif text-ink mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-500" />
          </span>
          Fresh Right Now in {city.name}
        </h2>

        {listings.length === 0 ? (
          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-8 text-center">
            <p className="text-ink-muted font-medium">No fresh items right now — check back soon!</p>
            <Link href="/" className="text-sage-600 font-bold text-sm mt-2 inline-block hover:underline">
              Browse all cities →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/vendor/${listing.vendorId}`}
                className="bg-card rounded-2xl shadow-warm border border-cream-200/40 p-4 flex gap-3 hover:shadow-warm-lg transition-shadow active:scale-[0.98]"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100">
                  <img
                    src={listing.photoUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-ink leading-tight line-clamp-1">
                      {listing.title}
                    </h3>
                    <span className="text-sm font-bold text-terra-500 flex-shrink-0">
                      ${listing.price}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-ink-light font-medium">
                      {listing.categoryIcon} {listing.vendorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-sage-600 bg-sage-50 px-1.5 py-0.5 rounded-full font-bold">
                      {POST_TYPE_LABELS[listing.postType] || "🛒 Available now"}
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {timeAgo(listing.postedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View all vendors */}
        <div className="mt-6">
          <Link
            href={`/?city=${city.slug}`}
            className="block w-full text-center bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98]"
          >
            View All Vendors on Map →
          </Link>
        </div>
      </div>

      {/* Vendor List */}
      <div className="max-w-lg mx-auto w-full px-4 mb-8">
        <h2 className="text-xl font-bold font-serif text-ink mb-4">
          Vendors in {city.name}
        </h2>
        <div className="grid gap-3">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendor/${vendor.id}`}
              className="bg-card rounded-2xl shadow-warm border border-cream-200/40 p-4 flex items-center gap-3 hover:shadow-warm-lg transition-shadow active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100">
                {vendor.photoUrl ? (
                  <img src={vendor.photoUrl} alt={vendor.businessName} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{vendor.categoryIcon}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-ink">{vendor.businessName}</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  {vendor.categoryIcon} {vendor.categoryName}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-3 h-3 text-honey-500 fill-honey-500" />
                  <span className="text-xs font-semibold text-ink">{vendor.rating}</span>
                  <span className="text-[10px] text-ink-muted">({vendor.reviewCount})</span>
                  {vendor.hasFreshItems && (
                    <span className="text-[10px] bg-sage-50 text-sage-600 px-1.5 py-0.5 rounded-full font-bold ml-1">
                      Fresh Now
                    </span>
                  )}
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-ink-muted rotate-180" />
            </Link>
          ))}
        </div>
      </div>

      {/* Other cities */}
      <div className="max-w-lg mx-auto w-full px-4 mb-12">
        <h2 className="text-lg font-bold font-serif text-ink mb-3">More Cities</h2>
        <div className="flex flex-wrap gap-2">
          {CITIES.filter(
            (c: CityDef) => c.slug !== city.slug
          ).slice(0, 13).map((c: CityDef) => (
            <Link
              key={c.slug}
              href={`/city/${c.slug}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-card border border-cream-200/60 text-ink-light hover:bg-sage-50 hover:border-sage-200 transition-colors shadow-warm"
            >
              📍 {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="safe-bottom" />
    </div>
  );
}
