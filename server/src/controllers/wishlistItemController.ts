import type { Request, Response } from "express";
import { z } from "zod";
import * as wishlistItemRepo from "../db/repositories/wishlistItemRepository.js";
import * as wishlistRepo from "../db/repositories/wishlistRepository.js";
import logger from "../utils/logger.js";

// zod schema for removing items from wishlist
const removeItemsSchema = z.object({
  itemIds: z
    .array(z.string().uuid("Invalid item ID"))
    .min(1, "At least one item ID required"),
});

// zod schema for reordering wishlist items
const reorderItemsSchema = z.object({
  itemIds: z
    .array(z.string().uuid("Invalid item ID"))
    .min(1, "At least one item ID required"),
});

export const removeItemsFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = removeItemsSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { itemIds } = parseResult.data;

    const removedCount = await wishlistRepo.removeItemsFromWishlist(
      itemIds,
      req.dbUser.id
    );

    if (removedCount > 0) {
      res.status(200).json({
        message: `${removedCount} item(s) removed successfully`,
        removedCount,
      });
    } else {
      res.status(404).json({ error: "No items found or access denied" });
    }
  } catch (err) {
    logger.error("Error removing items from wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reorderWishlistItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = reorderItemsSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { itemIds } = parseResult.data;

    await wishlistRepo.reorderWishlistItems(req.dbUser.id, itemIds);

    res.status(200).json({ message: "Wishlist items reordered successfully" });
  } catch (err) {
    logger.error("Error reordering wishlist items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
