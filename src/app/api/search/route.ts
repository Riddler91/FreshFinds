import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";
import { parseDietaryTags } from "@/lib/data";

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ query: q, vendors: [], listings: [], total: 0 });
  }

  const db = getRawDb();

  // Get all vendors
  const vendorRows = db.prepare("SELECT * FROM vendors").all() as any[];
  const allVendors = vendorRows.map((v: any) => ({
    id: v.id,
    businessName: v.business_name,
    lat: v.lat,
    lng: v.lng,
    address: v.address,
    photoUrl: v.photo_url || null,
    categoryName: v.category_name,
    categorySlug: v.category_slug,
    categoryIcon: v.category_icon,
    rating: 5.0,
    reviewCount: 0,
    listingCount: 0,
    hasFreshItems: false,
    bio: v.bio || null,
    state: v.state || "",
    city: v.city || "",
  }));

  // Get all active listings
  const listingRows = db.prepare("SELECT * FROM listings WHERE is_active = 1").all() as any[];
  const allListings = listingRows.map((l: any) => ({
    id: l.id,
    title: l.title || "",
    description: l.description || "",
    price: l.price || null,
    quantity: l.quantity || null,
    photoUrl: l.photo_url || null,
    dietaryTags: l.dietary_tags || "[]",
    vendorName: l.vendor_name || "Unknown Vendor",
    vendorId: l.vendor_id,
    categoryIcon: l.category_icon || "📦",
    postType: l.post_type || "available_now",
    postedAt: l.posted_at || new Date().toISOString(),
    expiresAt: l.expires_at || new Date(Date.now() + 86400000).toISOString(),
    pickupWindowStart: l.pickup_window_start || new Date().toISOString(),
    pickupWindowEnd: l.pickup_window_end || new Date(Date.now() + 86400000).toISOString(),
    city: l.city || "",
    state: l.state || "",
  }));

  // Search vendors: match on name, bio, category, city
  const matchedVendors = allVendors.filter((v) => {
    return (
      matchesQuery(v.businessName, q) ||
      (v.bio && matchesQuery(v.bio, q)) ||
      matchesQuery(v.categoryName, q) ||
      matchesQuery(v.city || "", q)
    );
  });

  // Search listings: match on title, description, dietary tags
  const matchedListings = allListings.filter((l) => {
    const dietary = parseDietaryTags(l.dietaryTags).join(" ");
    return (
      matchesQuery(l.title, q) ||
      matchesQuery(l.description, q) ||
      matchesQuery(dietary, q) ||
      matchesQuery(l.vendorName, q) ||
      matchesQuery(l.city || "", q)
    );
  });

  // Also include listings from matched vendors
  const vendorListingIds = new Set(matchedListings.map((l) => l.id));
  for (const v of matchedVendors) {
    const vendorListings = allListings.filter((l) => l.vendorId === v.id);
    for (const vl of vendorListings) {
      if (!vendorListingIds.has(vl.id)) {
        matchedListings.push(vl);
        vendorListingIds.add(vl.id);
      }
    }
  }

  return NextResponse.json({
    query: q,
    vendors: matchedVendors,
    listings: matchedListings,
    total: matchedVendors.length + matchedListings.length,
  });
}
