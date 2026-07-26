import { NextRequest, NextResponse } from "next/server";
import { haversineMi } from "@/lib/haversine";
import { getRawDb } from "@/db";
import { expireAfter } from "@/lib/data";

// ── GET ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get("id");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");
  const city = searchParams.get("city");
  const state = searchParams.get("state");

  const db = getRawDb();

  // Single vendor lookup
  if (vendorId) {
    const vendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(parseInt(vendorId)) as any;
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const vendorListings = db.prepare(
      "SELECT * FROM listings WHERE vendor_id = ? AND is_active = 1"
    ).all(parseInt(vendorId)) as any[];

    const vendorReviews = db.prepare(
      "SELECT * FROM reviews WHERE vendor_id = ?"
    ).all(parseInt(vendorId)) as any[];

    const avgRating = vendorReviews.length > 0
      ? vendorReviews.reduce((s, r) => s + r.rating, 0) / vendorReviews.length
      : 5.0;

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        businessName: vendor.business_name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        lat: vendor.lat,
        lng: vendor.lng,
        bio: vendor.bio,
        photoUrl: vendor.photo_url,
        verified: !!vendor.verified,
        acceptsMessages: !!vendor.accepts_messages,
        categoryName: vendor.category_name,
        categorySlug: vendor.category_slug,
        categoryIcon: vendor.category_icon,
        website: vendor.website,
        socialLinks: vendor.social_links,
        state: vendor.state,
        city: vendor.city,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: vendorReviews.length,
        listingCount: vendorListings.length,
        hasFreshItems: vendorListings.some((l: any) => {
          const start = new Date(l.pickup_window_start).getTime();
          return start <= Date.now() + 86400000;
        }),
        createdAt: vendor.created_at,
      },
      listings: vendorListings.map((l: any) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        price: l.price,
        quantity: l.quantity,
        photoUrl: l.photo_url,
        dietaryTags: l.dietary_tags || "[]",
        vendorName: l.vendor_name,
        vendorId: l.vendor_id,
        categoryIcon: l.category_icon,
        categorySlug: l.category_slug,
        postType: l.post_type,
        postedAt: l.posted_at,
        expiresAt: l.expires_at,
        pickupWindowStart: l.pickup_window_start,
        pickupWindowEnd: l.pickup_window_end,
        ingredients: l.ingredients,
        allergenWarning: l.allergen_warning,
        isFresh: new Date(l.pickup_window_start).getTime() <= Date.now() + 86400000,
        createdAt: l.created_at,
      })),
      reviews: vendorReviews.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      })),
    });
  }

  // List all vendors for map
  const vendors = db.prepare("SELECT * FROM vendors").all() as any[];
  const allListings = db.prepare("SELECT * FROM listings WHERE is_active = 1").all() as any[];

  let allVendors = vendors.map((v: any) => {
    const vListings = allListings.filter((l: any) => l.vendor_id === v.id);
    return {
      id: v.id,
      businessName: v.business_name,
      acceptsMessages: !!v.accepts_messages,
      lat: v.lat,
      lng: v.lng,
      address: v.address,
      photoUrl: v.photo_url || null,
      categoryName: v.category_name,
      categorySlug: v.category_slug,
      categoryIcon: v.category_icon,
      rating: 5.0,
      reviewCount: 0,
      listingCount: vListings.length,
      hasFreshItems: vListings.some((l: any) =>
        new Date(l.pickup_window_start).getTime() <= Date.now() + 86400000
      ),
      bio: v.bio || null,
      state: v.state || "",
      city: v.city || "",
    };
  });

  // City filtering
  if (city) {
    const cityLower = city.toLowerCase();
    allVendors = allVendors.filter((v) =>
      v.city?.toLowerCase() === cityLower
    );
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
  const db = getRawDb();

  const now = new Date().toISOString();

  const result = db.prepare(
    `INSERT INTO vendors (name, business_name, email, phone, address, lat, lng, bio, photo_url, verified, category_name, category_slug, category_icon, website, social_links, state, city, accepts_messages, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    body.name || "",
    body.businessName || "",
    body.email || "",
    body.phone || "",
    body.address || "",
    body.lat || 30.2672,
    body.lng || -97.7431,
    body.bio || "",
    body.photoUrl || "",
    body.categoryName || "Other",
    body.categorySlug || "other",
    body.categoryIcon || "📦",
    body.website || "",
    body.socialLinks || "",
    body.state || "TX",
    body.city || "Austin",
    body.acceptsMessages ? 1 : 0,
    now
  );

  const vendor = {
    id: Number(result.lastInsertRowid),
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
    acceptsMessages: !!body.acceptsMessages,
    categoryName: body.categoryName || "Other",
    categorySlug: body.categorySlug || "other",
    categoryIcon: body.categoryIcon || "📦",
    website: body.website || "",
    socialLinks: body.socialLinks || "",
    state: body.state || "TX",
    city: body.city || "Austin",
    createdAt: now,
  };

  return NextResponse.json({ vendor }, { status: 201 });
}
