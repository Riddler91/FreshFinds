import { NextRequest, NextResponse } from "next/server";

// ── Import the same shared mock data from the listings route ────────────
// We can't import directly (Next.js route isolation), so we duplicate
// the vendor mock data and listing mock data here for search.
const NOW = Date.now();

const MOCK_VENDORS = [
  { id: 1, businessName: "ATX Sourdough", lat: 30.2615, lng: -97.732, address: "1200 E 6th St, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=600&q=80", categoryName: "Bread & Pastries", categorySlug: "bread-pastries", categoryIcon: "🥖", rating: 4.7, reviewCount: 12, listingCount: 3, hasFreshItems: true, bio: "Hand-crafted sourdough bread using a 100-year-old starter. Baked fresh daily in East Austin." },
  { id: 2, businessName: "Eastside Eggs", lat: 30.2548, lng: -97.7089, address: "2400 Webberville Rd, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=600&q=80", categoryName: "Eggs & Dairy", categorySlug: "eggs-dairy", categoryIcon: "🥚", rating: 4.9, reviewCount: 8, listingCount: 2, hasFreshItems: true, bio: "Free-range eggs from happy hens raised right here in East Austin." },
  { id: 3, businessName: "Hill Country Honey", lat: 30.2477, lng: -97.9284, address: "8901 TX-71, Austin, TX 78735", photoUrl: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80", categoryName: "Honey & Preserves", categorySlug: "honey-preserves", categoryIcon: "🍯", rating: 4.5, reviewCount: 5, listingCount: 3, hasFreshItems: false, bio: "Raw, unfiltered honey from our hives in the Texas Hill Country." },
  { id: 4, businessName: "Texas Pie Company", lat: 30.2351, lng: -97.7892, address: "4200 S Lamar Blvd, Austin, TX 78704", photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=600&q=80", categoryName: "Desserts & Sweets", categorySlug: "desserts", categoryIcon: "🥧", rating: 4.8, reviewCount: 15, listingCount: 2, hasFreshItems: true, bio: "Award-winning pies made from scratch with Texas pecans, seasonal fruits, and lots of love." },
  { id: 5, businessName: "Sunset Farms Produce", lat: 30.4015, lng: -97.7207, address: "11501 Rock Rose Ave, Austin, TX 78758", photoUrl: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=600&q=80", categoryName: "Fresh Produce", categorySlug: "produce", categoryIcon: "🌽", rating: 4.6, reviewCount: 9, listingCount: 3, hasFreshItems: true, bio: "Family-run organic vegetable farm in North Austin. Seasonal produce grown without pesticides." },
  { id: 6, businessName: "Flower Child Farms", lat: 30.2819, lng: -97.7265, address: "1500 Manor Rd, Austin, TX 78722", photoUrl: "https://images.unsplash.com/photo-1561181286-d5ef733c1a54?w=600&q=80", categoryName: "Flowers & Plants", categorySlug: "flowers", categoryIcon: "🌼", rating: 4.4, reviewCount: 3, listingCount: 1, hasFreshItems: true, bio: "Fresh-cut flower bouquets and potted herbs from our urban micro-farm." },
  { id: 7, businessName: "Taco Tones", lat: 30.2452, lng: -97.7563, address: "1700 S Congress Ave, Austin, TX 78704", photoUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80", categoryName: "Food Truck", categorySlug: "food-truck", categoryIcon: "🚚", rating: 4.3, reviewCount: 22, listingCount: 4, hasFreshItems: true, bio: "Breakfast tacos and street food — find us at different spots around South Congress." },
  { id: 8, businessName: "Mama Lu's Kitchen", lat: 30.3340, lng: -97.7020, address: "8500 Research Blvd, Austin, TX 78758", photoUrl: "https://images.unsplash.com/photo-1576866209830-954e6bf8d5e2?w=600&q=80", categoryName: "Meals & Prepared", categorySlug: "meals", categoryIcon: "🍽️", rating: 4.9, reviewCount: 18, listingCount: 2, hasFreshItems: false, bio: "Homemade comfort food — lasagna, enchiladas, and meal prep boxes." },
  { id: 9, businessName: "Bee Sweet Bakery", lat: 30.3075, lng: -97.7378, address: "4500 Duval St, Austin, TX 78751", photoUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80", categoryName: "Desserts & Sweets", categorySlug: "desserts", categoryIcon: "🥧", rating: 4.6, reviewCount: 7, listingCount: 1, hasFreshItems: true, bio: "Vegan and gluten-free cupcakes, cookies, and celebration cakes." },
  { id: 10, businessName: "Green Gate Growers", lat: 30.2280, lng: -97.8100, address: "6100 W Highway 290, Austin, TX 78735", photoUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80", categoryName: "Fresh Produce", categorySlug: "produce", categoryIcon: "🌽", rating: 4.2, reviewCount: 4, listingCount: 2, hasFreshItems: false, bio: "Microgreens, sprouts, and hydroponic lettuces grown year-round." },
];

function minsAgo(m: number) { return new Date(NOW - m * 60000).toISOString(); }
function hoursAgo(h: number) { return new Date(NOW - h * 3600000).toISOString(); }
function expireAfter(postedAtIso: string): string {
  return new Date(new Date(postedAtIso).getTime() + 24 * 3600000).toISOString();
}

const MOCK_LISTINGS = [
  { id: 1, title: "Classic Country Loaf", description: "Our signature sourdough — tangy, chewy, with a crackling crust. 800g loaf.", price: 8.5, quantity: 6, photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", dietaryTags: '["vegetarian","vegan"]', vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖", postType: "baked_today", postedAt: minsAgo(25), expiresAt: expireAfter(minsAgo(25)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 2, title: "Cinnamon Raisin Swirl", description: "Sourdough with organic cinnamon and plump California raisins.", price: 10.0, quantity: 4, photoUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400", dietaryTags: '["vegetarian"]', vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖", postType: "baked_today", postedAt: hoursAgo(1.5), expiresAt: expireAfter(hoursAgo(1.5)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 3, title: "Everything Bagel Sourdough", description: "Limited batch — sourdough rolled in house-made everything seasoning.", price: 9.5, quantity: 2, photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=400", dietaryTags: '["vegetarian"]', vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖", postType: "limited_batch", postedAt: hoursAgo(3), expiresAt: expireAfter(hoursAgo(3)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 4, title: "Farm Fresh Dozen", description: "One dozen free-range eggs from pastured hens. Rich orange yolks.", price: 7.0, quantity: 20, photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", dietaryTags: '["vegetarian","gluten-free"]', vendorName: "Eastside Eggs", vendorId: 2, categoryIcon: "🥚", postType: "available_now", postedAt: minsAgo(15), expiresAt: expireAfter(minsAgo(15)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 5, title: "Half Dozen + Herbs", description: "6 eggs plus a bundle of fresh kitchen herbs from our garden.", price: 6.0, quantity: 10, photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=400", dietaryTags: '["vegetarian","gluten-free"]', vendorName: "Eastside Eggs", vendorId: 2, categoryIcon: "🥚", postType: "available_now", postedAt: hoursAgo(2), expiresAt: expireAfter(hoursAgo(2)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 6, title: "Wildflower Honey — 16oz", description: "Raw, unfiltered wildflower honey from spring blooms. Light, floral, never heated.", price: 14.0, quantity: 15, photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", dietaryTags: '["gluten-free"]', vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯", postType: "available_now", postedAt: hoursAgo(5), expiresAt: expireAfter(hoursAgo(5)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 7, title: "Mesquite Honey — 8oz", description: "Dark, bold honey from mesquite blossoms. Smoky-sweet, perfect for BBQ glaze.", price: 10.0, quantity: 8, photoUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400", dietaryTags: '["gluten-free"]', vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯", postType: "available_now", postedAt: hoursAgo(8), expiresAt: expireAfter(hoursAgo(8)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 9, title: "Texas Pecan Pie", description: "Our blue-ribbon pecan pie with Texas pecans in a buttery, flaky crust. 9-inch.", price: 28.0, quantity: 3, photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", dietaryTags: '["vegetarian"]', vendorName: "Texas Pie Company", vendorId: 4, categoryIcon: "🥧", postType: "just_made", postedAt: minsAgo(45), expiresAt: expireAfter(minsAgo(45)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 10, title: "Seasonal Fruit Pie", description: "Summer peach and berry pie with a lattice top. Made with Fredericksburg peaches.", price: 26.0, quantity: 2, photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=400", dietaryTags: '["vegetarian"]', vendorName: "Texas Pie Company", vendorId: 4, categoryIcon: "🥧", postType: "just_made", postedAt: hoursAgo(6), expiresAt: expireAfter(hoursAgo(6)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 11, title: "Weekly Veggie Box", description: "A curated box of seasonal organic vegetables — tomatoes, zucchini, basil, bell peppers, and salad greens.", price: 25.0, quantity: 8, photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🌽", postType: "harvested_today", postedAt: minsAgo(10), expiresAt: expireAfter(minsAgo(10)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 12, title: "Heirloom Tomato Basket", description: "5 lbs of mixed heirloom tomatoes — Cherokee Purple, Brandywine, Sun Gold cherries.", price: 15.0, quantity: 5, photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🌽", postType: "harvested_today", postedAt: hoursAgo(4), expiresAt: expireAfter(hoursAgo(4)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 13, title: "Herb Bundle", description: "Fresh-cut basil, cilantro, rosemary, and mint from our garden.", price: 6.0, quantity: 12, photoUrl: "https://images.unsplash.com/photo-1600852659773-7e5a02b35c5a?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🌽", postType: "harvested_today", postedAt: hoursAgo(12), expiresAt: expireAfter(hoursAgo(12)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 14, title: "Spring Bouquet", description: "A hand-tied bouquet of seasonal blooms from our farm.", price: 18.0, quantity: 4, photoUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400", dietaryTags: '[]', vendorName: "Flower Child Farms", vendorId: 6, categoryIcon: "🌼", postType: "available_now", postedAt: minsAgo(30), expiresAt: expireAfter(minsAgo(30)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 15, title: "Migas Taco Plate", description: "3 migas tacos with chips and salsa — the Austin classic.", price: 9.5, quantity: 10, photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", dietaryTags: '["vegetarian"]', vendorName: "Taco Tones", vendorId: 7, categoryIcon: "🚚", postType: "available_now", postedAt: hoursAgo(1), expiresAt: expireAfter(hoursAgo(1)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 16, title: "Family Lasagna", description: "A full tray of classic meat lasagna — feeds 6.", price: 32.0, quantity: 1, photoUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", dietaryTags: '[]', vendorName: "Mama Lu's Kitchen", vendorId: 8, categoryIcon: "🍽️", postType: "available_now", postedAt: hoursAgo(26), expiresAt: expireAfter(hoursAgo(26)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 17, title: "Vegan Cupcake Box (6)", description: "Assorted vegan cupcakes — chocolate, vanilla, and red velvet.", price: 22.0, quantity: 3, photoUrl: "https://images.unsplash.com/photo-1558301211-7099e59b9c58?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Bee Sweet Bakery", vendorId: 9, categoryIcon: "🥧", postType: "just_made", postedAt: hoursAgo(3.5), expiresAt: expireAfter(hoursAgo(3.5)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
  { id: 18, title: "Microgreens Sampler", description: "3 trays of sunflower, pea shoots, and radish microgreens.", price: 15.0, quantity: 5, photoUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Green Gate Growers", vendorId: 10, categoryIcon: "🌽", postType: "harvested_today", postedAt: hoursAgo(22), expiresAt: expireAfter(hoursAgo(22)), pickupWindowStart: minsAgo(-300), pickupWindowEnd: minsAgo(-60) },
];

function parseDietaryTags(tags: string | null): string[] {
  if (!tags) return [];
  try { return JSON.parse(tags); } catch { return []; }
}

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
  const dynListings = (store?.listings || []).filter((l: any) => l.isActive !== false).map((l: any) => ({
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
  }));

  const allVendors = [...MOCK_VENDORS, ...dynVendors.map((v: any) => ({
    id: v.id, businessName: v.businessName, lat: v.lat, lng: v.lng,
    address: v.address, photoUrl: v.photoUrl || null, categoryName: v.categoryName,
    categorySlug: v.categorySlug, categoryIcon: v.categoryIcon,
    rating: 5.0, reviewCount: 0, listingCount: 0, hasFreshItems: false,
    bio: v.bio || null,
  }))];
  const allListings = [...MOCK_LISTINGS, ...dynListings];

  // Search vendors: match on name, bio, category
  const matchedVendors = allVendors.filter((v) => {
    return (
      matchesQuery(v.businessName, q) ||
      (v.bio && matchesQuery(v.bio, q)) ||
      matchesQuery(v.categoryName, q)
    );
  });

  // Search listings: match on title, description, dietary tags
  const matchedListings = allListings.filter((l) => {
    const dietary = parseDietaryTags(l.dietaryTags).join(" ");
    return (
      matchesQuery(l.title, q) ||
      matchesQuery(l.description, q) ||
      matchesQuery(dietary, q) ||
      matchesQuery(l.vendorName, q)
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
