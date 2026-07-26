import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, "freshfinds.db");

// Singleton connection
let _db: BetterSQLite3Database<typeof schema> | null = null;
let _sqlite: Database.Database | null = null;

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (!_db) {
    _sqlite = new Database(DB_PATH);
    _sqlite.pragma("journal_mode = WAL");
    _sqlite.pragma("foreign_keys = ON");
    _db = drizzle(_sqlite, { schema });
    ensureTables(_sqlite);
  }
  return _db;
}

export function getRawDb(): Database.Database {
  if (!_sqlite) {
    getDb(); // init
  }
  return _sqlite!;
}

/** Ensure tables exist (idempotent — creates only if not exists) */
function ensureTables(sqlite: Database.Database) {
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

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      city TEXT,
      session_id TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);
}
