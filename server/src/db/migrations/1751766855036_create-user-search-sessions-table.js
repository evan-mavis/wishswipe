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
  pgm.createTable("user_search_sessions", {
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
    search_query: {
      type: "TEXT",
      notNull: true,
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
    current_offset: {
      type: "INTEGER",
      notNull: true,
      default: 0,
    },
    total_items_seen: {
      type: "INTEGER",
      notNull: true,
      default: 0,
    },
    last_activity: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  // Indexes for performance
  pgm.createIndex("user_search_sessions", "user_id");
  pgm.createIndex("user_search_sessions", ["user_id", "search_query"]);
  pgm.createIndex("user_search_sessions", "last_activity");

  // Unique constraint to prevent duplicate sessions for same search
  pgm.createIndex(
    "user_search_sessions",
    [
      "user_id",
      "search_query",
      "condition_filter",
      "category_filter",
      "price_min",
      "price_max",
    ],
    { unique: true, name: "unique_user_search_session" }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("user_search_sessions");
};
