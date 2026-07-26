/**
 * Seed script: reads mock data from src/lib/data.ts and inserts into SQLite.
 * Run with: bun run db:seed
 * Safe to run multiple times — skips if data already exists (checks vendors count).
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { MOCK_VENDORS, MOCK_LISTINGS, MOCK_REVIEWS } from "../src/lib/data";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, "freshfinds.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

function createTables() {
  sqlite.exec(`
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
      category_name TEXT NOT NULL DEFAULT 'Other',
      category_slug TEXT NOT NULL DEFAULT 'other',
      category_icon TEXT NOT NULL DEFAULT '📦',
      website TEXT,
      social_links TEXT,
      state TEXT NOT NULL DEFAULT 'TX',
      city TEXT NOT NULL DEFAULT 'Austin',
      accepts_messages INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      category_slug TEXT,
      category_icon TEXT,
      vendor_name TEXT,
      price REAL,
      quantity INTEGER,
      photo_url TEXT,
      dietary_tags TEXT,
      post_type TEXT NOT NULL DEFAULT 'available_now',
      posted_at TEXT NOT NULL,
      expires_at TEXT,
      pickup_window_start TEXT NOT NULL,
      pickup_window_end TEXT NOT NULL,
      ingredients TEXT,
      allergen_warning TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      state TEXT,
      city TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id),
      user_id TEXT NOT NULL,
      user_name TEXT,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      sender TEXT NOT NULL DEFAULT 'consumer',
      created_at TEXT NOT NULL
    );
  `);
}

function seed() {
  console.log("🌱 Creating tables...");
  createTables();

  // Check if already seeded
  const existingCount = sqlite.prepare("SELECT COUNT(*) as c FROM vendors").get() as any;
  if (existingCount.c > 0) {
    console.log(`✅ Already seeded (${existingCount.c} vendors). Skipping.`);
    sqlite.close();
    return;
  }

  const NOW = new Date().toISOString();

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
  const insertCategory = sqlite.prepare("INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)");
  const categoryIdMap = new Map<string, number>();
  for (const c of categoryData) {
    const result = insertCategory.run(c.name, c.slug, c.icon);
    categoryIdMap.set(c.slug, Number(result.lastInsertRowid));
  }

  // Seed vendors from MOCK_VENDORS
  console.log(`👩‍🌾 Seeding ${MOCK_VENDORS.length} vendors...`);
  const insertVendor = sqlite.prepare(
    `INSERT INTO vendors (id, name, business_name, email, phone, address, lat, lng, bio, photo_url, verified, category_name, category_slug, category_icon, state, city, accepts_messages, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertManyVendors = sqlite.transaction((vendors: any[]) => {
    for (const v of vendors) {
      insertVendor.run(
        v.id, v.name || "", v.businessName, v.email || `vendor${v.id}@example.com`,
        v.phone || null, v.address, v.lat, v.lng, v.bio || null, v.photoUrl || null,
        v.verified ? 1 : 0, v.categoryName || "Other", v.categorySlug || "other",
        v.categoryIcon || "📦", v.state || "TX", v.city || "Austin",
        v.acceptsMessages ? 1 : 0, NOW
      );
    }
  });
  insertManyVendors(MOCK_VENDORS);

  // Seed listings from MOCK_LISTINGS
  console.log(`📦 Seeding ${MOCK_LISTINGS.length} listings...`);
  const insertListing = sqlite.prepare(
    `INSERT INTO listings (id, vendor_id, title, description, category_id, category_slug, category_icon, vendor_name, price, quantity, photo_url, dietary_tags, post_type, posted_at, expires_at, pickup_window_start, pickup_window_end, ingredients, allergen_warning, is_active, state, city, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
  );
  const insertManyListings = sqlite.transaction((listings: any[]) => {
    for (const l of listings) {
      const expiresAt = new Date(new Date(l.postedAt).getTime() + 24 * 3600000).toISOString();
      const categoryId = l.categorySlug ? categoryIdMap.get(l.categorySlug) || null : null;
      insertListing.run(
        l.id, l.vendorId, l.title, l.description,
        categoryId, l.categorySlug || null, l.categoryIcon || null,
        l.vendorName || null, l.price ?? null, l.quantity ?? null,
        l.photoUrl || null, l.dietaryTags || "[]", l.postType || "available_now",
        l.postedAt, expiresAt, l.pickupWindowStart, l.pickupWindowEnd,
        l.ingredients || null, l.allergenWarning || null,
        l.state || null, l.city || null, NOW
      );
    }
  });
  insertManyListings(MOCK_LISTINGS);

  // Seed reviews from MOCK_REVIEWS
  console.log(`⭐ Seeding reviews...`);
  const insertReview = sqlite.prepare(
    "INSERT INTO reviews (vendor_id, user_id, user_name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  let reviewCount = 0;
  for (const [vendorId, reviewList] of Object.entries(MOCK_REVIEWS)) {
    for (const r of reviewList) {
      insertReview.run(
        parseInt(vendorId), r.userId, r.userName || null,
        r.rating, r.comment || null, r.createdAt || NOW
      );
      reviewCount++;
    }
  }

  console.log("✅ Seed complete!");
  console.log(`   - ${MOCK_VENDORS.length} vendors`);
  console.log(`   - ${categoryData.length} categories`);
  console.log(`   - ${MOCK_LISTINGS.length} listings`);
  console.log(`   - ${reviewCount} reviews`);

  sqlite.close();
}

seed();
