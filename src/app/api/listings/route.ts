import { NextRequest, NextResponse } from "next/server";

// ── Shared mock data (kept in sync with vendors route for GET) ──
const MOCK_LISTINGS = [
  { id: 1, title: "Classic Country Loaf", description: "Our signature sourdough — tangy, chewy, with a crackling crust. 800g loaf.", price: 8.5, photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", dietaryTags: '["vegetarian","vegan"]', vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖" },
  { id: 2, title: "Cinnamon Raisin Swirl", description: "Sourdough with organic cinnamon and plump California raisins. Perfect for toasting.", price: 10.0, photoUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400", dietaryTags: '["vegetarian"]', vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖" },
  { id: 3, title: "Everything Bagel Sourdough", description: "Limited batch — sourdough rolled in house-made everything seasoning.", price: 9.5, photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=400", dietaryTags: '["vegetarian"]', vendorName: "ATX Sourdough", vendorId: 1, categoryIcon: "🥖" },
  { id: 4, title: "Farm Fresh Dozen", description: "One dozen free-range eggs from pastured hens. Rich orange yolks.", price: 7.0, photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", dietaryTags: '["vegetarian","gluten-free"]', vendorName: "Eastside Eggs", vendorId: 2, categoryIcon: "🥚" },
  { id: 5, title: "Half Dozen + Herbs", description: "6 eggs plus a bundle of fresh kitchen herbs from our garden.", price: 6.0, photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=400", dietaryTags: '["vegetarian","gluten-free"]', vendorName: "Eastside Eggs", vendorId: 2, categoryIcon: "🥚" },
  { id: 6, title: "Wildflower Honey — 16oz", description: "Raw, unfiltered wildflower honey from spring blooms. Light, floral, never heated.", price: 14.0, photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", dietaryTags: '["gluten-free"]', vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯" },
  { id: 7, title: "Mesquite Honey — 8oz", description: "Dark, bold honey from mesquite blossoms. Smoky-sweet, perfect for BBQ glaze.", price: 10.0, photoUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400", dietaryTags: '["gluten-free"]', vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯" },
  { id: 8, title: "Honeycomb Square", description: "A square of raw honeycomb — wax and honey together. Amazing on cheese boards.", price: 8.0, photoUrl: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400", dietaryTags: '["gluten-free"]', vendorName: "Hill Country Honey", vendorId: 3, categoryIcon: "🍯" },
  { id: 9, title: "Texas Pecan Pie", description: "Our blue-ribbon pecan pie with Texas pecans in a buttery, flaky crust. 9-inch.", price: 28.0, photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", dietaryTags: '["vegetarian"]', vendorName: "Texas Pie Company", vendorId: 4, categoryIcon: "🧁" },
  { id: 10, title: "Seasonal Fruit Pie", description: "Summer peach and berry pie with a lattice top. Made with Fredericksburg peaches.", price: 26.0, photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=400", dietaryTags: '["vegetarian"]', vendorName: "Texas Pie Company", vendorId: 4, categoryIcon: "🧁" },
  { id: 11, title: "Weekly Veggie Box", description: "A curated box of seasonal organic vegetables — tomatoes, zucchini, basil, bell peppers, and salad greens.", price: 25.0, photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🥬" },
  { id: 12, title: "Heirloom Tomato Basket", description: "5 lbs of mixed heirloom tomatoes — Cherokee Purple, Brandywine, Sun Gold cherries.", price: 15.0, photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🥬" },
  { id: 13, title: "Herb Bundle", description: "Fresh-cut basil, cilantro, rosemary, and mint from our garden.", price: 6.0, photoUrl: "https://images.unsplash.com/photo-1600852659773-7e5a02b35c5a?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Sunset Farms Produce", vendorId: 5, categoryIcon: "🌽" },
  { id: 14, title: "Spring Bouquet", description: "A hand-tied bouquet of seasonal blooms from our farm.", price: 18.0, photoUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400", dietaryTags: '[]', vendorName: "Flower Child Farms", vendorId: 6, categoryIcon: "🌼" },
  { id: 15, title: "Migas Taco Plate", description: "3 migas tacos with chips and salsa — the Austin classic.", price: 9.5, photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", dietaryTags: '["vegetarian"]', vendorName: "Taco Tones", vendorId: 7, categoryIcon: "🚚" },
  { id: 16, title: "Family Lasagna", description: "A full tray of classic meat lasagna — feeds 6.", price: 32.0, photoUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", dietaryTags: '[]', vendorName: "Mama Lu's Kitchen", vendorId: 8, categoryIcon: "🍽️" },
  { id: 17, title: "Vegan Cupcake Box (6)", description: "Assorted vegan cupcakes — chocolate, vanilla, and red velvet.", price: 22.0, photoUrl: "https://images.unsplash.com/photo-1558301211-7099e59b9c58?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Bee Sweet Bakery", vendorId: 9, categoryIcon: "🥧" },
  { id: 18, title: "Microgreens Sampler", description: "3 trays of sunflower, pea shoots, and radish microgreens.", price: 15.0, photoUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400", dietaryTags: '["vegan","gluten-free"]', vendorName: "Green Gate Growers", vendorId: 10, categoryIcon: "🌽" },
];

export async function GET() {
  // Merge mock + dynamically created listings from in-memory store
  const store = globalThis.__freshfinds_store;
  const dynListings = store
    ? store.listings
        .filter((l: any) => l.isActive !== false)
        .map((l: any) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          price: l.price,
          photoUrl: l.photoUrl || null,
          dietaryTags: l.dietaryTags || "[]",
          vendorName: "New Vendor",
          vendorId: l.vendorId,
          categoryIcon: "📦",
        }))
    : [];

  return NextResponse.json({ listings: [...MOCK_LISTINGS, ...dynListings] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!globalThis.__freshfinds_store) {
    return NextResponse.json({ error: "Store not initialized. Create a vendor first." }, { status: 400 });
  }

  const store = globalThis.__freshfinds_store;
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
