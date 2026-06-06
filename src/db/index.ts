import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as {
  wishswipePool?: Pool;
};

export const pool =
  globalForDb.wishswipePool ??
  new Pool({
    connectionString,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.wishswipePool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
