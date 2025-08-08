import { Router } from "express";
import { WishlistItemService } from "../services/wishlistItemService.js";
import { SearchSessionService } from "../services/searchSessionService.js";

const router = Router();

// POST /wishswipe/maintenance/refresh
router.post("/refresh", async (req: any, res) => {
  try {
    const userId = req.dbUser.id;
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
});

// POST /wishswipe/maintenance/reset-sessions
router.post("/reset-sessions", async (req: any, res) => {
  try {
    const userId = req.dbUser.id;
    await SearchSessionService.resetOldSessionsForUser(userId);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Reset sessions failed" });
  }
});

export default router;
