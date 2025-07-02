import type { Request, Response } from "express";
import { z } from "zod";
import * as wishlistItemRepo from "../db/repositories/wishlistItemRepository.js";
import * as wishlistRepo from "../db/repositories/wishlistRepository.js";

// Zod schema for adding item to wishlist
const addItemSchema = z.object({
  wishlistId: z.string().uuid("Invalid wishlist ID"),
  ebayItemId: z.string().min(1, "eBay item ID is required"),
  title: z.string().optional(),
  imageUrl: z.string().url().optional(),
  itemWebUrl: z.string().url().optional(),
  price: z.number().positive().optional(),
});

// Zod schema for removing items from wishlist
const removeItemsSchema = z.object({
  itemIds: z
    .array(z.number().int().positive("Invalid item ID"))
    .min(1, "At least one item ID required"),
});

export const addItemToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = addItemSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { wishlistId, ebayItemId, title, imageUrl, itemWebUrl, price } =
      parseResult.data;

    if (!req.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const newItem = await wishlistItemRepo.addItemToWishlist({
      wishlistId,
      ebayItemId,
      title,
      imageUrl,
      itemWebUrl,
      price,
    });

    res.status(201).json({ item: newItem });
  } catch (err) {
    console.error("Error adding item to wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

    if (!req.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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
    console.error("Error removing items from wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
