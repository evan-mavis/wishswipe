import { Redis } from "ioredis";
import logger from "./logger.js";

const redis = new Redis({
  maxRetriesPerRequest: null,
});

redis.on("error", (err: Error) => {
  logger.error("Redis error:", err);
});

export default redis;
