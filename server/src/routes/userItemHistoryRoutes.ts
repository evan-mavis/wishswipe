import express from "express";
import * as userItemHistoryController from "../controllers/userItemHistoryController.js";

const router = express.Router();

// record batch interactions
router.post("/batch", userItemHistoryController.recordBatchInteractions);

export default router;
