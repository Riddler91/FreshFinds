import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";
import { expireAfter, parseDietaryTags } from "@/lib/data";

const NOW = Date.now();

// ── GET ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const postTypeMeta: Record<string, { emoji: string; label: string }> = {
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

  const db = getRawDb();
  const rows = db.prepare(
    "SELECT * FROM listings WHERE is_active = 1 ORDER BY posted_at DESC"
  ).all() as any[];

  let allListings = rows.map((l: any) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    price: l.price,
    quantity: l.quantity,
    photoUrl: l.photo_url || null,
    dietaryTags: l.dietary_tags || "[]",
    vendorName: l.vendor_name || "Unknown Vendor",
    vendorId: l.vendor_id,
    categoryIcon: l.category_icon || "📦",
    categorySlug: l.category_slug || "other",
    postType: l.post_type || "available_now",
    postedAt: l.posted_at,
    expiresAt: l.expires_at || expireAfter(l.posted_at || new Date().toISOString()),
    pickupWindowStart: l.pickup_window_start,
    pickupWindowEnd: l.pickup_window_end,
    ingredients: l.ingredients,
    allergenWarning: l.allergen_warning,
    city: l.city || "",
    state: l.state || "",
  }));

  // City filtering
  if (city) {
    const cityLower = city.toLowerCase();
    allListings = allListings.filter((l) =>
      l.city?.toLowerCase() === cityLower
    );
  }

  // Filter fresh only: exclude expired listings
  if (freshOnly) {
    allListings = allListings.filter((l) => new Date(l.expiresAt).getTime() > NOW);
  }

  // Filter by dietary tags (comma-separated, AND logic)
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
  const db = getRawDb();

  const now = new Date().toISOString();
  const expiresAt = body.expiresAt || new Date(Date.now() + 86400000).toISOString();

  const result = db.prepare(
    `INSERT INTO listings (vendor_id, title, description, category_slug, category_icon, vendor_name, price, quantity, photo_url, dietary_tags, post_type, posted_at, expires_at, pickup_window_start, pickup_window_end, ingredients, allergen_warning, is_active, state, city, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
  ).run(
    body.vendorId,
    body.title || "",
    body.description || "",
    body.categorySlug || "other",
    body.categoryIcon || "📦",
    body.vendorName || null,
    body.price || null,
    body.quantity || null,
    body.photoUrl || null,
    Array.isArray(body.dietaryTags) ? JSON.stringify(body.dietaryTags) : (body.dietaryTags || "[]"),
    body.postType || "available_now",
    now,
    expiresAt,
    body.pickupWindowStart || now,
    body.pickupWindowEnd || expiresAt,
    body.ingredients || null,
    body.allergenWarning || null,
    body.state || "",
    body.city || "",
    now
  );

  const listing = {
    id: Number(result.lastInsertRowid),
    vendorId: body.vendorId,
    title: body.title || "",
    description: body.description || "",
    price: body.price || null,
    quantity: body.quantity || null,
    photoUrl: body.photoUrl || null,
    dietaryTags: Array.isArray(body.dietaryTags) ? JSON.stringify(body.dietaryTags) : (body.dietaryTags || "[]"),
    postType: body.postType || "available_now",
    postedAt: now,
    expiresAt,
    pickupWindowStart: body.pickupWindowStart || now,
    pickupWindowEnd: body.pickupWindowEnd || expiresAt,
    ingredients: body.ingredients || null,
    allergenWarning: body.allergenWarning || null,
    isActive: true,
    createdAt: now,
    city: body.city || "",
    state: body.state || "",
  };

  return NextResponse.json({ listing }, { status: 201 });
}
