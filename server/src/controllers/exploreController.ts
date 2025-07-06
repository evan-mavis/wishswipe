import { Request, Response } from "express";
import { z } from "zod";
import { searchEbayItems } from "../services/ebayBrowseService.js";
import { PaginationService } from "../services/paginationService.js";
import { UserItemHistoryService } from "../services/userItemHistoryService.js";
import { SimplifiedListing, SearchFilters } from "../types/ebay.js";

const exploreQuerySchema = z.object({
  query: z.string().optional().default("trending"),
  condition: z.string().optional(),
  category: z.string().optional(),
  minPrice: z
    .string()
    .regex(/^\d*\.?\d+$/, "Invalid price format")
    .transform((val) => parseFloat(val))
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d*\.?\d+$/, "Invalid price format")
    .transform((val) => parseFloat(val))
    .optional(),
});

export const getEbayListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = exploreQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid query parameters",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { query, condition, category, minPrice, maxPrice } = parseResult.data;

    // Get or create search session for this user and search
    const searchSession = await PaginationService.getOrCreateSession(
      req.dbUser.id,
      query,
      {
        condition,
        category,
        minPrice,
        maxPrice,
      }
    );

    // Get the current offset for this session
    const currentOffset = await PaginationService.getCurrentOffset(
      searchSession.id
    );

    // Search eBay with pagination
    const data = await searchEbayItems(
      query,
      {
        condition,
        category,
        minPrice,
        maxPrice,
      },
      currentOffset
    );

    // Transform and filter items
    let simplifiedListings: SimplifiedListing[] = data.itemSummaries
      ? data.itemSummaries
          .map((item) => ({
            itemId: item.itemId,
            title: item.title,
            price: {
              value: item.price.value,
              currency: item.price.currency,
            },
            condition: item.condition,
            itemWebUrl: item.itemWebUrl,
            imageUrl: item.image?.imageUrl,
            sellerFeedbackScore: item.seller.feedbackScore,
          }))
          .filter((item) => item.imageUrl)
      : [];

    // Filter out items the user has already seen
    const unseenItems = await UserItemHistoryService.filterUnseenItems(
      req.dbUser.id,
      simplifiedListings
    );

    // Update session progress with items we're about to show
    if (unseenItems.length > 0) {
      await PaginationService.updateSessionProgress(
        searchSession.id,
        unseenItems.length
      );
    }

    res.json({
      listings: unseenItems,
      pagination: {
        currentOffset: currentOffset,
        totalItemsSeen: searchSession.total_items_seen,
        sessionId: searchSession.id,
        hasMoreItems: data.itemSummaries && data.itemSummaries.length === 200,
      },
    });
  } catch (error) {
    console.error("eBay Browse API error:", error);
    res.status(500).json({ error: "Failed to fetch eBay listings" });
  }
};
