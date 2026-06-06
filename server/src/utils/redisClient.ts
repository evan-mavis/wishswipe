import { Redis } from "ioredis";
import logger from "./logger.js";

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    })
  : null;

if (redis) {
  redis.on("error", (err: Error) => {
    logger.warn("Redis error:", err.message);
  });

  redis.connect().catch((err: Error) => {
    logger.warn("Redis unavailable, continuing without cache:", err.message);
  });
} else {
  logger.info("REDIS_URL not set — caching disabled");
}

export async function cacheGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    logger.warn(`Redis get failed for ${key}:`, err);
    return null;
  }
}

export async function cacheSetEx(
  key: string,
  expirySeconds: number,
  value: string
): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, expirySeconds, value);
  } catch (err) {
    logger.warn(`Redis setex failed for ${key}:`, err);
  }
}

export async function cacheSetWithExpiry(
  key: string,
  value: string,
  expirySeconds: number
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, "EX", expirySeconds);
  } catch (err) {
    logger.warn(`Redis set failed for ${key}:`, err);
  }
}
