/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("user_item_history", {
    id: {
      type: "SERIAL",
      primaryKey: true,
    },
    user_id: {
      type: "UUID",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    item_id: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    action: {
      type: "VARCHAR(20)",
      notNull: true,
      check: "action IN ('left', 'right')",
    },
    search_query: {
      type: "TEXT",
    },
    condition_filter: {
      type: "VARCHAR(50)",
    },
    category_filter: {
      type: "VARCHAR(50)",
    },
    price_min: {
      type: "DECIMAL(10,2)",
    },
    price_max: {
      type: "DECIMAL(10,2)",
    },
    price: {
      type: "DECIMAL(10,2)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.createIndex("user_item_history", "user_id");
  pgm.createIndex("user_item_history", "item_id");
  pgm.createIndex("user_item_history", ["user_id", "item_id"]);
  pgm.createIndex("user_item_history", ["user_id", "action"]);
  pgm.createIndex("user_item_history", "created_at");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("user_item_history");
};
