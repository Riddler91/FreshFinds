"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ── Types ────────────────────────────────────────────────────── */
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
  distance?: number;
}

/* ── Filter categories ────────────────────────────────────────── */
const CATEGORIES = [
  { slug: "all",             icon: "🌟", label: "All" },
  { slug: "bread-pastries",  icon: "🥖", label: "Bread" },
  { slug: "eggs-dairy",      icon: "🥚", label: "Eggs" },
  { slug: "honey-preserves", icon: "🍯", label: "Honey" },
  { slug: "desserts",        icon: "🥧", label: "Desserts" },
  { slug: "produce",         icon: "🌽", label: "Produce" },
  { slug: "meals",           icon: "🍽️", label: "Meals" },
  { slug: "flowers",         icon: "🌼", label: "Flowers" },
  { slug: "food-truck",      icon: "🚚", label: "Trucks" },
];

/* ── Helpers ──────────────────────────────────────────────────── */
function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/* ── Component ────────────────────────────────────────────────── */
export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstance = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markerGroup = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const initDone = useRef(false);

  /* ── Fetch vendors ──────────────────────────────────────────── */
  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        const v: Vendor[] = data.vendors || [];
        setVendors(v);
        setFilteredVendors(v);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  /* ── Apply filters ──────────────────────────────────────────── */
  useEffect(() => {
    let result = [...vendors];
    if (activeCategory !== "all") {
      result = result.filter((v) => v.categorySlug === activeCategory);
    }
    if (availableOnly) {
      result = result.filter((v) => v.hasFreshItems);
    }
    setFilteredVendors(result);
  }, [vendors, activeCategory, availableOnly]);

  /* ── Init map (once) ────────────────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current || initDone.current) return;
    initDone.current = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");

      // Store L for use in other effects
      leafletRef.current = L;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [30.2672, -97.7431],
        zoom: 12,
        zoomControl: false, // we'll add our own positioning
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control in top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstance.current = map;
      (window as any).__leafletMap = map;
      setMapReady(true);
    };

    initMap();
  }, []);

  /* ── Update markers when filtered vendors change ────────────── */
  useEffect(() => {
    if (!mapReady) return;

    const L = leafletRef.current;
    if (!L) return;
    const map = mapInstance.current;
    if (!map) return;

    // Clear old markers
    if (markerGroup.current) {
      map.removeLayer(markerGroup.current);
    }

    // Create fresh cluster group
    const mcg = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    markerGroup.current = mcg;

    filteredVendors.forEach((vendor) => {
      const markerColor = vendor.hasFreshItems ? "fresh" : "stale";

      const icon = L.divIcon({
        className: `vendor-marker ${markerColor}`,
        html: `<span>${vendor.categoryIcon}</span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([vendor.lat, vendor.lng], { icon });

      // Tap/click handler → show bottom sheet
      marker.on("click", () => {
        if (userLoc) {
          const dist = haversineKm(userLoc, [vendor.lat, vendor.lng]);
          setSelectedVendor({ ...vendor, distance: dist });
        } else {
          setSelectedVendor({ ...vendor, distance: undefined });
        }
      });

      mcg.addLayer(marker);
    });

    map.addLayer(mcg);
  }, [filteredVendors, mapReady, userLoc]);

  /* ── Geolocation ────────────────────────────────────────────── */
  const handleFindMe = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLoc(loc);

        // Remove old user marker
        if (userMarker.current) {
          mapInstance.current?.removeLayer(userMarker.current);
        }

        const L = leafletRef.current;
        if (mapInstance.current && L) {
          const circleIcon = L.divIcon({
            className: "",
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.4);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          userMarker.current = L.marker(loc, { icon: circleIcon }).addTo(mapInstance.current);
          mapInstance.current.flyTo(loc, 14, { duration: 1 });
        }
      },
      () => {
        alert("📍 Could not access your location.\nShowing Austin, TX by default.");
        const defaultLoc: [number, number] = [30.2672, -97.7431];
        setUserLoc(defaultLoc);
        mapInstance.current?.flyTo(defaultLoc, 12, { duration: 1 });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  }, []);

  /* ── Map placeholder while loading ──────────────────────────── */
  const showSkeleton = isLoading && !mapReady;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-[100dvh] relative">
      {/* ─── Map ────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* ─── Top overlay: Search + Filters ──────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Search bar */}
          <div className="px-3 pt-3">
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 flex items-center gap-2 px-3 py-2.5 max-w-md mx-auto">
              <span className="text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search food, vendors..."
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                readOnly // placeholder — connects to search later
              />
            </div>
          </div>

          {/* Category chips */}
          <div className="category-scroll overflow-x-auto px-3 pt-2 pb-2">
            <div className="flex gap-2 max-w-md mx-auto">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-fresh-500 text-white shadow-md"
                        : "bg-white/90 text-gray-700 border border-gray-200 hover:bg-white"
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Now toggle */}
          <div className="px-3 pb-2 flex justify-center">
            <div className="bg-white/95 backdrop-blur rounded-full shadow border border-gray-200 flex items-center gap-2 px-3 py-1.5">
              <span className="text-sm font-medium text-gray-700">🕐 Available Now</span>
              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  availableOnly ? "bg-fresh-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    availableOnly ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Find Me button (bottom-right) ──────────────────────── */}
      <button
        onClick={handleFindMe}
        className="absolute bottom-24 right-4 z-10 find-me-btn"
        aria-label="Find my location"
      >
        📍
      </button>

      {/* ─── Floating stats badge ───────────────────────────────── */}
      <div className="absolute bottom-24 left-3 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur rounded-lg shadow px-2.5 py-1.5 text-xs font-medium text-gray-600 pointer-events-auto">
          {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* ─── Loading skeleton ───────────────────────────────────── */}
      {showSkeleton && (
        <div className="absolute inset-0 z-20 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-2">🥬</div>
            <p className="text-gray-500 text-sm">Loading the map...</p>
          </div>
        </div>
      )}

      {/* ─── Bottom Sheet ───────────────────────────────────────── */}
      {selectedVendor && (
        <div
          className="bottom-sheet-overlay"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains("bottom-sheet-overlay")) {
              setSelectedVendor(null);
            }
          }}
        >
          <div className="bottom-sheet">
            {/* Handle bar */}
            <div className="bottom-sheet-handle" />

            {/* Content */}
            <div className="p-4">
              {/* Photo + header */}
              <div className="flex gap-3 mb-3">
                {selectedVendor.photoUrl ? (
                  <img
                    src={selectedVendor.photoUrl}
                    alt={selectedVendor.businessName}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">
                    {selectedVendor.categoryIcon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {selectedVendor.businessName}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-yellow-500 text-sm">{"★".repeat(Math.round(selectedVendor.rating))}</span>
                    <span className="text-sm font-medium text-gray-700">{selectedVendor.rating}</span>
                    <span className="text-xs text-gray-400">({selectedVendor.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{selectedVendor.categoryIcon} {selectedVendor.categoryName}</span>
                    {selectedVendor.distance !== undefined && (
                      <span>• {selectedVendor.distance < 1 ? `${(selectedVendor.distance * 1000).toFixed(0)}m` : `${selectedVendor.distance.toFixed(1)}km`} away</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fresh Now badge */}
              {selectedVendor.hasFreshItems && (
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fresh-500" />
                  </span>
                  <span className="text-sm font-semibold text-fresh-600">
                    {selectedVendor.listingCount} item{selectedVendor.listingCount !== 1 ? "s" : ""} fresh now
                  </span>
                </div>
              )}

              {/* Bio */}
              {selectedVendor.bio && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{selectedVendor.bio}</p>
              )}

              {/* Address */}
              <p className="text-xs text-gray-400 mb-4">📍 {selectedVendor.address}</p>

              {/* View Vendor button */}
              <Link
                href={`/vendor/${selectedVendor.id}`}
                className="block w-full text-center bg-fresh-500 text-white font-semibold py-3 rounded-xl hover:bg-fresh-600 transition-colors"
              >
                View Vendor →
              </Link>

              {/* Dismiss hint */}
              <p className="text-center text-xs text-gray-400 mt-2">Swipe down to dismiss</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Nav spacer for safe area ────────────────────── */}
      <div className="safe-bottom" />
    </div>
  );
}
