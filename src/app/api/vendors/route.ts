import { NextRequest, NextResponse } from "next/server";

// ── In-memory store for dynamically created vendors/listings ──────────
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
  createdAt: string;
}

interface ListingRecord {
  id: number;
  vendorId: number;
  title: string;
  description: string;
  price?: number;
  quantity?: number;
  photoUrl?: string;
  dietaryTags?: string; // JSON array
  pickupWindowStart: string;
  pickupWindowEnd: string;
  ingredients?: string;
  allergenWarning?: string;
  isActive: boolean;
  createdAt: string;
}

interface ReviewRecord {
  id: number;
  vendorId: number;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

declare global {
  var __freshfinds_store: {
    vendors: VendorRecord[];
    listings: ListingRecord[];
    reviews: ReviewRecord[];
    nextVendorId: number;
    nextListingId: number;
    nextReviewId: number;
  } | undefined;
}

function getStore() {
  if (!globalThis.__freshfinds_store) {
    globalThis.__freshfinds_store = {
      vendors: [],
      listings: [],
      reviews: [],
      nextVendorId: 100,
      nextListingId: 200,
      nextReviewId: 300,
    };
  }
  return globalThis.__freshfinds_store;
}

// ── Seed mock data ─────────────────────────────────────────────────────
const MOCK_VENDORS = [
  { id: 1, businessName: "ATX Sourdough", lat: 30.2615, lng: -97.732, address: "1200 E 6th St, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", categoryName: "Bread & Pastries", categorySlug: "bread-pastries", categoryIcon: "🥖", rating: 4.7, reviewCount: 12, listingCount: 3, hasFreshItems: true, bio: "Hand-crafted sourdough bread using a 100-year-old starter. Baked fresh daily in East Austin.", verified: true, name: "Maria Rodriguez" },
  { id: 2, businessName: "Eastside Eggs", lat: 30.2548, lng: -97.7089, address: "2400 Webberville Rd, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", categoryName: "Eggs & Dairy", categorySlug: "eggs-dairy", categoryIcon: "🥚", rating: 4.9, reviewCount: 8, listingCount: 2, hasFreshItems: true, bio: "Free-range eggs from happy hens raised right here in East Austin. Farm-fresh daily.", verified: true, name: "James & Lisa Chen" },
  { id: 3, businessName: "Hill Country Honey", lat: 30.2477, lng: -97.9284, address: "8901 TX-71, Austin, TX 78735", photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", categoryName: "Honey & Preserves", categorySlug: "honey-preserves", categoryIcon: "🍯", rating: 4.5, reviewCount: 5, listingCount: 3, hasFreshItems: false, bio: "Raw, unfiltered honey from our hives in the Texas Hill Country.", verified: false, name: "Robert Hill" },
  { id: 4, businessName: "Texas Pie Company", lat: 30.2351, lng: -97.7892, address: "4200 S Lamar Blvd, Austin, TX 78704", photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", categoryName: "Desserts & Sweets", categorySlug: "desserts", categoryIcon: "🥧", rating: 4.8, reviewCount: 15, listingCount: 2, hasFreshItems: true, bio: "Award-winning pies made from scratch with Texas pecans, seasonal fruits, and lots of love.", verified: true, name: "Patricia Johnson" },
  { id: 5, businessName: "Sunset Farms Produce", lat: 30.4015, lng: -97.7207, address: "11501 Rock Rose Ave, Austin, TX 78758", photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", categoryName: "Fresh Produce", categorySlug: "produce", categoryIcon: "🌽", rating: 4.6, reviewCount: 9, listingCount: 3, hasFreshItems: true, bio: "Family-run organic vegetable farm in North Austin. Seasonal produce grown without pesticides.", verified: true, name: "David & Sarah Martinez" },
  { id: 6, businessName: "Flower Child Farms", lat: 30.2819, lng: -97.7265, address: "1500 Manor Rd, Austin, TX 78722", photoUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400", categoryName: "Flowers & Plants", categorySlug: "flowers", categoryIcon: "🌼", rating: 4.4, reviewCount: 3, listingCount: 1, hasFreshItems: true, bio: "Fresh-cut flower bouquets and potted herbs from our urban micro-farm.", verified: false, name: "Alice Green" },
  { id: 7, businessName: "Taco Tones", lat: 30.2452, lng: -97.7563, address: "1700 S Congress Ave, Austin, TX 78704", photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", categoryName: "Food Truck", categorySlug: "food-truck", categoryIcon: "🚚", rating: 4.3, reviewCount: 22, listingCount: 4, hasFreshItems: true, bio: "Breakfast tacos and street food — find us at different spots around South Congress.", verified: true, name: "Tony Ramirez" },
  { id: 8, businessName: "Mama Lu's Kitchen", lat: 30.3340, lng: -97.7020, address: "8500 Research Blvd, Austin, TX 78758", photoUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", categoryName: "Meals & Prepared", categorySlug: "meals", categoryIcon: "🍽️", rating: 4.9, reviewCount: 18, listingCount: 2, hasFreshItems: false, bio: "Homemade comfort food — lasagna, enchiladas, and meal prep boxes from a North Austin home kitchen.", verified: true, name: "Lucia Mendez" },
  { id: 9, businessName: "Bee Sweet Bakery", lat: 30.3075, lng: -97.7378, address: "4500 Duval St, Austin, TX 78751", photoUrl: "https://images.unsplash.com/photo-1558301211-7099e59b9c58?w=400", categoryName: "Desserts & Sweets", categorySlug: "desserts", categoryIcon: "🥧", rating: 4.6, reviewCount: 7, listingCount: 1, hasFreshItems: true, bio: "Vegan and gluten-free cupcakes, cookies, and celebration cakes.", verified: false, name: "Bethany Park" },
  { id: 10, businessName: "Green Gate Growers", lat: 30.2280, lng: -97.8100, address: "6100 W Highway 290, Austin, TX 78735", photoUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400", categoryName: "Fresh Produce", categorySlug: "produce", categoryIcon: "🌽", rating: 4.2, reviewCount: 4, listingCount: 2, hasFreshItems: false, bio: "Microgreens, sprouts, and hydroponic lettuces grown year-round.", verified: true, name: "Kevin Wu" },
];

const MOCK_LISTINGS: Record<string, any[]> = {
  "1": [
    { id: 1, title: "Classic Country Loaf", description: "Our signature sourdough — tangy, chewy, with a crackling crust. 800g loaf.", price: 8.5, quantity: 6, photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", dietaryTags: '["vegetarian","vegan"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Organic flour, water, sourdough starter, sea salt", allergenWarning: null, createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: 2, title: "Cinnamon Raisin Swirl", description: "Sourdough with organic cinnamon and plump California raisins.", price: 10.0, quantity: 4, photoUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Organic flour, water, sourdough starter, cinnamon, raisins, sea salt", allergenWarning: null, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, title: "Everything Bagel Sourdough", description: "Limited batch — sourdough rolled in house-made everything seasoning.", price: 9.5, quantity: 3, photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Organic flour, water, sourdough starter, sesame seeds, poppy seeds, garlic, onion, sea salt", allergenWarning: null, createdAt: new Date(Date.now() - 7200000).toISOString() },
  ],
  "2": [
    { id: 4, title: "Farm Fresh Dozen", description: "One dozen free-range eggs from pastured hens. Rich orange yolks.", price: 7.0, quantity: 20, photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", dietaryTags: '["vegetarian","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 900000).toISOString() },
    { id: 5, title: "Half Dozen + Herbs", description: "6 eggs plus a bundle of fresh kitchen herbs.", price: 6.0, quantity: 10, photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=400", dietaryTags: '["vegetarian","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 5400000).toISOString() },
  ],
  "3": [
    { id: 6, title: "Wildflower Honey — 16oz", description: "Raw, unfiltered wildflower honey from spring blooms.", price: 14.0, quantity: 15, photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", dietaryTags: '["gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 7, title: "Mesquite Honey — 8oz", description: "Dark, bold honey from mesquite blossoms.", price: 10.0, quantity: 8, photoUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400", dietaryTags: '["gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 8, title: "Honeycomb Square", description: "A square of raw honeycomb — wax and honey together.", price: 8.0, quantity: 5, photoUrl: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400", dietaryTags: '["gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ],
  "4": [
    { id: 9, title: "Texas Pecan Pie", description: "Our blue-ribbon pecan pie with Texas pecans. 9-inch.", price: 28.0, quantity: 4, photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Pecans, eggs, butter, brown sugar, vanilla, flour, corn syrup", allergenWarning: "Contains nuts, eggs, dairy, wheat", createdAt: new Date(Date.now() - 1200000).toISOString() },
    { id: 10, title: "Seasonal Fruit Pie", description: "Summer peach and berry pie with a lattice top.", price: 26.0, quantity: 3, photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Peaches, mixed berries, sugar, butter, flour, lemon juice", allergenWarning: "Contains dairy, wheat", createdAt: new Date(Date.now() - 4800000).toISOString() },
  ],
  "5": [
    { id: 11, title: "Weekly Veggie Box", description: "A curated box of seasonal organic vegetables.", price: 25.0, quantity: 10, photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", dietaryTags: '["vegan","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 600000).toISOString() },
    { id: 12, title: "Heirloom Tomato Basket", description: "5 lbs of mixed heirloom tomatoes.", price: 15.0, quantity: 8, photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", dietaryTags: '["vegan","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 3000000).toISOString() },
  ],
  "6": [
    { id: 14, title: "Spring Bouquet", description: "A hand-tied bouquet of seasonal blooms from our farm.", price: 18.0, quantity: 5, photoUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400", dietaryTags: '[]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 1500000).toISOString() },
  ],
  "7": [
    { id: 15, title: "Migas Taco Plate", description: "3 migas tacos with chips and salsa — the Austin classic.", price: 9.5, quantity: 12, photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Eggs, tortilla chips, onion, jalapeño, cheese, salsa", allergenWarning: "Contains eggs, dairy", createdAt: new Date(Date.now() - 600000).toISOString() },
  ],
  "8": [
    { id: 16, title: "Family Lasagna", description: "A full tray of classic meat lasagna — feeds 6.", price: 32.0, quantity: 2, photoUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", dietaryTags: '[]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Pasta, beef, ricotta, mozzarella, tomato sauce, herbs", allergenWarning: "Contains wheat, dairy, eggs", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  "9": [
    { id: 17, title: "Vegan Cupcake Box (6)", description: "Assorted vegan cupcakes — chocolate, vanilla, and red velvet.", price: 22.0, quantity: 4, photoUrl: "https://images.unsplash.com/photo-1558301211-7099e59b9c58?w=400", dietaryTags: '["vegan","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Almond flour, coconut oil, cane sugar, cocoa, vanilla", allergenWarning: "Contains nuts", createdAt: new Date(Date.now() - 2400000).toISOString() },
  ],
  "10": [
    { id: 18, title: "Microgreens Sampler", description: "3 trays of sunflower, pea shoots, and radish microgreens.", price: 15.0, quantity: 6, photoUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400", dietaryTags: '["vegan","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
};

const MOCK_REVIEWS: Record<string, any[]> = {
  "1": [
    { id: 1, userId: "user_1", userName: "Sam T.", rating: 5, comment: "Best sourdough in Austin! The crust is perfectly crackly and the crumb is so open and chewy. I buy the Country Loaf every week.", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 2, userId: "user_2", userName: "Dana K.", rating: 4, comment: "Love the country loaf. Wish they had more availability on weekends — they sell out fast!", createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
    { id: 3, userId: "user_5", userName: "Mike R.", rating: 5, comment: "The Everything Bagel sourdough is incredible. Toasted with cream cheese... chef's kiss!", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  ],
  "2": [
    { id: 4, userId: "user_1", userName: "Sam T.", rating: 5, comment: "These eggs are incredible — the yolks are so orange! You can really taste the difference from store-bought.", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 5, userId: "user_3", userName: "Lila M.", rating: 5, comment: "I pick up a dozen every Saturday. The hens must be really happy because these are the best eggs I've ever had.", createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  ],
  "3": [
    { id: 6, userId: "user_4", userName: "Carlos V.", rating: 5, comment: "The wildflower honey is divine. I drizzle it on everything. The mesquite variety is also amazing on BBQ.", createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  ],
  "4": [
    { id: 7, userId: "user_3", userName: "Lila M.", rating: 5, comment: "The pecan pie is absolutely divine. Worth every penny. I ordered one for Thanksgiving and everyone raved about it.", createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 8, userId: "user_6", userName: "Jordan P.", rating: 5, comment: "Best pie I've had in Texas. The crust is flaky and buttery, and the filling is perfectly sweet. Patricia is a true artisan.", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 9, userId: "user_7", userName: "Tina W.", rating: 4, comment: "Loved the seasonal peach pie! Would love to see a sugar-free option in the future.", createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  ],
  "5": [
    { id: 10, userId: "user_2", userName: "Dana K.", rating: 5, comment: "Amazing veggie box. Everything was super fresh. The heirloom tomatoes were the highlight!", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  ],
};

// ── Helper: build full vendor profile ──────────────────────────────────
function getVendorProfile(vendorId: string) {
  const mockVendor = MOCK_VENDORS.find((v) => v.id === parseInt(vendorId));
  const mockListings = MOCK_LISTINGS[vendorId] || [];
  const mockReviews = MOCK_REVIEWS[vendorId] || [];

  // Also check in-memory store
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
          ? dynReviews.reduce((s, r) => s + r.rating, 0) / dynReviews.length
          : 5.0,
        reviewCount: dynReviews.length,
        listingCount: dynListings.length,
        hasFreshItems: dynListings.some((l) => {
          const start = new Date(l.pickupWindowStart).getTime();
          return start <= Date.now() + 86400000;
        }),
      },
      listings: dynListings.map((l) => ({
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
    listings: mockListings.map((l) => ({
      ...l,
      isFresh: new Date(l.pickupWindowStart).getTime() <= Date.now() + 86400000,
    })),
    reviews: mockReviews,
  };
}

// ── GET ─────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get("id");

  if (vendorId) {
    const data = getVendorProfile(vendorId);
    if (!data) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  // List all vendors for map
  const store = getStore();
  const dynVendors = store.vendors.map((v) => ({
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
    listingCount: store.listings.filter((l) => l.vendorId === v.id).length,
    hasFreshItems: store.listings
      .filter((l) => l.vendorId === v.id)
      .some((l) => new Date(l.pickupWindowStart).getTime() <= Date.now() + 86400000),
    bio: v.bio || null,
  }));

  return NextResponse.json({ vendors: [...MOCK_VENDORS, ...dynVendors] });
}

// ── POST ────────────────────────────────────────────────────────────────
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
    createdAt: now,
  };

  store.vendors.push(vendor);

  return NextResponse.json({ vendor }, { status: 201 });
}
