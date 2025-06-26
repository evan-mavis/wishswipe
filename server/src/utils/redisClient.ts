import { Redis } from "ioredis";
const redis = new Redis();

redis.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

export default redis;
