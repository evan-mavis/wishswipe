import type { Request, Response } from "express";
import { z } from "zod";
import * as wishlistRepo from "../db/repositories/wishlistRepository.js";
import logger from "../utils/logger.js";

// zod schema for creating a new wishlist
const createWishlistSchema = z.object({
  name: z
    .string()
    .min(1, "Wishlist name is required")
    .max(255, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isFavorite: z.boolean().optional().default(false),
});

// zod schema for updating a wishlist
const updateWishlistSchema = z.object({
  name: z
    .string()
    .min(1, "Wishlist name is required")
    .max(255, "Name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  isFavorite: z.boolean().optional(),
});

// zod schema for reordering wishlists
const reorderWishlistsSchema = z.object({
  wishlistIds: z
    .array(z.string().uuid("Invalid wishlist ID"))
    .min(1, "At least one wishlist ID required"),
});

// zod schema for deleting wishlists
const deleteWishlistsSchema = z.object({
  wishlistIds: z
    .array(z.string().uuid("Invalid wishlist ID"))
    .min(1, "At least one wishlist ID required"),
});

// zod schema for moving items between wishlists
const moveItemsSchema = z.object({
  itemIds: z
    .array(z.string().uuid("Invalid item ID"))
    .min(1, "At least one item ID required"),
  targetWishlistId: z.string().uuid("Invalid target wishlist ID"),
});

export const getWishlists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const wishlists = await wishlistRepo.findWishlistsWithItemsByUserId(
      req.dbUser.id
    );

    res.json({ wishlists });
  } catch (err) {
    logger.error("Error fetching wishlists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = createWishlistSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });

      return;
    }

    const { name, description, isFavorite } = parseResult.data;

    const newWishlist = await wishlistRepo.createWishlist({
      userId: req.dbUser.id,
      name,
      description,
      isFavorite,
    });

    res.status(201).json({ wishlist: newWishlist });
  } catch (err) {
    logger.error("Error creating wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteWishlists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = deleteWishlistsSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { wishlistIds } = parseResult.data;

    const deletedCount = await wishlistRepo.deleteWishlists(
      wishlistIds,
      req.dbUser.id
    );

    if (deletedCount > 0) {
      res.status(200).json({
        message: `${deletedCount} wishlist(s) deleted successfully`,
        deletedCount,
      });
    } else {
      res.status(404).json({ error: "No wishlists found or access denied" });
    }
  } catch (err) {
    logger.error("Error deleting wishlists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reorderWishlists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = reorderWishlistsSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { wishlistIds } = parseResult.data;

    await wishlistRepo.reorderWishlists(req.dbUser.id, wishlistIds);

    res.status(200).json({ message: "Wishlists reordered successfully" });
  } catch (err) {
    logger.error("Error reordering wishlists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = updateWishlistSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { name, description, isFavorite } = parseResult.data;
    const { wishlistId } = req.params;

    // check if at least one field is being updated
    if (!name && description === undefined && isFavorite === undefined) {
      res.status(400).json({
        error:
          "At least one field (name, description, or isFavorite) must be provided",
      });

      return;
    }

    const updatedWishlist = await wishlistRepo.updateWishlist(
      wishlistId,
      req.dbUser.id,
      { name, description, isFavorite }
    );

    if (!updatedWishlist) {
      res.status(404).json({ error: "Wishlist not found or access denied" });
      return;
    }

    res.json({ wishlist: updatedWishlist });
  } catch (err) {
    logger.error("Error updating wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWishlistOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const wishlists = await wishlistRepo.findWishlistsByUserId(req.dbUser.id);

    const options = wishlists.map((wishlist) => ({
      id: wishlist.id,
      name: wishlist.name,
      isFavorite: wishlist.isFavorite,
    }));

    res.json({ wishlists: options });
  } catch (err) {
    logger.error("Error fetching wishlist options:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const moveItemsToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = moveItemsSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { itemIds, targetWishlistId } = parseResult.data;

    const movedCount = await wishlistRepo.moveItemsToWishlist(
      itemIds,
      targetWishlistId,
      req.dbUser.id
    );

    if (movedCount > 0) {
      res.status(200).json({
        message: `${movedCount} item(s) moved successfully`,
        movedCount,
      });
    } else {
      res.status(404).json({ error: "No items found or access denied" });
    }
  } catch (err) {
    logger.error("Error moving items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
