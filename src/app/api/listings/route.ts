import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// ── Compute relative postedAt for mock data ──────────────────────────
const NOW = Date.now();
function minsAgo(m: number) { return new Date(NOW - m * 60000).toISOString(); }
function hoursAgo(h: number) { return new Date(NOW - h * 3600000).toISOString(); }
function pickupToday(hour: number): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}
const EXPIRY_HOURS = 24;

function expireAfter(postedAtIso: string): string {
  return new Date(new Date(postedAtIso).getTime() + EXPIRY_HOURS * 3600000).toISOString();
}

// ── Category slug mapping ─────────────────────────────────────────────
const VENDOR_CATEGORY_MAP: Record<number, string> = {
  1: "bread-pastries",
  2: "eggs-dairy",
  3: "honey-preserves",
  4: "desserts",
  5: "produce",
  6: "flowers",
  7: "food-truck",
  8: "meals",
  9: "desserts",
  10: "produce",
};

// ── Shared mock data ─────────────────────────────────────────────────
const MOCK_LISTINGS = [
  {
    id: 1, title: "Classic Country Loaf",
    description: "Our signature sourdough — tangy, chewy, with a crackling crust. 800g loaf.",
    price: 8.5, quantity: 6,
    photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    dietaryTags: '["vegetarian","vegan"]',
    vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖",
    categorySlug: "bread-pastries",
    postType: "baked_today",
    postedAt: minsAgo(25),
    pickupWindowStart: pickupToday(7),
    pickupWindowEnd: pickupToday(14),
  },
  {
    id: 2, title: "Cinnamon Raisin Swirl",
    description: "Sourdough with organic cinnamon and plump California raisins. Perfect for toasting.",
    price: 10.0, quantity: 4,
    photoUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400",
    dietaryTags: '["vegetarian"]',
    vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖",
    categorySlug: "bread-pastries",
    postType: "baked_today",
    postedAt: hoursAgo(1.5),
    pickupWindowStart: pickupToday(7),
    pickupWindowEnd: pickupToday(14),
  },
  {
    id: 3, title: "Everything Bagel Sourdough",
    description: "Limited batch — sourdough rolled in house-made everything seasoning.",
    price: 9.5, quantity: 2,
    photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=400",
    dietaryTags: '["vegetarian"]',
    vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖",
    categorySlug: "bread-pastries",
    postType: "limited_batch",
    postedAt: hoursAgo(3),
    pickupWindowStart: pickupToday(7),
    pickupWindowEnd: pickupToday(14),
  },
  {
    id: 4, title: "Farm Fresh Dozen",
    description: "One dozen free-range eggs from pastured hens. Rich orange yolks.",
    price: 7.0, quantity: 20,
    photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
    dietaryTags: '["vegetarian","gluten-free"]',
    vendorName: "Eastside Eggs", vendorId: 2, categoryIcon: "🥚",
    categorySlug: "eggs-dairy",
    postType: "available_now",
    postedAt: minsAgo(15),
    pickupWindowStart: pickupToday(8),
    pickupWindowEnd: pickupToday(18),
  },
  {
    id: 5, title: "Half Dozen + Herbs",
    description: "6 eggs plus a bundle of fresh kitchen herbs from our garden.",
    price: 6.0, quantity: 10,
    photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=400",
    dietaryTags: '["vegetarian","gluten-free"]',
    vendorName: "Eastside Eggs", vendorId: 2, categoryIcon: "🥚",
    categorySlug: "eggs-dairy",
    postType: "available_now",
    postedAt: hoursAgo(2),
    pickupWindowStart: pickupToday(8),
    pickupWindowEnd: pickupToday(18),
  },
  {
    id: 6, title: "Wildflower Honey — 16oz",
    description: "Raw, unfiltered wildflower honey from spring blooms. Light, floral, never heated.",
    price: 14.0, quantity: 15,
    photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    dietaryTags: '["gluten-free"]',
    vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯",
    categorySlug: "honey-preserves",
    postType: "available_now",
    postedAt: hoursAgo(5),
    pickupWindowStart: pickupToday(9),
    pickupWindowEnd: pickupToday(17),
  },
  {
    id: 7, title: "Mesquite Honey — 8oz",
    description: "Dark, bold honey from mesquite blossoms. Smoky-sweet, perfect for BBQ glaze.",
    price: 10.0, quantity: 8,
    photoUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400",
    dietaryTags: '["gluten-free"]',
    vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯",
    categorySlug: "honey-preserves",
    postType: "available_now",
    postedAt: hoursAgo(8),
    pickupWindowStart: pickupToday(9),
    pickupWindowEnd: pickupToday(17),
  },
  {
    id: 8, title: "Honeycomb Square",
    description: "A square of raw honeycomb — wax and honey together. Amazing on cheese boards.",
    price: 8.0, quantity: 3,
    photoUrl: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400",
    dietaryTags: '["gluten-free"]',
    vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯",
    categorySlug: "honey-preserves",
    postType: "available_now",
    postedAt: hoursAgo(28),
    pickupWindowStart: pickupToday(9),
    pickupWindowEnd: pickupToday(17),
  },
  {
    id: 9, title: "Texas Pecan Pie",
    description: "Our blue-ribbon pecan pie with Texas pecans in a buttery, flaky crust. 9-inch.",
    price: 28.0, quantity: 3,
    photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400",
    dietaryTags: '["vegetarian"]',
    vendorName: "Texas Pie Company", vendorId: 4, categoryIcon: "🧁",
    categorySlug: "desserts",
    postType: "just_made",
    postedAt: minsAgo(45),
    pickupWindowStart: pickupToday(10),
    pickupWindowEnd: pickupToday(17),
  },
  {
    id: 10, title: "Seasonal Fruit Pie",
    description: "Summer peach and berry pie with a lattice top. Made with Fredericksburg peaches.",
    price: 26.0, quantity: 2,
    photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=400",
    dietaryTags: '["vegetarian"]',
    vendorName: "Texas Pie Company", vendorId: 4, categoryIcon: "🧁",
    categorySlug: "desserts",
    postType: "just_made",
    postedAt: hoursAgo(6),
    pickupWindowStart: pickupToday(10),
    pickupWindowEnd: pickupToday(17),
  },
  {
    id: 11, title: "Weekly Veggie Box",
    description: "A curated box of seasonal organic vegetables — tomatoes, zucchini, basil, bell peppers, and salad greens.",
    price: 25.0, quantity: 8,
    photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    dietaryTags: '["vegan","gluten-free","organic"]',
    vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🥬",
    categorySlug: "produce",
    postType: "harvested_today",
    postedAt: minsAgo(10),
    pickupWindowStart: pickupToday(8),
    pickupWindowEnd: pickupToday(19),
  },
  {
    id: 12, title: "Heirloom Tomato Basket",
    description: "5 lbs of mixed heirloom tomatoes — Cherokee Purple, Brandywine, Sun Gold cherries.",
    price: 15.0, quantity: 5,
    photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    dietaryTags: '["vegan","gluten-free","organic"]',
    vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🥬",
    categorySlug: "produce",
    postType: "harvested_today",
    postedAt: hoursAgo(4),
    pickupWindowStart: pickupToday(8),
    pickupWindowEnd: pickupToday(19),
  },
  {
    id: 13, title: "Herb Bundle",
    description: "Fresh-cut basil, cilantro, rosemary, and mint from our garden.",
    price: 6.0, quantity: 12,
    photoUrl: "https://images.unsplash.com/photo-1600852659773-7e5a02b35c5a?w=400",
    dietaryTags: '["vegan","gluten-free","organic"]',
    vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🌽",
    categorySlug: "produce",
    postType: "harvested_today",
    postedAt: hoursAgo(12),
    pickupWindowStart: pickupToday(8),
    pickupWindowEnd: pickupToday(19),
  },
  {
    id: 14, title: "Spring Bouquet",
    description: "A hand-tied bouquet of seasonal blooms from our farm.",
    price: 18.0, quantity: 4,
    photoUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400",
    dietaryTags: '[]',
    vendorName: "Flower Child Farms", vendorId: 6, categoryIcon: "🌼",
    categorySlug: "flowers",
    postType: "available_now",
    postedAt: minsAgo(30),
    pickupWindowStart: pickupToday(9),
    pickupWindowEnd: pickupToday(16),
  },
  {
    id: 15, title: "Migas Taco Plate",
    description: "3 migas tacos with chips and salsa — the Austin classic.",
    price: 9.5, quantity: 10,
    photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    dietaryTags: '["vegetarian"]',
    vendorName: "Taco Tones", vendorId: 7, categoryIcon: "🚚",
    categorySlug: "food-truck",
    postType: "available_now",
    postedAt: hoursAgo(1),
    pickupWindowStart: pickupToday(7),
    pickupWindowEnd: pickupToday(14),
  },
  {
    id: 16, title: "Family Lasagna",
    description: "A full tray of classic meat lasagna — feeds 6.",
    price: 32.0, quantity: 1,
    photoUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
    dietaryTags: '[]',
    vendorName: "Mama Lu's Kitchen", vendorId: 8, categoryIcon: "🍽️",
    categorySlug: "meals",
    postType: "available_now",
    postedAt: hoursAgo(26),
    pickupWindowStart: pickupToday(12),
    pickupWindowEnd: pickupToday(20),
  },
  {
    id: 17, title: "Vegan Cupcake Box (6)",
    description: "Assorted vegan cupcakes — chocolate, vanilla, and red velvet.",
    price: 22.0, quantity: 3,
    photoUrl: "https://images.unsplash.com/photo-1558301211-7099e59b9c58?w=400",
    dietaryTags: '["vegan","gluten-free"]',
    vendorName: "Bee Sweet Bakery", vendorId: 9, categoryIcon: "🥧",
    categorySlug: "desserts",
    postType: "just_made",
    postedAt: hoursAgo(3.5),
    pickupWindowStart: pickupToday(11),
    pickupWindowEnd: pickupToday(17),
  },
  {
    id: 18, title: "Microgreens Sampler",
    description: "3 trays of sunflower, pea shoots, and radish microgreens.",
    price: 15.0, quantity: 5,
    photoUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400",
    dietaryTags: '["vegan","gluten-free","keto","organic"]',
    vendorName: "Green Gate Growers", vendorId: 10, categoryIcon: "🌽",
    categorySlug: "produce",
    postType: "harvested_today",
    postedAt: hoursAgo(22),
    pickupWindowStart: pickupToday(10),
    pickupWindowEnd: pickupToday(15),
  },
];

