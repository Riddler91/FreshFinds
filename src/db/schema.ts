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
  categoryName: text("category_name").notNull().default("Other"),
  categorySlug: text("category_slug").notNull().default("other"),
  categoryIcon: text("category_icon").notNull().default("📦"),
  website: text("website"),
  socialLinks: text("social_links"),
  state: text("state").notNull().default("TX"),
  city: text("city").notNull().default("Austin"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
});

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  categorySlug: text("category_slug"),
  categoryIcon: text("category_icon"),
  vendorName: text("vendor_name"),
  price: real("price"),
  quantity: integer("quantity"),
  photoUrl: text("photo_url"),
  dietaryTags: text("dietary_tags"),
  postType: text("post_type").notNull().default("available_now"),
  postedAt: text("posted_at").notNull(),
  expiresAt: text("expires_at"),
  pickupWindowStart: text("pickup_window_start").notNull(),
  pickupWindowEnd: text("pickup_window_end").notNull(),
  ingredients: text("ingredients"),
  allergenWarning: text("allergen_warning"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  state: text("state"),
  city: text("city"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  userId: text("user_id").notNull(),
  userName: text("user_name"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").notNull(),
  text: text("text").notNull(),
  sender: text("sender").notNull().default("consumer"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});
