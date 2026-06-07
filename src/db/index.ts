import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  wishswipePool?: Pool;
};

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  });
}

export function getPool() {
  if (!globalForDb.wishswipePool) {
    globalForDb.wishswipePool = createPool();
  }

  return globalForDb.wishswipePool;
}

function createDb() {
  return drizzle(getPool(), { schema });
}

type Db = ReturnType<typeof createDb>;

let dbInstance: Db | null = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = createDb();
  }

  return dbInstance;
}

export const db = new Proxy({} as Db, {
  get(_target, property) {
    const instance = getDb();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
