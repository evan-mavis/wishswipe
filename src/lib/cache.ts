import "server-only";

import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

function getRedis() {
  if (redis !== undefined) return redis;

  redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
      : null;

  return redis;
}

export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const value = await client.get<string>(key);
    return typeof value === "string" ? value : value ? JSON.stringify(value) : null;
  } catch (error) {
    console.warn(`Redis get failed for ${key}:`, error);
    return null;
  }
}

export async function cacheSetEx(
  key: string,
  expirySeconds: number,
  value: string
) {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(key, value, { ex: expirySeconds });
  } catch (error) {
    console.warn(`Redis set failed for ${key}:`, error);
  }
}
