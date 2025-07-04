import { Request, Response } from "express";
import { z } from "zod";
import { searchEbayItems } from "../services/ebayBrowseService.js";
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
      res
        .status(400)
        .json({
          error: "Invalid query parameters",
          details: parseResult.error.flatten(),
        });
      return;
    }

    const { query, condition, category, minPrice, maxPrice } = parseResult.data;

    const data = await searchEbayItems(query, {
      condition,
      category,
      minPrice,
      maxPrice,
    });

    const simplifiedListings: SimplifiedListing[] = data.itemSummaries
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

    res.json({ listings: simplifiedListings });
  } catch (error) {
    console.error("eBay Browse API error:", error);
    res.status(500).json({ error: "Failed to fetch eBay listings" });
  }
};
