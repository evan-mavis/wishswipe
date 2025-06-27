import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import baseRoutes from "./routes/baseRoutes.js";
import admin, { serviceAccount } from "./config/firebase.js";
import { authenticateUser } from "./middleware/auth.js";
import exploreRoutes from "./routes/exploreRoutes.js";

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
