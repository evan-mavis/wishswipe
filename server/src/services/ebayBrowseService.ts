import axios from "axios";
import { getEbayAccessToken } from "./ebayTokenService.js";
import {
  SearchFilters,
  EbaySearchResponse,
  EbayItemSummary,
} from "../types/ebay.js";
import redis from "../utils/redisClient.js";

export async function searchEbayItems(
  searchHash: string,
  searchFilters: SearchFilters = {},
  offset: number = 0
): Promise<EbaySearchResponse> {
  // check if we have cached results
  const cacheKey = `${searchHash}:${offset}`;
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const accessToken = await getEbayAccessToken();

  const params = new URLSearchParams();
  params.append("q", searchFilters.query || "");
  params.append("limit", "200");
  params.append("offset", offset.toString());

  if (searchFilters.category && searchFilters.category !== "No Selection") {
    const categoryId = mapCategoryToId(searchFilters.category);
    if (categoryId) {
      params.append("category_ids", categoryId);
    }
  }

  const filters: string[] = [];

  if (searchFilters.condition) {
    const conditionIds = mapCondition(searchFilters.condition);
    if (conditionIds) {
      filters.push(`conditionIds:{${conditionIds}}`);
    }
  }

  if (searchFilters.minPrice || searchFilters.maxPrice) {
    let priceFilter = "";
    // If max price is 200, ignore it and only use min price
    const effectiveMaxPrice =
      searchFilters.maxPrice === 200 ? undefined : searchFilters.maxPrice;

    if (
      searchFilters.minPrice !== undefined &&
      effectiveMaxPrice !== undefined
    ) {
      priceFilter = `price:[${searchFilters.minPrice}..${effectiveMaxPrice}],priceCurrency:USD`;
    } else if (searchFilters.minPrice !== undefined) {
      priceFilter = `price:[${searchFilters.minPrice}..],priceCurrency:USD`;
    } else if (effectiveMaxPrice !== undefined) {
      priceFilter = `price:[..${effectiveMaxPrice}],priceCurrency:USD`;
    }
    if (priceFilter) filters.push(priceFilter);
  }

  // Combine all filters into a single filter parameter
  if (filters.length > 0) {
    params.append("filter", filters.join(","));
  }

  const response = await axios.get(
    `${
      process.env.EBAY_BASE_URL
    }/buy/browse/v1/item_summary/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data && response.data.errors) {
    console.error(
      "eBay API errors:",
      JSON.stringify(response.data.errors, null, 2)
    );
    // Don't cache error responses
    return response.data;
  }

  if (response.data && response.data.warnings) {
    console.warn(
      "eBay API warnings:",
      JSON.stringify(response.data.warnings, null, 2)
    );
  }

  // Filter out items without images
  if (response.data && response.data.itemSummaries) {
    response.data.itemSummaries = response.data.itemSummaries.filter(
      (item: EbayItemSummary) => item.image?.imageUrl
    );
  }

  // Only cache successful responses with items
  if (
    response.data &&
    response.data.itemSummaries &&
    response.data.itemSummaries.length > 0
  ) {
    try {
      const cacheExpiry = 2400; // 40 minutes
      await redis.setex(cacheKey, cacheExpiry, JSON.stringify(response.data));
    } catch (cacheError) {
      console.error("Failed to cache results:", cacheError);
    }
  }

  return response.data;
}

function mapCondition(conditionId: string): string {
  switch (conditionId) {
    case "new":
      return "1000|1500|1750"; // New, New other, New with defects
    case "used":
      return "2750|3000|4000|5000|6000"; // Like New, Used, Very Good, Good, Acceptable
    case "refurbished":
      return "2000|2500"; // Certified Refurbished, Seller Refurbished (using more common ones)
    default:
      return "";
  }
}

function mapCategoryToId(categoryLabel: string): string {
  switch (categoryLabel) {
    case "Clothing, Shoes & Accessories":
      return "11450";
    case "Health & Beauty":
      return "26395";
    case "Toys & Hobbies":
      return "220";
    case "Books & Magazines":
      return "267";
    case "Jewelry & Watches":
      return "281";
    case "Consumer Electronics":
      return "293";
    case "Musical Instruments & Gear":
      return "619";
    case "Cameras & Photo":
      return "625";
    case "Pottery & Glass":
      return "870";
    case "Sporting Goods":
      return "888";
    case "Video Games & Consoles":
      return "1249";
    case "Travel":
      return "3252";
    case "Home & Garden":
      return "11700";
    case "Everything Else...":
      return "99";
    default:
      return "";
  }
}
