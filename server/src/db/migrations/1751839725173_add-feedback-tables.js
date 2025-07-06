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
  // Create feedback table
  pgm.createTable("feedback", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    type: {
      type: "varchar(50)",
      notNull: true,
      check: "type IN ('feature', 'comment')",
    },
    status: {
      type: "varchar(50)",
      notNull: true,
      default: "open",
      check: "status IN ('open', 'in-progress', 'completed')",
    },
    upvotes: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create feedback_votes table to track user votes
  pgm.createTable("feedback_votes", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    feedback_id: {
      type: "uuid",
      notNull: true,
      references: '"feedback"',
      onDelete: "CASCADE",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // create unique constraint to prevent duplicate votes
  pgm.addConstraint("feedback_votes", "feedback_votes_unique_user_feedback", {
    unique: ["user_id", "feedback_id"],
  });

  pgm.createIndex("feedback", "feedback_type_idx", ["type"]);
  pgm.createIndex("feedback", "feedback_status_idx", ["status"]);
  pgm.createIndex("feedback", "feedback_created_at_idx", ["created_at"]);
  pgm.createIndex("feedback_votes", "feedback_votes_feedback_id_idx", [
    "feedback_id",
  ]);
  pgm.createIndex("feedback_votes", "feedback_votes_user_id_idx", ["user_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // drop indexes
  pgm.dropIndex("feedback", "feedback_type_idx");
  pgm.dropIndex("feedback", "feedback_status_idx");
  pgm.dropIndex("feedback", "feedback_created_at_idx");
  pgm.dropIndex("feedback_votes", "feedback_votes_feedback_id_idx");
  pgm.dropIndex("feedback_votes", "feedback_votes_user_id_idx");

  // drop tables (feedback_votes first due to foreign key constraint)
  pgm.dropTable("feedback_votes");
  pgm.dropTable("feedback");
};
