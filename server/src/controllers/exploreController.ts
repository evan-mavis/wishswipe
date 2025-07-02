import { Request, Response } from "express";
import { searchEbayItems } from "../services/ebayBrowseService.js";
import { SimplifiedListing, SearchFilters } from "../types/ebay.js";

export const getEbayListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = (req.query.query as string) || "trending";

    const condition = req.query.condition as string | undefined;
    const category = req.query.category as string | undefined;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;

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
