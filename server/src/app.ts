import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import admin, { getServiceAccount } from "./config/firebase.js";
import baseRoutes from "./routes/baseRoutes.js";
import { authenticateUser } from "./middleware/auth.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import wishlistItemRoutes from "./routes/wishlistItemRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";
import userItemHistoryRoutes from "./routes/userItemHistoryRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { JobQueueService } from "./services/jobQueue.js";
import logger from "./utils/logger.js";

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(getServiceAccount()),
});

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// base public route for health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// public routes (no authentication required)
app.use("/login", loginRoutes);

// protect everything else under /wishswipe
app.use("/wishswipe", authenticateUser);

app.use("/wishswipe", baseRoutes);
app.use("/wishswipe/explore", exploreRoutes);
app.use("/wishswipe/wishlist", wishlistRoutes);
app.use("/wishswipe/wishlist-items", wishlistItemRoutes);
app.use("/wishswipe/preferences", preferencesRoutes);
app.use("/wishswipe/user-item-history", userItemHistoryRoutes);
app.use("/wishswipe/analytics", analyticsRoutes);

app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);

  // Initialize scheduled jobs
  try {
    await JobQueueService.initializeScheduledJobs();
    logger.info("Job queues initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize job queues:", error);
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully...");
  await JobQueueService.shutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully...");
  await JobQueueService.shutdown();
  process.exit(0);
});

export default app;
