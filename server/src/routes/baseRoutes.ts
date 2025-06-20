import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Hello from the WishSwipe server!");
});

export default router;
