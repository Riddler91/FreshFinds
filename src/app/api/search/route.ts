import { NextRequest, NextResponse } from "next/server";
import { MOCK_VENDORS, MOCK_LISTINGS, parseDietaryTags } from "@/lib/data";

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ query: q, vendors: [], listings: [], total: 0 });
  }

  const store = globalThis.__freshfinds_store;
  const dynVendors = store?.vendors || [];
  const dynListingsArr = (store?.listings || []).filter((l: any) => l.isActive !== false).map((l: any) => ({
    id: l.id,
    title: l.title || "",
    description: l.description || "",
    price: l.price || null,
    quantity: l.quantity || null,
    photoUrl: l.photoUrl || null,
    dietaryTags: l.dietaryTags || "[]",
    vendorName: "New Vendor",
    vendorId: l.vendorId,
    categoryIcon: "📦",
    postType: l.postType || "available_now",
    postedAt: l.createdAt || new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    pickupWindowStart: l.pickupWindowStart || new Date().toISOString(),
    pickupWindowEnd: l.pickupWindowEnd || new Date(Date.now() + 86400000).toISOString(),
    city: l.city || "",
    state: l.state || "",
  }));

  const allVendors = [...MOCK_VENDORS, ...dynVendors.map((v: any) => ({
    id: v.id, businessName: v.businessName, lat: v.lat, lng: v.lng,
    address: v.address, photoUrl: v.photoUrl || null, categoryName: v.categoryName,
    categorySlug: v.categorySlug, categoryIcon: v.categoryIcon,
    rating: 5.0, reviewCount: 0, listingCount: 0, hasFreshItems: false,
    bio: v.bio || null, state: v.state || "", city: v.city || "",
  }))];
  const allListings = [...MOCK_LISTINGS, ...dynListingsArr];

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
