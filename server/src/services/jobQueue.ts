import { Queue, Worker } from "bullmq";
import { SearchSessionService } from "./searchSessionService.js";
import { WishlistItemService } from "./wishlistItemService.js";
import redis from "../utils/redisClient.js";
import logger from "../utils/logger.js";

const connection = redis;

// job queues
export const searchSessionQueue = new Queue("search-session-reset", {
  connection,
});
export const expiredItemsQueue = new Queue("expired-items-check", {
  connection,
});

// worker for resetting old search sessions
const searchSessionWorker = new Worker(
  "search-session-reset",
  async (job) => {
    logger.info(
      `Processing job: ${job.name} with data: ${JSON.stringify(job.data)}`
    );

    await SearchSessionService.resetOldSessions();
    logger.info("Successfully reset old search sessions");
  },
  {
    connection,
    concurrency: 1,
  }
);

// worker for checking expired items
const expiredItemsWorker = new Worker(
  "expired-items-check",
  async (job) => {
    logger.info(`Processing expired items check job: ${job.name}`);

    const summary = await WishlistItemService.checkAllActiveItems();
    logger.info(
      `Expired items check complete: checked=${summary.totalChecked}, available=${summary.availableCount}, unavailable=${summary.unavailableCount}, deactivated=${summary.deactivatedCount}`
    );
  },
  {
    connection,
    concurrency: 1,
  }
);

// error handling
searchSessionWorker.on("error", (error) => {
  logger.error("Search session worker error:", error);
});

expiredItemsWorker.on("error", (error) => {
  logger.error("Expired items worker error:", error);
});

// job scheduling functions
export const JobQueueService = {
  async scheduleSearchSessionReset(): Promise<void> {
    await searchSessionQueue.add(
      "reset-old-sessions",
      {},
      {
        repeat: {
          pattern: "0 * * * *", // every hour at minute 0
        },
      }
    );
    logger.info("Scheduled search session reset job");
  },

  async scheduleExpiredItemsCheck(): Promise<void> {
    const singletonJobId = "expired-items-single";
    try {
      const existing = await expiredItemsQueue.getJob(singletonJobId);
      if (existing) {
        const state = await existing.getState();
        if (state === "waiting" || state === "active" || state === "delayed") {
          logger.info(
            "Expired items check already scheduled or running; skipping immediate run"
          );
          return;
        }
      }
    } catch {}

    await expiredItemsQueue.add("check-expired-items", {});
    logger.info("Scheduled immediate expired items check job for testing");

    // await expiredItemsQueue.add(
    //   "check-expired-items",
    //   {},
    //   {
    //     repeat: {
    //       pattern: "0 2 * * *", // daily at 2:00 am
    //     },
    //     jobId: "check-expired-items-daily",
    //   }
    // );
    // logger.info("Scheduled daily expired items check job");
  },

  async initializeScheduledJobs(): Promise<void> {
    await this.scheduleSearchSessionReset();

    // kill any lingering jobs on restart to avoid overlap
    try {
      await expiredItemsQueue.obliterate({ force: true });
      logger.info("Obliterated expired-items queue on startup");
    } catch (e) {
      logger.warn("Could not obliterate expired-items queue on startup");
    }

    await this.scheduleExpiredItemsCheck();
  },

  async shutdown(): Promise<void> {
    await searchSessionWorker.close();
    await expiredItemsWorker.close();
    await searchSessionQueue.close();
    await expiredItemsQueue.close();
    // note: don't quit the redis connection as it's shared
  },
};
