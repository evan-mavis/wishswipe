import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import baseRoutes from "./routes/baseRoutes";
import * as admin from "firebase-admin";
import { authenticateUser } from "./middleware/auth";

// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
const PORT = 3000;

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
app.use("/wishswipe/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
