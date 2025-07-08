import { Request, Response } from "express";
import { z } from "zod";
import { searchEbayItems } from "../services/ebayBrowseService.js";
import { SearchSessionService } from "../services/searchSessionService.js";
import { UserItemHistoryService } from "../services/userItemHistoryService.js";
import {
  SimplifiedListing,
  SearchFilters,
  EbayItemSummary,
} from "../types/ebay.js";
import { generateSearchHash } from "../utils/searchHashUtility.js";
import logger from "../utils/logger.js";

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
  background: z.string().optional(),
});

const EBAY_RESPONSE_LIMIT = 200;

export const getEbayListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // validate request
    const parseResult = exploreQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid query parameters",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const searchFilters: SearchFilters = parseResult.data;
    const searchHash = generateSearchHash(searchFilters);

    // get or create search session for this user and search
    const searchSession = await SearchSessionService.getOrCreateSession(
      req.dbUser.id,
      searchHash,
      searchFilters
    );

    let currentPage = searchSession.page_number;
    let currentOffset = (currentPage - 1) * EBAY_RESPONSE_LIMIT;
    let unseenListings: EbayItemSummary[] = [];
    let hasMoreItems = true;
    const maxAttempts = 5;
    let attempts = 0;

    // search eBay with pagination and filter unseen items
    while (
      unseenListings.length === 0 &&
      hasMoreItems &&
      attempts < maxAttempts
    ) {
      const data = await searchEbayItems(
        searchHash,
        searchFilters,
        currentOffset
      );

      if (!data.itemSummaries || data.itemSummaries.length === 0) {
        hasMoreItems = false;
        break;
      }

      unseenListings = await UserItemHistoryService.filterUnseenItems(
        req.dbUser.id,
        data.itemSummaries
      );

      // if this is a background fetch and we have very few unseen items, advance to next page
      // this prevents inefficient repeated calls for small batches
      if (
        parseResult.data.background === "true" &&
        unseenListings.length > 0 &&
        unseenListings.length < 10
      ) {
        currentPage += 1;
        currentOffset = (currentPage - 1) * EBAY_RESPONSE_LIMIT;
        await SearchSessionService.setNextPage(searchSession.id, currentPage);
      }

      if (unseenListings.length === 0) {
        currentPage += 1;
        currentOffset = (currentPage - 1) * EBAY_RESPONSE_LIMIT;
        await SearchSessionService.setNextPage(searchSession.id, currentPage);
        attempts++;
      }
    }

    const simplifiedListings: SimplifiedListing[] = unseenListings
      ? unseenListings.map((item) => ({
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
      : [];

    res.json({
      listings: simplifiedListings,
      pagination: {
        currentPage: currentPage,
        currentOffset: currentOffset,
        totalItemsSeen: searchSession.total_items_seen,
        searchSessionId: searchSession.id,
        hasMoreItems: hasMoreItems && attempts < maxAttempts,
      },
    });
  } catch (error) {
    logger.error("eBay Browse API error:", error);
    res.status(500).json({ error: "Failed to fetch eBay listings" });
  }
};
