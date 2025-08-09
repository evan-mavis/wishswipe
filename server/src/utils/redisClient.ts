import { Redis } from "ioredis";
import logger from "./logger.js";

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    })
  : new Redis({
      maxRetriesPerRequest: null,
    });

redis.on("error", (err: Error) => {
  logger.error("Redis error:", err);
});

export default redis;
