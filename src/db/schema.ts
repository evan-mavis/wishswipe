import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wishlists = pgTable(
  "wishlists",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 500 }),
    isFavorite: boolean("is_favorite").notNull().default(false),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("wishlists_user_id_idx").on(table.userId),
    uniqueIndex("unique_favorite_per_user")
      .on(table.userId)
      .where(sql`${table.isFavorite} = true`),
  ]
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: text("id").primaryKey(),
    wishlistId: text("wishlist_id")
      .notNull()
      .references(() => wishlists.id, { onDelete: "cascade" }),
    ebayItemId: varchar("ebay_item_id", { length: 64 }).notNull(),
    title: varchar("title", { length: 255 }),
    imageUrl: varchar("image_url", { length: 512 }),
    itemWebUrl: varchar("item_web_url", { length: 512 }),
    price: numeric("price", { precision: 10, scale: 2 }),
    sellerFeedbackScore: integer("seller_feedback_score"),
    orderIndex: integer("order_index").notNull().default(0),
    availabilityStatus: varchar("availability_status", { length: 32 })
      .notNull()
      .default("IN_STOCK"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("wishlist_items_wishlist_id_idx").on(table.wishlistId),
    index("wishlist_items_ebay_item_id_idx").on(table.ebayItemId),
  ]
);

export const userPreferences = pgTable(
  "user_preferences",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    defaultSearchTerm: text("default_search_term").notNull().default(""),
    defaultCondition: text("default_condition").notNull().default("none"),
    defaultCategory: text("default_category").notNull().default("none"),
    defaultPriceMin: integer("default_price_min").notNull().default(10),
    defaultPriceMax: integer("default_price_max").notNull().default(75),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_preferences_user_id_unique").on(table.userId),
    index("user_preferences_user_id_idx").on(table.userId),
  ]
);

export const userItemHistory = pgTable(
  "user_item_history",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemId: varchar("item_id", { length: 255 }).notNull(),
    action: varchar("action", { length: 20 }).notNull(),
    searchQuery: text("search_query"),
    conditionFilter: varchar("condition_filter", { length: 50 }),
    categoryFilter: varchar("category_filter", { length: 50 }),
    priceMin: numeric("price_min", { precision: 10, scale: 2 }),
    priceMax: numeric("price_max", { precision: 10, scale: 2 }),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("user_item_history_user_id_idx").on(table.userId),
    index("user_item_history_item_id_idx").on(table.itemId),
    index("user_item_history_user_item_idx").on(table.userId, table.itemId),
    index("user_item_history_user_action_idx").on(table.userId, table.action),
    index("user_item_history_created_at_idx").on(table.createdAt),
  ]
);

export const userSearchSessions = pgTable(
  "user_search_sessions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    searchHash: varchar("search_hash", { length: 128 }).notNull(),
    pageNumber: integer("page_number").notNull().default(1),
    totalItemsSeen: integer("total_items_seen").notNull().default(0),
    searchQuery: text("search_query").notNull(),
    conditionFilter: varchar("condition_filter", { length: 50 }),
    categoryFilter: varchar("category_filter", { length: 50 }),
    priceMin: numeric("price_min", { precision: 10, scale: 2 }),
    priceMax: numeric("price_max", { precision: 10, scale: 2 }),
    lastActivity: timestamp("last_activity", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("user_search_sessions_user_id_idx").on(table.userId),
    index("user_search_sessions_last_activity_idx").on(table.lastActivity),
    uniqueIndex("unique_user_search_session").on(table.userId, table.searchHash),
  ]
);

export type DbUser = typeof user.$inferSelect;
export type DbWishlist = typeof wishlists.$inferSelect;
export type DbWishlistItem = typeof wishlistItems.$inferSelect;
export type DbUserPreferences = typeof userPreferences.$inferSelect;
