import { NextRequest, NextResponse } from "next/server";
import { haversineMi } from "@/lib/haversine";
import { getStore } from "@/lib/store";
import { MOCK_VENDORS, MOCK_REVIEWS, getCityBySlug, getCityByName } from "@/lib/data";

// ── In-memory store types ──────────────────────────────────────────
interface VendorRecord {
  id: number;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  address: string;
  lat: number;
  lng: number;
  bio?: string;
  photoUrl?: string;
  verified: boolean;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  website?: string;
  socialLinks?: string;
  state?: string;
  city?: string;
  createdAt: string;
}

// ── Helper: build full vendor profile ────────────────────────────
function getVendorProfile(vendorId: string) {
  const mockVendor = MOCK_VENDORS.find((v) => v.id === parseInt(vendorId));
  const mockReviews = MOCK_REVIEWS[vendorId] || [];

  const store = getStore();
  const dynVendor = store.vendors.find((v) => v.id === parseInt(vendorId));
  const dynListings = store.listings.filter((l) => l.vendorId === parseInt(vendorId));
  const dynReviews = store.reviews.filter((r) => r.vendorId === parseInt(vendorId));

  if (!mockVendor && !dynVendor) return null;

  if (dynVendor) {
    return {
      vendor: {
        ...dynVendor,
        rating: dynReviews.length > 0
          ? dynReviews.reduce((s: number, r: any) => s + r.rating, 0) / dynReviews.length
          : 5.0,
        reviewCount: dynReviews.length,
        listingCount: dynListings.length,
        hasFreshItems: dynListings.some((l: any) => {
          const start = new Date(l.pickupWindowStart).getTime();
          return start <= Date.now() + 86400000;
        }),
      },
      listings: dynListings.map((l: any) => ({
        ...l,
        isFresh: new Date(l.pickupWindowStart).getTime() <= Date.now() + 86400000,
        createdAt: l.createdAt,
      })),
      reviews: dynReviews,
    };
  }

  return {
    vendor: {
      ...mockVendor,
      email: "",
      phone: "",
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
    listings: [],
    reviews: mockReviews,
  };
}

// ── GET ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get("id");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");
  const city = searchParams.get("city");
  const state = searchParams.get("state");

  // Single vendor lookup
  if (vendorId) {
    const data = getVendorProfile(vendorId);
    if (!data) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  // List all vendors for map
  const store = getStore();
  const dynVendors = store.vendors.map((v: any) => ({
    id: v.id,
    businessName: v.businessName,
    lat: v.lat,
    lng: v.lng,
    address: v.address,
    photoUrl: v.photoUrl || null,
    categoryName: v.categoryName,
    categorySlug: v.categorySlug,
    categoryIcon: v.categoryIcon,
    rating: 5.0,
    reviewCount: 0,
    listingCount: store.listings.filter((l: any) => l.vendorId === v.id).length,
    hasFreshItems: store.listings
      .filter((l: any) => l.vendorId === v.id)
      .some((l: any) => new Date(l.pickupWindowStart).getTime() <= Date.now() + 86400000),
    bio: v.bio || null,
    state: v.state || "",
    city: v.city || "",
  }));

  let allVendors: any[] = [...MOCK_VENDORS, ...dynVendors];

  // City filtering
  if (city) {
    const cityLower = city.toLowerCase();
    const cityDef = getCityBySlug(cityLower) || getCityByName(cityLower);
    if (cityDef) {
      allVendors = allVendors.filter((v) =>
        v.city?.toLowerCase() === cityDef.name.toLowerCase()
      );
    }
  }

  // State filtering
  if (state) {
    allVendors = allVendors.filter((v) =>
      v.state?.toUpperCase() === state.toUpperCase()
    );
  }

  // Distance filtering
  if (lat && lng && radius) {
    const center: [number, number] = [parseFloat(lat), parseFloat(lng)];
    const radiusMi = parseFloat(radius);

    allVendors = allVendors
      .map((v) => {
        const distance = haversineMi(center, [v.lat, v.lng]);
        return { ...v, distance: Math.round(distance * 10) / 10 };
      })
      .filter((v) => v.distance <= radiusMi)
      .sort((a, b) => a.distance - b.distance);
  }

  return NextResponse.json({ vendors: allVendors });
}

// ── POST ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json();
  const store = getStore();

  const id = store.nextVendorId++;
  const now = new Date().toISOString();

  const vendor: VendorRecord = {
    id,
    name: body.name || "",
    businessName: body.businessName || "",
    email: body.email || "",
    phone: body.phone || "",
    address: body.address || "",
    lat: body.lat || 30.2672,
    lng: body.lng || -97.7431,
    bio: body.bio || "",
    photoUrl: body.photoUrl || "",
    verified: false,
    categoryName: body.categoryName || "Other",
    categorySlug: body.categorySlug || "other",
    categoryIcon: body.categoryIcon || "📦",
    website: body.website || "",
    socialLinks: body.socialLinks || "",
    state: body.state || "TX",
    city: body.city || "Austin",
    createdAt: now,
  };

  store.vendors.push(vendor);

  return NextResponse.json({ vendor }, { status: 201 });
}
