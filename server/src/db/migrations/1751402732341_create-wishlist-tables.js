/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("wishlists", {
    id: "uuid PRIMARY KEY",
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "cascade",
    },
    name: { type: "varchar(255)", notNull: true },
    description: { type: "varchar(500)" },
    is_favorite: { type: "boolean", notNull: true, default: false },
    order_index: { type: "integer", notNull: true, default: 0 },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createTable("wishlist_items", {
    id: "uuid PRIMARY KEY",
    wishlist_id: {
      type: "uuid",
      notNull: true,
      references: "wishlists(id)",
      onDelete: "cascade",
    },
    ebay_item_id: { type: "varchar(64)", notNull: true },
    title: { type: "varchar(255)" },
    image_url: { type: "varchar(512)" },
    item_web_url: { type: "varchar(512)" },
    price: { type: "numeric" },
    seller_feedback_score: { type: "integer" },
    order_index: { type: "integer", notNull: true, default: 0 },
    is_active: { type: "boolean", notNull: true, default: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("wishlist_items");
  pgm.dropTable("wishlists");
};
