import { Database } from "bun:sqlite";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "freshfinds.db");

// Remove existing DB for clean seed
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const sqlite = new Database(dbPath);
sqlite.run("PRAGMA journal_mode = WAL");
sqlite.run("PRAGMA foreign_keys = ON");

// Create tables manually (not using drizzle migration for seed)
function createTables() {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      bio TEXT,
      photo_url TEXT,
      verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      price REAL,
      quantity INTEGER,
      photo_url TEXT,
      dietary_tags TEXT,
      pickup_window_start TEXT NOT NULL,
      pickup_window_end TEXT NOT NULL,
      ingredients TEXT,
      allergen_warning TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      expires_at TEXT
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id),
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL
    )
  `);
}

async function seed() {
  console.log("🌱 Creating tables...");
  createTables();

  // Seed categories
  console.log("📋 Seeding categories...");
  const categoryData = [
    { name: "Bread & Pastries", slug: "bread-pastries", icon: "🥖" },
    { name: "Fresh Produce", slug: "produce", icon: "🥬" },
    { name: "Eggs & Dairy", slug: "eggs-dairy", icon: "🥚" },
    { name: "Honey & Preserves", slug: "honey-preserves", icon: "🍯" },
    { name: "Meals & Prepared", slug: "meals", icon: "🍲" },
    { name: "Desserts & Sweets", slug: "desserts", icon: "🧁" },
    { name: "Flowers & Plants", slug: "flowers", icon: "💐" },
    { name: "Meat & Poultry", slug: "meat", icon: "🥩" },
    { name: "Food Truck", slug: "food-truck", icon: "🚚" },
    { name: "Other", slug: "other", icon: "📦" },
  ];

  const insertCategory = sqlite.prepare(
    "INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)"
  );
  for (const c of categoryData) {
    insertCategory.run(c.name, c.slug, c.icon);
  }

  // Seed vendors with Austin-area coordinates
  console.log("👩‍🌾 Seeding vendors...");
  const vendorData = [
    {
      name: "Maria Rodriguez", businessName: "ATX Sourdough",
      email: "maria@atxsourdough.com", phone: "512-555-0101",
      address: "1200 E 6th St, Austin, TX 78702", lat: 30.2615, lng: -97.7320,
      bio: "Hand-crafted sourdough bread using a 100-year-old starter. Baked fresh daily in East Austin.",
      photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
      verified: true,
    },
    {
      name: "James & Lisa Chen", businessName: "Eastside Eggs",
      email: "hello@eastsideeggs.com", phone: "512-555-0202",
      address: "2400 Webberville Rd, Austin, TX 78702", lat: 30.2548, lng: -97.7089,
      bio: "Free-range eggs from happy hens raised right here in East Austin. Farm-fresh daily.",
      photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
      verified: true,
    },
    {
      name: "Robert Hill", businessName: "Hill Country Honey",
      email: "rob@hillcountryhoney.com", phone: "512-555-0303",
      address: "8901 TX-71, Austin, TX 78735", lat: 30.2477, lng: -97.9284,
      bio: "Raw, unfiltered honey from our hives in the Texas Hill Country. Wildflower, clover, and seasonal varietals.",
      photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
      verified: false,
    },
    {
      name: "Patricia Johnson", businessName: "Texas Pie Company",
      email: "pat@texaspieco.com", phone: "512-555-0404",
      address: "4200 S Lamar Blvd, Austin, TX 78704", lat: 30.2351, lng: -97.7892,
      bio: "Award-winning pies made from scratch with Texas pecans, seasonal fruits, and lots of love.",
      photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400",
      verified: true,
    },
    {
      name: "David & Sarah Martinez", businessName: "Sunset Farms Produce",
      email: "david@sunsetfarmsatx.com", phone: "512-555-0505",
      address: "11501 Rock Rose Ave, Austin, TX 78758", lat: 30.4015, lng: -97.7207,
      bio: "Family-run organic vegetable farm in North Austin. Seasonal produce grown without pesticides.",
      photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
      verified: true,
    },
  ];

  const insertVendor = sqlite.prepare(
    `INSERT INTO vendors (name, business_name, email, phone, address, lat, lng, bio, photo_url, verified, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const now = new Date().toISOString();
  for (const v of vendorData) {
    insertVendor.run(
      v.name, v.businessName, v.email, v.phone, v.address,
      v.lat, v.lng, v.bio, v.photoUrl, v.verified ? 1 : 0, now
    );
  }

  // Seed listings
  console.log("📦 Seeding listings...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString();
  const dayAfter = new Date(tomorrow);
  dayAfter.setHours(dayAfter.getHours() + 4);
  const dayAfterStr = dayAfter.toISOString();

  const listingData = [
    { vendorId: 1, categoryId: 1, title: "Classic Country Loaf", description: "Our signature sourdough — tangy, chewy, with a crackling crust. 800g loaf.", price: 8.50, quantity: 6, dietaryTags: '["vegetarian","vegan"]', photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
    { vendorId: 1, categoryId: 1, title: "Cinnamon Raisin Swirl", description: "Sourdough with organic cinnamon and plump California raisins.", price: 10.00, quantity: 4, dietaryTags: '["vegetarian"]', photoUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400" },
    { vendorId: 1, categoryId: 1, title: "Everything Bagel Sourdough", description: "Limited batch — sourdough rolled in house-made everything seasoning.", price: 9.50, quantity: 3, dietaryTags: '["vegetarian"]', photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=400" },
    { vendorId: 2, categoryId: 3, title: "Farm Fresh Dozen", description: "One dozen free-range eggs from pastured hens. Rich orange yolks.", price: 7.00, quantity: 20, dietaryTags: '["vegetarian","gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
    { vendorId: 2, categoryId: 3, title: "Half Dozen + Herbs", description: "6 eggs plus a bundle of fresh kitchen herbs from our garden.", price: 6.00, quantity: 10, dietaryTags: '["vegetarian","gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=400" },
    { vendorId: 3, categoryId: 4, title: "Wildflower Honey — 16oz", description: "Raw, unfiltered wildflower honey from spring blooms.", price: 14.00, quantity: 15, dietaryTags: '["gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
    { vendorId: 3, categoryId: 4, title: "Mesquite Honey — 8oz", description: "Dark, bold honey from mesquite blossoms. Smoky-sweet.", price: 10.00, quantity: 8, dietaryTags: '["gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400" },
    { vendorId: 3, categoryId: 4, title: "Honeycomb Square", description: "A square of raw honeycomb — wax and honey together.", price: 8.00, quantity: 5, dietaryTags: '["gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400" },
    { vendorId: 4, categoryId: 6, title: "Texas Pecan Pie", description: "Our blue-ribbon pecan pie with Texas pecans. 9-inch.", price: 28.00, quantity: 4, dietaryTags: '["vegetarian"]', photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", ingredients: "Pecans, eggs, butter, brown sugar, vanilla, flour, corn syrup", allergenWarning: "Contains nuts, eggs, dairy, wheat" },
    { vendorId: 4, categoryId: 6, title: "Seasonal Fruit Pie", description: "Summer peach and berry pie with a lattice top.", price: 26.00, quantity: 3, dietaryTags: '["vegetarian"]', photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=400", ingredients: "Peaches, mixed berries, sugar, butter, flour, lemon juice", allergenWarning: "Contains dairy, wheat" },
    { vendorId: 5, categoryId: 2, title: "Weekly Veggie Box", description: "A curated box of seasonal organic vegetables.", price: 25.00, quantity: 10, dietaryTags: '["vegan","gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" },
    { vendorId: 5, categoryId: 2, title: "Heirloom Tomato Basket", description: "5 lbs of mixed heirloom tomatoes — Cherokee Purple, Brandywine, Sun Gold cherries.", price: 15.00, quantity: 8, dietaryTags: '["vegan","gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400" },
    { vendorId: 5, categoryId: 2, title: "Herb Bundle", description: "Fresh-cut basil, cilantro, rosemary, and mint from our garden.", price: 6.00, quantity: 15, dietaryTags: '["vegan","gluten-free"]', photoUrl: "https://images.unsplash.com/photo-1600852659773-7e5a02b35c5a?w=400" },
  ];

  const insertListing = sqlite.prepare(
    `INSERT INTO listings (vendor_id, title, description, category_id, price, quantity, photo_url, dietary_tags, pickup_window_start, pickup_window_end, ingredients, allergen_warning, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
  );
  for (const l of listingData) {
    insertListing.run(
      l.vendorId, l.title, l.description, l.categoryId, l.price,
      l.quantity, l.photoUrl, l.dietaryTags,
      tomorrowStr, dayAfterStr,
      (l as any).ingredients || null, (l as any).allergenWarning || null, now
    );
  }

  // Seed reviews
  console.log("⭐ Seeding reviews...");
  const reviewData = [
    { vendorId: 1, userId: "user_1", rating: 5, comment: "Best sourdough in Austin! The crust is perfect." },
    { vendorId: 1, userId: "user_2", rating: 4, comment: "Love the country loaf. Wish they had more availability." },
    { vendorId: 2, userId: "user_1", rating: 5, comment: "These eggs are incredible — the yolks are so orange!" },
    { vendorId: 4, userId: "user_3", rating: 5, comment: "The pecan pie is absolutely divine. Worth every penny." },
    { vendorId: 5, userId: "user_2", rating: 5, comment: "Amazing veggie box. Everything was super fresh." },
  ];

  const insertReview = sqlite.prepare(
    "INSERT INTO reviews (vendor_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)"
  );
  for (const r of reviewData) {
    insertReview.run(r.vendorId, r.userId, r.rating, r.comment, now);
  }

  console.log("✅ Seed complete!");
  console.log(`   - ${vendorData.length} vendors`);
  console.log(`   - ${categoryData.length} categories`);
  console.log(`   - ${listingData.length} listings`);
  console.log(`   - ${reviewData.length} reviews`);

  sqlite.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
