import type { Request, Response } from "express";
import { z } from "zod";
import * as wishlistRepo from "../db/repositories/wishlistRepository.js";

// Zod schema for creating a new wishlist
const createWishlistSchema = z.object({
  name: z
    .string()
    .min(1, "Wishlist name is required")
    .max(255, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isFavorite: z.boolean().optional().default(false),
});

// Zod schema for reordering wishlists
const reorderWishlistsSchema = z.object({
  wishlistIds: z
    .array(z.string().uuid("Invalid wishlist ID"))
    .min(1, "At least one wishlist ID required"),
});

// Zod schema for deleting wishlists
const deleteWishlistsSchema = z.object({
  wishlistIds: z
    .array(z.string().uuid("Invalid wishlist ID"))
    .min(1, "At least one wishlist ID required"),
});

// Zod schema for adding item to wishlist
const addItemSchema = z.object({
  wishlistId: z.string().uuid("Invalid wishlist ID"),
  ebayItemId: z.string().min(1, "eBay item ID is required"),
  title: z.string().optional(),
  imageUrl: z.string().url().optional(),
  itemWebUrl: z.string().url().optional(),
  price: z.number().positive().optional(),
});

export const getWishlists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const wishlists = await wishlistRepo.findWishlistsWithItemsByUserId(
      req.dbUser.id
    );

    res.json({ wishlists });
  } catch (err) {
    console.error("Error fetching wishlists:", err);
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

    if (!req.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const newWishlist = await wishlistRepo.createWishlist({
      userId: req.dbUser.id,
      name,
      description,
      isFavorite,
    });

    res.status(201).json({ wishlist: newWishlist });
  } catch (err) {
    console.error("Error creating wishlist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

    const newItem = await wishlistRepo.addItemToWishlist({
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

    if (!req.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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
    console.error("Error deleting wishlists:", err);
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

    if (!req.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    await wishlistRepo.reorderWishlists(req.dbUser.id, wishlistIds);

    res.status(200).json({ message: "Wishlists reordered successfully" });
  } catch (err) {
    console.error("Error reordering wishlists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
