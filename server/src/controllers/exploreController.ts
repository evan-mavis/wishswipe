import { Request, Response } from "express";
import { searchEbayItems } from "../services/ebayBrowseService.js";
import { SimplifiedListing, SearchFilters } from "../types/ebay.js";

export const getEbayListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = (req.query.query as string) || "trending";
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 50;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;
    const condition = req.query.condition as string | undefined;
    const category = req.query.category as string | undefined;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;

    const data = await searchEbayItems(query, {
      limit,
      offset,
      condition,
      category,
      minPrice,
      maxPrice,
    });

    const simplifiedListings: SimplifiedListing[] = data.itemSummaries
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
      .slice(0, 10);

    res.json({ listings: simplifiedListings });
  } catch (error) {
    console.error("eBay Browse API error:", error);
    res.status(500).json({ error: "Failed to fetch eBay listings" });
  }
};
