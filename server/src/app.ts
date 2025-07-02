import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import admin, { getServiceAccount } from "./config/firebase.js";
import userRoutes from "./routes/userRoutes.js";
import baseRoutes from "./routes/baseRoutes.js";
import { authenticateUser } from "./middleware/auth.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import wishlistItemRoutes from "./routes/wishlistItemRoutes.js";

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

// protect everything under /wishswipe
app.use("/wishswipe", authenticateUser);

// all routes under /wishswipe are protected
app.use("/wishswipe", baseRoutes);
app.use("/wishswipe/user", userRoutes);
app.use("/wishswipe/explore", exploreRoutes);
app.use("/wishswipe/wishlist", wishlistRoutes);
app.use("/wishswipe/wishlist-items", wishlistItemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
