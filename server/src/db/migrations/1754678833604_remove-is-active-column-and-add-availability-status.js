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
  // add new column if not exists
  pgm.sql(
    `ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS availability_status varchar(32) NOT NULL DEFAULT 'IN_STOCK'`
  );

  // backfill from legacy is_active if that column exists
  pgm.sql(`DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wishlist_items' AND column_name = 'is_active'
    ) THEN
      UPDATE wishlist_items SET availability_status = 'IN_STOCK' WHERE is_active = true;
      UPDATE wishlist_items SET availability_status = 'UNKNOWN_AVAILABILITY' WHERE is_active = false;
      ALTER TABLE wishlist_items DROP COLUMN IF EXISTS is_active;
    END IF;
  END$$;`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(
    `ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true`
  );

  pgm.sql(
    `UPDATE wishlist_items SET is_active = (availability_status IN ('IN_STOCK','LIMITED_STOCK'))`
  );

  pgm.sql(
    `ALTER TABLE wishlist_items DROP COLUMN IF EXISTS availability_status`
  );
};
