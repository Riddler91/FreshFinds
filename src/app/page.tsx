"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Navigation, MapPin, Star, Clock, Leaf, X } from "lucide-react";

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

      leafletRef.current = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [30.2672, -97.7431],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

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

    if (markerGroup.current) {
      map.removeLayer(markerGroup.current);
    }

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
      const bounceClass = vendor.hasFreshItems ? " bouncing" : "";

      const icon = L.divIcon({
        className: `vendor-marker ${markerColor}${bounceClass}`,
        html: `<span>${vendor.categoryIcon}</span>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -24],
      });

      const marker = L.marker([vendor.lat, vendor.lng], { icon });

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

        if (userMarker.current) {
          mapInstance.current?.removeLayer(userMarker.current);
        }

        const L = leafletRef.current;
        if (mapInstance.current && L) {
          const circleIcon = L.divIcon({
            className: "",
            html: `<div style="width:18px;height:18px;border-radius:50%;background:#C2765C;border:3px solid #FFFBF5;box-shadow:0 0 0 4px rgba(194,118,92,0.35);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });
          userMarker.current = L.marker(loc, { icon: circleIcon }).addTo(mapInstance.current);
          mapInstance.current.flyTo(loc, 14, { duration: 1 });
        }
      },
      () => {
        const defaultLoc: [number, number] = [30.2672, -97.7431];
        setUserLoc(defaultLoc);
        mapInstance.current?.flyTo(defaultLoc, 12, { duration: 1 });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  }, []);

  const showSkeleton = isLoading && !mapReady;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-[100dvh] relative">
      {/* ─── Map ────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* ─── Warm top gradient overlay ──────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-48 z-[5] pointer-events-none bg-gradient-to-b from-cream-50/90 via-cream-50/40 to-transparent" />

      {/* ─── Top overlay: Header + Search + Filters ─────────────── */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Logo + Location bar */}
          <div className="px-3 pt-3">
            <div className="flex items-center justify-between max-w-md mx-auto mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center shadow-warm">
                  <Leaf className="w-5 h-5 text-sage-600" strokeWidth={2} />
                </div>
                <span className="text-xl font-bold font-serif text-ink">FreshFinds</span>
              </div>
              <span className="text-xs text-ink-muted bg-cream-50/90 backdrop-blur px-2.5 py-1 rounded-full font-medium border border-cream-200/50 shadow-warm">
                Austin, TX
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-3">
            <div className="bg-card/95 backdrop-blur rounded-2xl shadow-warm border border-cream-200/60 flex items-center gap-2 px-3 py-2.5 max-w-md mx-auto">
              <Search className="w-4 h-4 text-ink-muted" strokeWidth={2} />
              <input
                type="text"
                placeholder="Find sourdough, honey, fresh eggs..."
                className="flex-1 bg-transparent text-sm text-ink placeholder-ink-muted/60 outline-none font-sans"
                readOnly
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
                    className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-sage-500 text-white shadow-warm scale-105"
                        : "bg-card/90 text-ink-light border border-cream-200/60 hover:bg-cream-100 shadow-warm"
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
            <div className="bg-card/95 backdrop-blur rounded-full shadow-warm border border-cream-200/60 flex items-center gap-2.5 px-4 py-2">
              <Clock className="w-4 h-4 text-sage-500" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-ink-light">Fresh Now</span>
              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  availableOnly ? "bg-sage-500" : "bg-cream-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform duration-200 ${
                    availableOnly ? "translate-x-5 left-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Find Me button ─────────────────────────────────────── */}
      <button
        onClick={handleFindMe}
        className="absolute bottom-24 right-4 z-10 find-me-btn"
        aria-label="Find my location"
      >
        <Navigation className="w-5 h-5 text-terra-500" strokeWidth={2.5} />
      </button>

      {/* ─── Floating stats badge ───────────────────────────────── */}
      <div className="absolute bottom-24 left-3 z-10 pointer-events-none">
        <div className="bg-card/95 backdrop-blur rounded-2xl shadow-warm px-3 py-2 text-xs font-semibold text-ink-muted pointer-events-auto border border-cream-200/40 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sage-500" />
          {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ─── Loading skeleton ───────────────────────────────────── */}
      {showSkeleton && (
        <div className="absolute inset-0 z-20 bg-cream-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-cream-100 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-sage-400 animate-pulse" strokeWidth={1.5} />
            </div>
            <p className="text-ink-muted text-sm font-medium">Finding fresh food near you...</p>
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
            <div className="bottom-sheet-handle" />

            <div className="p-5">
              {/* Photo + header */}
              <div className="flex gap-3 mb-4">
                {selectedVendor.photoUrl ? (
                  <img
                    src={selectedVendor.photoUrl}
                    alt={selectedVendor.businessName}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-warm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center flex-shrink-0 text-2xl shadow-warm">
                    {selectedVendor.categoryIcon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold font-serif text-ink truncate">
                    {selectedVendor.businessName}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3.5 h-3.5 text-honey-500 fill-honey-500" />
                    <span className="text-sm font-semibold text-ink">{selectedVendor.rating}</span>
                    <span className="text-xs text-ink-muted">({selectedVendor.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                    <span>{selectedVendor.categoryIcon} {selectedVendor.categoryName}</span>
                    {selectedVendor.distance !== undefined && (
                      <span>• {selectedVendor.distance < 1 ? `${(selectedVendor.distance * 1000).toFixed(0)}m` : `${selectedVendor.distance.toFixed(1)}km`} away</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fresh Now badge */}
              {selectedVendor.hasFreshItems && (
                <div className="flex items-center gap-2 mb-3 bg-cream-50 rounded-2xl px-3 py-2 border border-cream-200/60">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-500" />
                  </span>
                  <span className="text-sm font-bold text-sage-600 font-sans">
                    {selectedVendor.listingCount} item{selectedVendor.listingCount !== 1 ? "s" : ""} fresh right now!
                  </span>
                </div>
              )}

              {/* Bio */}
              {selectedVendor.bio && (
                <p className="text-sm text-ink-light mb-3 line-clamp-2 leading-relaxed">{selectedVendor.bio}</p>
              )}

              {/* Address */}
              <p className="text-xs text-ink-muted mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {selectedVendor.address}
              </p>

              {/* View Vendor button */}
              <Link
                href={`/vendor/${selectedVendor.id}`}
                className="block w-full text-center bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98]"
              >
                View Vendor →
              </Link>

              <p className="text-center text-xs text-ink-muted mt-3">Swipe down to dismiss</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Nav spacer ──────────────────────────────────── */}
      <div className="safe-bottom" />
    </div>
  );
}
