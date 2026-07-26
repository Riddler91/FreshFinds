/**
 * Seed script: initializes the database with categories and city data only.
 * NO vendors, NO listings, NO reviews — clean slate for real vendors.
 * Run with: bun run db:seed
 * Safe to run multiple times — skips categories if already seeded.
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

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

  // Check if categories already seeded
  const existingCategories = sqlite.prepare("SELECT COUNT(*) as c FROM categories").get() as any;
  if (existingCategories.c > 0) {
    console.log(`✅ Categories already seeded (${existingCategories.c}). Skipping.`);
    console.log("   🧹 Vendors: 0 | Listings: 0 | Reviews: 0 (clean slate)");
    sqlite.close();
    return;
  }

  // Seed categories only
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
  for (const c of categoryData) {
    insertCategory.run(c.name, c.slug, c.icon);
  }

  console.log("✅ Seed complete!");
  console.log(`   - ${categoryData.length} categories`);
  console.log("   - 0 vendors (clean slate — waiting for real signups)");
  console.log("   - 0 listings");
  console.log("   - 0 reviews");

  sqlite.close();
}

seed();