// Attach expiresAt to all mock listings
const LISTINGS_WITH_EXPIRY = MOCK_LISTINGS.map((l) => ({
  ...l,
  expiresAt: expireAfter(l.postedAt),
}));

// ── Post type metadata ───────────────────────────────────────────────
const POST_TYPE_META: Record<string, { emoji: string; label: string }> = {
  baked_today: { emoji: "🥖", label: "Baked fresh this morning" },
  harvested_today: { emoji: "🌽", label: "Picked this morning" },
  just_made: { emoji: "🍪", label: "Cooling on the rack right now" },
  limited_batch: { emoji: "✨", label: "Small batch — limited availability" },
  available_now: { emoji: "🛒", label: "Ready for pickup now" },
};

function parseDietaryTags(tags: string | null): string[] {
  if (!tags) return [];
  try { return JSON.parse(tags); } catch { return []; }
}

// ── GET ──────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const freshOnly = searchParams.get("fresh") === "true";
  const dietary = searchParams.get("dietary");
  const category = searchParams.get("category");

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
          };
        })
    : [];

  let allListings = [...LISTINGS_WITH_EXPIRY, ...dynListings];

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

// ── POST ─────────────────────────────────────────────────────────────
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
  };

  store.listings.push(listing);

  return NextResponse.json({ listing }, { status: 201 });
}
