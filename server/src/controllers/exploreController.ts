import { Request, Response } from "express";
import { searchEbayItems } from "../services/ebayBrowseService.js";

export const getEbayListings = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || "trending";
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
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

    res.json(data);
  } catch (error) {
    console.error("eBay Browse API error:", error);
    res.status(500).json({ error: "Failed to fetch eBay listings" });
  }
};
