import { Request, Response } from "express";
import { getAnalyticsData } from "../services/analyticsService.js";
import logger from "../utils/logger.js";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.dbUser.id;
    const analyticsData = await getAnalyticsData(userId);

    res.json(analyticsData);
  } catch (error) {
    logger.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};
