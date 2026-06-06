import "server-only";

import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function cacheGet(key: string): Promise<string | null> {
  if (!redis) return null;

  try {
    const value = await redis.get<string>(key);
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
  if (!redis) return;

  try {
    await redis.set(key, value, { ex: expirySeconds });
  } catch (error) {
    console.warn(`Redis set failed for ${key}:`, error);
  }
}
