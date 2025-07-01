import { Request, Response } from "express";
import { searchEbayItems } from "../services/ebayBrowseService.js";
import * as ebayBrowseService from "../services/ebayBrowseService.js";

const listings = [
  {
    id: 1,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
      seller: "TechDeals_USA",
      price: 1999.99,
      condition: "New",
    },
  },
  {
    id: 2,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "PS5 Digital Edition with DualSense Controller",
      seller: "GameStop_Official",
      price: 499.99,
      condition: "New",
    },
  },
  {
    id: 3,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
      seller: "ElectronicsHub",
      price: 1299.99,
      condition: "New",
    },
  },
  {
    id: 4,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
      seller: "TechDeals_USA",
      price: 1999.99,
      condition: "New",
    },
  },
  {
    id: 5,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "PS5 Digital Edition with DualSense Controller",
      seller: "GameStop_Official",
      price: 499.99,
      condition: "New",
    },
  },
  {
    id: 6,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
      seller: "ElectronicsHub",
      price: 1299.99,
      condition: "New",
    },
  },
  {
    id: 7,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
      seller: "TechDeals_USA",
      price: 1999.99,
      condition: "New",
    },
  },
  {
    id: 8,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "PS5 Digital Edition with DualSense Controller",
      seller: "GameStop_Official",
      price: 499.99,
      condition: "New",
    },
  },
  {
    id: 9,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
      seller: "ElectronicsHub",
      price: 1299.99,
      condition: "New",
    },
  },
];

export const getListings = (req: Request, res: Response) => {
  res.json({ listings });
};

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
