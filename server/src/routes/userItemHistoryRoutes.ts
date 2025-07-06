import express from "express";
import * as userItemHistoryController from "../controllers/userItemHistoryController.js";

const router = express.Router();

// Record batch interactions
router.post("/batch", userItemHistoryController.recordBatchInteractions);

// Get user history
router.get("/history", userItemHistoryController.getUserHistory);

// Get user analytics
router.get("/analytics", userItemHistoryController.getUserAnalytics);

export default router;
