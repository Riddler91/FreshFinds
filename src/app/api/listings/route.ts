import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { MOCK_LISTINGS_WITH_EXPIRY, parseDietaryTags, getCityBySlug, getCityByName, expireAfter } from "@/lib/data";

const NOW = Date.now();

// ── GET ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const POST_TYPE_META: Record<string, { emoji: string; label: string }> = {
    baked_today: { emoji: "🥖", label: "Baked fresh this morning" },
    harvested_today: { emoji: "🌽", label: "Picked this morning" },
    just_made: { emoji: "🍪", label: "Cooling on the rack right now" },
    limited_batch: { emoji: "✨", label: "Small batch — limited availability" },
    available_now: { emoji: "🛒", label: "Ready for pickup now" },
  };
  const { searchParams } = new URL(request.url);
  const freshOnly = searchParams.get("fresh") === "true";
  const dietary = searchParams.get("dietary");
  const category = searchParams.get("category");
  const city = searchParams.get("city");

  // Merge mock + dynamically created listings from in-memory store
  const store = getStore();
  const dynListings = store
    ? store.listings
        .filter((l: any) => l.isActive !== false)
        .map((l: any) => {
          const postedAt = l.createdAt || new Date().toISOString();
          return {
            id: l.id,
            title: l.title,
            description: l.description,
            price: l.price,
            quantity: l.quantity,
            photoUrl: l.photoUrl || null,
            dietaryTags: l.dietaryTags || "[]",
            vendorName: "New Vendor",
            vendorId: l.vendorId,
            categoryIcon: "📦",
            categorySlug: "other",
            postType: l.postType || "available_now",
            postedAt,
            expiresAt: expireAfter(postedAt),
            pickupWindowStart: l.pickupWindowStart || postedAt,
            pickupWindowEnd: l.pickupWindowEnd || expireAfter(postedAt),
            city: l.city || "",
            state: l.state || "",
          };
        })
    : [];

  let allListings = [...MOCK_LISTINGS_WITH_EXPIRY, ...dynListings];

  // City filtering
  if (city) {
    const cityLower = city.toLowerCase();
    const cityDef = getCityBySlug(cityLower) || getCityByName(cityLower);
    if (cityDef) {
      allListings = allListings.filter((l) =>
        l.city?.toLowerCase() === cityDef.name.toLowerCase()
      );
    }
  }

  // Filter fresh only: exclude expired listings
  if (freshOnly) {
    allListings = allListings.filter((l) => new Date(l.expiresAt).getTime() > NOW);
  }

  // Filter by dietary tags (comma-separated, AND logic — must match all)
  if (dietary) {
    const requiredTags = dietary.split(",").map((t) => t.trim().toLowerCase());
    allListings = allListings.filter((l) => {
      const tags = parseDietaryTags(l.dietaryTags).map((t) => t.toLowerCase());
      return requiredTags.every((rt) => tags.includes(rt));
    });
  }

  // Filter by category slug
  if (category) {
    const categorySlugs = category.split(",").map((c) => c.trim().toLowerCase());
    allListings = allListings.filter((l) =>
      categorySlugs.includes((l as any).categorySlug?.toLowerCase() || "")
    );
  }

  return NextResponse.json({ listings: allListings });
}

// ── POST ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json();

  const store = getStore();
  if (!store) {
    return NextResponse.json({ error: "Store not initialized. Create a vendor first." }, { status: 400 });
  }

  const id = store.nextListingId++;
  const now = new Date().toISOString();

  const listing = {
    id,
    vendorId: body.vendorId,
    title: body.title || "",
    description: body.description || "",
    price: body.price || null,
    quantity: body.quantity || null,
    photoUrl: body.photoUrl || null,
    dietaryTags: Array.isArray(body.dietaryTags) ? JSON.stringify(body.dietaryTags) : (body.dietaryTags || "[]"),
    postType: body.postType || "available_now",
    postedAt: now,
    expiresAt: body.expiresAt || new Date(Date.now() + 86400000).toISOString(),
    pickupWindowStart: body.pickupWindowStart || now,
    pickupWindowEnd: body.pickupWindowEnd || new Date(Date.now() + 86400000).toISOString(),
    ingredients: body.ingredients || null,
    allergenWarning: body.allergenWarning || null,
    isActive: true,
    createdAt: now,
    city: body.city || "",
    state: body.state || "",
  };

  store.listings.push(listing);

  return NextResponse.json({ listing }, { status: 201 });
}
