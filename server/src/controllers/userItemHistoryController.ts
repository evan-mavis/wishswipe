import { Request, Response } from "express";
import { z } from "zod";
import { UserItemHistoryService } from "../services/userItemHistoryService.js";
import { PaginationService } from "../services/paginationService.js";
import * as wishlistItemRepo from "../db/repositories/wishlistItemRepository.js";

const batchInteractionSchema = z.object({
  interactions: z.array(
    z.object({
      itemId: z.string(),
      action: z.enum(["left", "right"]),
      searchQuery: z.string(),
      conditionFilter: z.string().optional(),
      categoryFilter: z.string().optional(),
      priceMin: z.number().optional(),
      priceMax: z.number().optional(),
      price: z.number(),
      wishlistId: z.string().uuid("Invalid wishlist ID").optional(),
      title: z.string().optional(),
      imageUrl: z.string().url().optional(),
      itemWebUrl: z.string().url().optional(),
      sellerFeedbackScore: z.number().int().nonnegative().optional(),
    })
  ),
  searchSessionId: z.string().nullable().optional(), // Allow null values
});

export const recordBatchInteractions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = batchInteractionSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request data",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { interactions, searchSessionId } = parseResult.data;

    // Update session progress if search session ID is provided
    // Note: We don't increment offset here since we're not fetching new items from eBay
    if (searchSessionId && searchSessionId !== null) {
      try {
        await PaginationService.updateSessionProgress(
          parseInt(searchSessionId),
          interactions.length,
          false // Don't increment offset, just update items seen
        );
      } catch (error) {
        console.error("Failed to update session progress:", error);
        // Continue processing interactions even if session update fails
      }
    }

    // Record each interaction and handle wishlist additions
    for (const interaction of interactions) {
      await UserItemHistoryService.recordItemInteraction(
        req.dbUser.id,
        interaction.itemId,
        interaction.action,
        interaction.searchQuery,
        interaction.conditionFilter,
        interaction.categoryFilter,
        interaction.priceMin,
        interaction.priceMax,
        interaction.price
      );

      // If it's a right swipe and has wishlist data, add to wishlist
      if (interaction.action === "right" && interaction.wishlistId) {
        try {
          await wishlistItemRepo.addItemToWishlist({
            wishlistId: interaction.wishlistId,
            ebayItemId: interaction.itemId,
            title: interaction.title,
            imageUrl: interaction.imageUrl,
            itemWebUrl: interaction.itemWebUrl,
            price: interaction.price,
            sellerFeedbackScore: interaction.sellerFeedbackScore,
          });
        } catch (error) {
          console.error(
            `Failed to add item ${interaction.itemId} to wishlist:`,
            error
          );
          // Continue processing other interactions even if one wishlist addition fails
        }
      }
    }

    res.json({
      message: `Successfully recorded ${interactions.length} interactions`,
      recordedCount: interactions.length,
    });
  } catch (error) {
    console.error("Error recording batch interactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const history = await UserItemHistoryService.getUserHistory(
      req.dbUser.id,
      limit,
      offset
    );

    res.json({ history });
  } catch (error) {
    console.error("Error getting user history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await UserItemHistoryService.getUserAnalytics(
      req.dbUser.id
    );

    res.json({ analytics });
  } catch (error) {
    console.error("Error getting user analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
