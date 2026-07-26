"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";

interface Vendor {
  id: number;
  businessName: string;
  lat: number;
  lng: number;
  address: string;
  photoUrl: string | null;
  category?: string;
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Fetch vendors
  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data.vendors || []))
      .catch(() => {
        // Fallback mock data
        setVendors([
          {
            id: 1,
            businessName: "ATX Sourdough",
            lat: 30.2615,
            lng: -97.732,
            address: "1200 E 6th St",
            photoUrl: null,
          },
          {
            id: 2,
            businessName: "Eastside Eggs",
            lat: 30.2548,
            lng: -97.7089,
            address: "2400 Webberville Rd",
            photoUrl: null,
          },
          {
            id: 3,
            businessName: "Hill Country Honey",
            lat: 30.2477,
            lng: -97.9284,
            address: "8901 TX-71",
            photoUrl: null,
          },
          {
            id: 4,
            businessName: "Texas Pie Company",
            lat: 30.2351,
            lng: -97.7892,
            address: "4200 S Lamar Blvd",
            photoUrl: null,
          },
          {
            id: 5,
            businessName: "Sunset Farms Produce",
            lat: 30.4015,
            lng: -97.7207,
            address: "11501 Rock Rose Ave",
            photoUrl: null,
          },
        ]);
      });
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapReady) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([30.2672, -97.7431], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Store map instance for markers
      (window as any).__leafletMap = map;
      setMapReady(true);
    };

    initMap();
  }, [mapReady]);

  // Add markers when vendors load
  useEffect(() => {
    if (!mapReady || vendors.length === 0) return;

    const L = (window as any).L;
    if (!L) return;

    const map = (window as any).__leafletMap;
    if (!map) return;

    vendors.forEach((vendor) => {
      const marker = L.marker([vendor.lat, vendor.lng]).addTo(map);
      marker.bindPopup(
        `<div style="min-width:180px">
          <strong>${vendor.businessName}</strong><br/>
          <span style="font-size:0.85em;color:#666">${vendor.address}</span><br/>
          <a href="/vendor/${vendor.id}" style="color:#16a34a;font-weight:600;font-size:0.85em">View listings →</a>
        </div>`
      );
    });
  }, [mapReady, vendors]);

  return (
    <div className="flex flex-col h-[100dvh]">
      <Header />
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />
        {/* Floating overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-3 max-w-sm pointer-events-auto">
            <p className="text-sm font-semibold text-gray-800">
              🕐 Fresh Right Now
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {vendors.length} vendors with active listings today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
