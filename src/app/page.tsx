"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Navigation,
  MapPin,
  Star,
  Clock,
  Leaf,
  X,
  SlidersHorizontal,
  Loader2,
  ChevronDown,
  Building2,
} from "lucide-react";
import { CITIES, getCitiesGroupedByState, type CityDef } from "@/lib/data";

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

const DIETARY_FILTERS = [
  { slug: "vegan", label: "Vegan", emoji: "🌱" },
  { slug: "vegetarian", label: "Vegetarian", emoji: "🥬" },
  { slug: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
  { slug: "dairy-free", label: "Dairy-Free", emoji: "🥛" },
  { slug: "nut-free", label: "Nut-Free", emoji: "🥜" },
  { slug: "keto", label: "Keto", emoji: "🥑" },
  { slug: "organic", label: "Organic", emoji: "🍃" },
  { slug: "sugar-free", label: "Sugar-Free", emoji: "🍬" },
];

const RADIUS_OPTIONS = [
  { value: 5, label: "5 mi" },
  { value: 10, label: "10 mi" },
  { value: 25, label: "25 mi" },
  { value: 50, label: "50 mi" },
];

const CITY_GROUPS = getCitiesGroupedByState();

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

function haversineMi(a: [number, number], b: [number, number]): number {
  return haversineKm(a, b) * 0.621371;
}

/* ── Component ────────────────────────────────────────────────── */

/* ── BottomSheet with swipe-to-dismiss ───────────────────────── */
function BottomSheet({
  vendor,
  onClose,
}: {
  vendor: Vendor;
  onClose: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    // Only start drag if touching near the handle or at the top of scroll
    if (sheet.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0) {
      sheet.style.transform = `translateY(${delta}px)`;
      sheet.classList.add("swiping");
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const delta = currentY.current - startY.current;
    sheet.classList.remove("swiping");

    if (delta > 100) {
      // Dismiss
      sheet.classList.add("dismissing");
      const overlay = sheet.parentElement;
      if (overlay) overlay.classList.add("dismissing");
      setTimeout(onClose, 250);
    } else {
      // Snap back
      sheet.style.transform = "";
    }
  };

  return (
    <div
      className="bottom-sheet-overlay"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("bottom-sheet-overlay")) {
          onClose();
        }
      }}
    >
      <div
        ref={sheetRef}
        className="bottom-sheet"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bottom-sheet-handle" />

        <div className="p-5">
          {/* Photo + header */}
          <div className="flex gap-3 mb-4">
            {vendor.photoUrl ? (
              <img
                src={vendor.photoUrl}
                alt={vendor.businessName}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-warm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center flex-shrink-0 text-2xl shadow-warm">
                {vendor.categoryIcon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold font-serif text-ink truncate">
                {vendor.businessName}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-3.5 h-3.5 text-honey-500 fill-honey-500" />
                <span className="text-sm font-semibold text-ink">{vendor.rating}</span>
                <span className="text-xs text-ink-muted">({vendor.reviewCount})</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                <span>{vendor.categoryIcon} {vendor.categoryName}</span>
                {vendor.distance !== undefined && (
                  <span>• {vendor.distance < 1 ? `${(vendor.distance * 1000).toFixed(0)}m` : `${vendor.distance.toFixed(1)}km`} away</span>
                )}
              </div>
            </div>
          </div>

          {/* Fresh Now badge */}
          {vendor.hasFreshItems && (
            <div className="flex items-center gap-2 mb-3 bg-cream-50 rounded-2xl px-3 py-2 border border-cream-200/60">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-500" />
              </span>
              <span className="text-sm font-bold text-sage-600 font-sans">
                {vendor.listingCount} item{vendor.listingCount !== 1 ? "s" : ""} fresh right now!
              </span>
            </div>
          )}

          {/* Bio */}
          {vendor.bio && (
            <p className="text-sm text-ink-light mb-3 line-clamp-2 leading-relaxed">{vendor.bio}</p>
          )}

          {/* Address */}
          <p className="text-xs text-ink-muted mb-4 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {vendor.address}
          </p>

          {/* View Vendor button */}
          <Link
            href={`/vendor/${vendor.id}`}
            className="block w-full text-center bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] touch-scale"
          >
            View Vendor →
          </Link>

          <p className="text-center text-xs text-ink-muted mt-3">Swipe down to dismiss</p>
        </div>
      </div>
    </div>
  );
}

/* ── MapPage Component ────────────────────────────────────────── */
export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ZIP search
  const [zipInput, setZipInput] = useState("");
  const [zipLocation, setZipLocation] = useState<{ lat: number; lng: number; display: string } | null>(null);
  const [radius, setRadius] = useState(10);
  const [geocoding, setGeocoding] = useState(false);

  // City picker
  const [selectedCity, setSelectedCity] = useState<CityDef>(CITIES[0]); // default: Austin
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Dietary & category filters (enhanced)
  const [showFilters, setShowFilters] = useState(false);
  const [activeDietary, setActiveDietary] = useState<string[]>([]);
  const [activeAvailability, setActiveAvailability] = useState<string | null>(null);

  // Global search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<any>(null);

  const mapInstance = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markerGroup = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const radiusCircle = useRef<any>(null);
  const initDone = useRef(false);

  /* ── Fetch vendors ──────────────────────────────────────────── */
  const fetchVendors = useCallback(() => {
    let url = "/api/vendors";
    if (zipLocation) {
      url += `?lat=${zipLocation.lat}&lng=${zipLocation.lng}&radius=${radius}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const v: Vendor[] = data.vendors || [];
        setVendors(v);
        setFilteredVendors(v);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [zipLocation, radius]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  /* ── Apply category/dietary filters ──────────────────────────── */
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
        } else if (zipLocation) {
          const dist = haversineMi([zipLocation.lat, zipLocation.lng], [vendor.lat, vendor.lng]);
          setSelectedVendor({ ...vendor, distance: dist });
        } else {
          setSelectedVendor({ ...vendor, distance: undefined });
        }
      });

      mcg.addLayer(marker);
    });

    map.addLayer(mcg);
  }, [filteredVendors, mapReady, userLoc, zipLocation]);

  /* ── Update radius circle ───────────────────────────────────── */
  useEffect(() => {
    if (!mapReady || !zipLocation) return;
    const L = leafletRef.current;
    const map = mapInstance.current;
    if (!L || !map) return;

    if (radiusCircle.current) {
      map.removeLayer(radiusCircle.current);
    }

    const miToMeters = radius * 1609.34;
    radiusCircle.current = L.circle([zipLocation.lat, zipLocation.lng], {
      radius: miToMeters,
      color: "#7C9082",
      weight: 2,
      opacity: 0.3,
      fillColor: "#7C9082",
      fillOpacity: 0.08,
      dashArray: "8 4",
    }).addTo(map);

    map.flyTo([zipLocation.lat, zipLocation.lng], 12, { duration: 0.8 });
  }, [zipLocation, radius, mapReady]);

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

  /* ── ZIP Code search ────────────────────────────────────────── */
  const handleZipSearch = useCallback(async (zip: string) => {
    const cleaned = zip.trim().slice(0, 5);
    if (cleaned.length < 5) return;

    setGeocoding(true);
    try {
      const res = await fetch(`/api/geocode?zip=${cleaned}`);
      const data = await res.json();
      if (data.result) {
        const loc = { lat: data.result.lat, lng: data.result.lng, display: data.result.displayName };
        setZipLocation(loc);
        setZipInput(cleaned);
      }
    } catch {}
    setGeocoding(false);
  }, []);

  const handleZipKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleZipSearch(zipInput);
    }
  };

  const handleCityPreset = useCallback((city: CityDef) => {
    const loc = { lat: city.lat, lng: city.lng, display: `${city.name}, ${city.state}` };
    setZipLocation(loc);
    setZipInput(city.zipHint);
    setSelectedCity(city);
    setShowCityPicker(false);
  }, []);

  const handleCitySelect = useCallback((city: CityDef) => {
    setSelectedCity(city);
    const loc = { lat: city.lat, lng: city.lng, display: `${city.name}, ${city.state}` };
    setZipLocation(loc);
    setZipInput(city.zipHint);
    setShowCityPicker(false);
    // Fly map to city
    if (mapInstance.current) {
      mapInstance.current.flyTo([city.lat, city.lng], city.defaultZoom, { duration: 0.8 });
    }
  }, []);

  /* ── Global search with autocomplete ────────────────────────── */
  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (val.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(val)}`)
        .then((r) => r.json())
        .then((data) => {
          const suggestions = [
            ...(data.vendors || []).slice(0, 3).map((v: any) => ({ type: "vendor", ...v })),
            ...(data.listings || []).slice(0, 3).map((l: any) => ({ type: "listing", ...l })),
          ];
          setSearchSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        })
        .catch(() => {});
    }, 250);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const toggleDietary = (slug: string) => {
    setActiveDietary((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const activeFilterCount = activeDietary.length + (activeAvailability ? 1 : 0) + (availableOnly ? 1 : 0);

  const showSkeleton = isLoading && !mapReady;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-[100dvh] relative">
      {/* ─── Map ────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* ─── Warm top gradient overlay ──────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-56 z-[5] pointer-events-none bg-gradient-to-b from-cream-50/95 via-cream-50/40 to-transparent" />

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
                {zipLocation ? zipLocation.display : `${selectedCity.name}, ${selectedCity.state}`}
              </span>
            </div>
          </div>

          {/* Global search bar */}
          <div className="px-3 relative">
            <div className="bg-card/95 backdrop-blur rounded-2xl shadow-warm border border-cream-200/60 flex items-center gap-2 px-3 py-2.5 max-w-md mx-auto">
              <Search className="w-4 h-4 text-ink-muted" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Find sourdough, honey, fresh eggs..."
                className="flex-1 bg-transparent text-sm text-ink placeholder-ink-muted/60 outline-none font-sans"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}>
                  <X className="w-4 h-4 text-ink-muted" />
                </button>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-3 right-3 top-full mt-1 max-w-md mx-auto bg-card rounded-2xl shadow-warm-lg border border-cream-200/60 overflow-hidden z-30">
                {searchSuggestions.map((s, i) => (
                  <Link
                    key={`${s.type}-${s.id}-${i}`}
                    href={s.type === "vendor" ? `/vendor/${s.id}` : `/vendor/${s.vendorId}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream-50 transition-colors text-sm"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <span className="text-lg flex-shrink-0">{s.categoryIcon || "📦"}</span>
                    <span className="flex-1 truncate font-medium text-ink">
                      {s.type === "vendor" ? s.businessName : s.title}
                    </span>
                    <span className="text-xs text-ink-muted flex-shrink-0">
                      {s.type === "vendor" ? "Vendor" : s.vendorName}
                    </span>
                  </Link>
                ))}
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="block text-center px-4 py-2.5 bg-cream-50 text-sm font-bold text-sage-600 hover:bg-cream-100 transition-colors"
                  onClick={() => setShowSuggestions(false)}
                >
                  See all results for "{searchQuery}" →
                </Link>
              </div>
            )}
          </div>

          {/* ZIP Code search row */}
          <div className="px-3 mt-2">
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <div className="flex-1 bg-card/95 backdrop-blur rounded-2xl shadow-warm border border-cream-200/60 flex items-center gap-2 px-3 py-2">
                <MapPin className="w-4 h-4 text-terra-500 flex-shrink-0" strokeWidth={2} />
                <input
                  type="text"
                  inputMode="numeric"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  onKeyDown={handleZipKeyDown}
                  placeholder="Enter ZIP code..."
                  className="flex-1 bg-transparent text-sm text-ink placeholder-ink-muted/60 outline-none font-sans"
                  maxLength={5}
                />
                {geocoding ? (
                  <Loader2 className="w-4 h-4 text-sage-500 animate-spin flex-shrink-0" />
                ) : (
                  <button
                    onClick={() => handleZipSearch(zipInput)}
                    className="flex-shrink-0 bg-sage-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-sage-400 transition-colors"
                  >
                    Go
                  </button>
                )}
              </div>

              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-warm ${
                  showFilters || activeFilterCount > 0
                    ? "bg-sage-500 text-white"
                    : "bg-card/95 text-ink-muted border border-cream-200/60"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-terra-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* City picker */}
          <div className="px-3 pt-2 pb-1">
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-1.5 bg-card/95 backdrop-blur rounded-2xl shadow-warm border border-cream-200/60 px-3 py-2 text-sm font-semibold text-ink hover:bg-cream-50 transition-all"
              >
                <Building2 className="w-4 h-4 text-sage-500" strokeWidth={2} />
                {selectedCity.name}, {selectedCity.state}
                <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
              </button>
              <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
                {CITIES.slice(0, 5).map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => handleCityPreset(city)}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedCity.slug === city.slug
                        ? "bg-sage-500 text-white shadow-warm scale-105"
                        : "bg-card/90 text-ink-light border border-cream-200/60 hover:bg-cream-100 shadow-warm"
                    }`}
                  >
                    📍 {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* City picker dropdown */}
            {showCityPicker && (
              <div className="mt-2 max-w-md mx-auto bg-card/98 backdrop-blur rounded-2xl shadow-warm-lg border border-cream-200/60 overflow-hidden z-30 animate-fade-in-up max-h-80 overflow-y-auto">
                {CITY_GROUPS.map((group) => (
                  <div key={group.state}>
                    <div className="px-4 py-2 bg-cream-50/80 text-xs font-bold text-ink-muted uppercase tracking-wider">
                      {group.stateName}
                    </div>
                    {group.cities.map((city) => (
                      <button
                        key={city.slug}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-cream-50 transition-colors ${
                          selectedCity.slug === city.slug ? "bg-sage-50 font-bold text-sage-700" : "text-ink font-medium"
                        }`}
                      >
                        <span className="text-lg">{selectedCity.slug === city.slug ? "📍" : "🗺️"}</span>
                        <span>{city.name}</span>
                        <span className="text-xs text-ink-muted ml-auto">{city.state}</span>
                        {selectedCity.slug === city.slug && (
                          <span className="text-xs bg-sage-500 text-white px-1.5 py-0.5 rounded-full">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Radius selector — shown when ZIP is active */}
          {zipLocation && (
            <div className="px-3 pt-1 pb-1">
              <div className="flex items-center gap-2 max-w-md mx-auto bg-card/90 backdrop-blur rounded-full shadow-warm border border-cream-200/60 px-2 py-1.5">
                <span className="text-xs font-semibold text-ink-muted ml-2">Radius:</span>
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRadius(opt.value)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      radius === opt.value
                        ? "bg-sage-500 text-white shadow-warm"
                        : "text-ink-muted hover:bg-cream-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced filter panel */}
          {showFilters && (
            <div className="px-3 pt-1">
              <div className="bg-card/95 backdrop-blur rounded-2xl shadow-warm border border-cream-200/60 p-4 max-w-md mx-auto space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink font-serif">Filters</span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setActiveDietary([]); setActiveAvailability(null); setAvailableOnly(false); }}
                      className="text-xs font-bold text-terra-500 hover:text-terra-400"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Dietary filters */}
                <div>
                  <p className="text-xs font-semibold text-ink-muted mb-2">Dietary</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DIETARY_FILTERS.map((d) => (
                      <button
                        key={d.slug}
                        onClick={() => toggleDietary(d.slug)}
                        className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          activeDietary.includes(d.slug)
                            ? "bg-sage-500 text-white shadow-warm"
                            : "bg-cream-50 text-ink-light border border-cream-200/60 hover:bg-cream-100"
                        }`}
                      >
                        {d.emoji} {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability filters */}
                <div>
                  <p className="text-xs font-semibold text-ink-muted mb-2">Availability</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { slug: "now", label: "Available Now" },
                      { slug: "today", label: "Today" },
                      { slug: "week", label: "This Week" },
                    ].map((a) => (
                      <button
                        key={a.slug}
                        onClick={() => setActiveAvailability(activeAvailability === a.slug ? null : a.slug)}
                        className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          activeAvailability === a.slug
                            ? "bg-honey-500 text-white shadow-warm"
                            : "bg-cream-50 text-ink-light border border-cream-200/60 hover:bg-cream-100"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
          {filteredVendors.length === 0 && !isLoading
            ? `Be the first vendor in ${selectedCity.name}!`
            : zipLocation
              ? `${filteredVendors.length} vendor${filteredVendors.length !== 1 ? "s" : ""} within ${radius} mi`
              : `${filteredVendors.length} vendor${filteredVendors.length !== 1 ? "s" : ""}`}
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

      {/* ─── Empty state overlay (no vendors, map loaded) ────────── */}
      {!isLoading && mapReady && filteredVendors.length === 0 && (
        <div className="absolute bottom-24 left-0 right-0 z-10 px-4">
          <div className="max-w-md mx-auto bg-card/95 backdrop-blur rounded-3xl shadow-warm-lg border border-cream-200/60 p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-sage-50 flex items-center justify-center shadow-warm">
              <MapPin className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold font-serif text-ink mb-2">
              No vendors in {selectedCity.name} yet — be the first!
            </h2>
            <p className="text-sm text-ink-muted mb-4 max-w-xs mx-auto leading-relaxed">
              {selectedCity.name} is waiting for its first cottage food vendor. If you bake, grow, or make food at home, you could be the one to put {selectedCity.name} on the map!
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-terra-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98]"
            >
              🚀 Sign Up as a Vendor — It&apos;s Free
            </Link>
            <p className="text-xs text-ink-muted mt-3">
              Try a different city? Use the city picker above ↑
            </p>
          </div>
        </div>
      )}

      {/* ─── Bottom Sheet ───────────────────────────────────────── */}
      {selectedVendor && (
        <BottomSheet
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}

      {/* ─── Bottom Nav spacer ──────────────────────────────────── */}
      <div className="safe-bottom" />
    </div>
  );
}
