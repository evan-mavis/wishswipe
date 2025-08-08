import { JobQueueService } from "./services/jobQueue.js";
import logger from "./utils/logger.js";

async function main() {
  try {
    await JobQueueService.initializeScheduledJobs();
    logger.info("Worker scheduled jobs initialized");
  } catch (error) {
    logger.error("Worker failed to initialize jobs:", error);
    process.exit(1);
  }

  // Keep process alive
  process.on("SIGTERM", async () => {
    logger.info("Worker SIGTERM received, shutting down...");
    await JobQueueService.shutdown();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    logger.info("Worker SIGINT received, shutting down...");
    await JobQueueService.shutdown();
    process.exit(0);
  });
}

void main();
