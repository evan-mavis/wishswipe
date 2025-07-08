import { Queue, Worker } from "bullmq";
import { SearchSessionService } from "./searchSessionService.js";
import { WishlistItemService } from "./wishlistItemService.js";
import redis from "../utils/redisClient.js";
import logger from "../utils/logger.js";

// Use existing Redis connection
const connection = redis;

// Job queues
export const searchSessionQueue = new Queue("search-session-reset", {
  connection,
});
export const expiredItemsQueue = new Queue("expired-items-check", {
  connection,
});

// Worker for resetting old search sessions
const searchSessionWorker = new Worker(
  "search-session-reset",
  async (job) => {
    logger.info(
      `Processing job: ${job.name} with data: ${JSON.stringify(job.data)}`
    );

    try {
      await SearchSessionService.resetOldSessions();
      logger.info("Successfully reset old search sessions");
    } catch (error) {
      logger.error("Error resetting search sessions:", error);
      throw error; // This will trigger a retry
    }
  },
  {
    connection,
    concurrency: 1, // Only process one job at a time
  }
);

// Worker for checking expired items
const expiredItemsWorker = new Worker(
  "expired-items-check",
  async (job) => {
    logger.info(
      `Processing expired items check job: ${
        job.name
      } with data: ${JSON.stringify(job.data)}`
    );

    try {
      const result = await WishlistItemService.checkAllActiveItems();
      logger.info(
        `Successfully checked expired items: ${JSON.stringify(result)}`
      );
    } catch (error) {
      logger.error("Error checking expired items:", error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 1,
  }
);

// Error handling
searchSessionWorker.on("error", (error) => {
  logger.error("Search session worker error:", error);
});

expiredItemsWorker.on("error", (error) => {
  logger.error("Expired items worker error:", error);
});

// Job scheduling functions
export const JobQueueService = {
  // Schedule search session reset to run every hour
  async scheduleSearchSessionReset(): Promise<void> {
    await searchSessionQueue.add(
      "reset-old-sessions",
      {},
      {
        repeat: {
          pattern: "0 * * * *", // Every hour at minute 0
        },
      }
    );
    logger.info("Scheduled search session reset job");
  },

  // Schedule expired items check to run daily at 2 AM
  async scheduleExpiredItemsCheck(): Promise<void> {
    await expiredItemsQueue.add(
      "check-expired-items",
      {},
      {
        repeat: {
          pattern: "0 2 * * *", // Daily at 2:00 AM
        },
      }
    );
    logger.info("Scheduled expired items check job");
  },

  // Initialize all scheduled jobs
  async initializeScheduledJobs(): Promise<void> {
    await this.scheduleSearchSessionReset();
    await this.scheduleExpiredItemsCheck();
  },

  // Graceful shutdown
  async shutdown(): Promise<void> {
    await searchSessionWorker.close();
    await expiredItemsWorker.close();
    await searchSessionQueue.close();
    await expiredItemsQueue.close();
    // Note: Don't quit the Redis connection as it's shared
  },
};
