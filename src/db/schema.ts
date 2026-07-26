import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const vendors = sqliteTable("vendors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(), // emoji icon
});

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  price: real("price"),
  quantity: integer("quantity"),
  photoUrl: text("photo_url"),
  dietaryTags: text("dietary_tags"), // JSON array: ["vegan","gluten-free"]
  pickupWindowStart: text("pickup_window_start").notNull(),
  pickupWindowEnd: text("pickup_window_end").notNull(),
  ingredients: text("ingredients"),
  allergenWarning: text("allergen_warning"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  expiresAt: text("expires_at"),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  userId: text("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});
