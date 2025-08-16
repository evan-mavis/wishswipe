import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import logger from "./utils/logger.js";

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(getServiceAccount()),
});

const app = express();
const PORT = process.env.PORT || 3000;

// security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // disable for firebase auth compatibility
  })
);

// cors configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 1000 : 2000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// apply rate limiting to all requests
app.use(limiter);

// stricter rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 5 : 100,
  message: {
    error:
      "Too many login attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// base public route for health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// public routes (no authentication required)
app.use("/login", loginLimiter, loginRoutes);

// protect everything else under /wishswipe
app.use("/wishswipe", authenticateUser);

app.use("/wishswipe", baseRoutes);
app.use("/wishswipe/explore", exploreRoutes);
app.use("/wishswipe/wishlist", wishlistRoutes);
app.use("/wishswipe/wishlist-items", wishlistItemRoutes);
app.use("/wishswipe/preferences", preferencesRoutes);
app.use("/wishswipe/user-item-history", userItemHistoryRoutes);
app.use("/wishswipe/analytics", analyticsRoutes);
app.use("/wishswipe/maintenance", maintenanceRoutes);

app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully...");
  process.exit(0);
});

export default app;
