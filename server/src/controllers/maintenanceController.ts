import type { Request, Response } from "express";
import { WishlistItemService } from "../services/wishlistItemService.js";
import { SearchSessionService } from "../services/searchSessionService.js";

export const refreshMaintenance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).dbUser.id as string;
    const staleHours = parseInt(process.env.WISHLIST_STALE_HOURS || "24", 10);
    const maxItems = parseInt(process.env.WISHLIST_REFRESH_LIMIT || "60", 10);

    const availabilitySummary =
      await WishlistItemService.checkActiveItemsForUser(userId, {
        maxItemsToCheck: maxItems,
        staleAfterHours: staleHours,
      });

    res.json({ ok: true, availabilitySummary });
  } catch (error) {
    res.status(500).json({ error: "Maintenance refresh failed" });
  }
};

export const resetSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).dbUser.id as string;
    await SearchSessionService.resetOldSessionsForUser(userId);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Reset sessions failed" });
  }
};
