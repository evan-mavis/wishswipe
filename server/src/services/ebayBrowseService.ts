import axios from "axios";
import { getEbayAccessToken } from "./ebayTokenService.js";
import { SearchFilters, EbaySearchResponse } from "../types/ebay.js";
import redis from "../utils/redisClient.js";

export async function searchEbayItems(
  query: string,
  options: SearchFilters = {},
  offset: number = 0
): Promise<EbaySearchResponse> {
  // Create cache key based on query, filters, and offset
  const cacheKey = generateCacheKey(query, options, offset);

  // Try to get cached results first
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const accessToken = await getEbayAccessToken();

  const params = new URLSearchParams();
  params.append("q", query);
  params.append("limit", "200"); // Use max limit for better caching
  params.append("offset", offset.toString());

  if (options.category && options.category !== "none") {
    params.append("category_ids", options.category);
  }

  // Build filters array and combine them
  const filters: string[] = [];

  if (options.condition) {
    const conditionIds = mapCondition(options.condition);
    if (conditionIds) {
      filters.push(`conditionIds:{${conditionIds}}`);
    }
  }

  if (options.minPrice || options.maxPrice) {
    let priceFilter = "";
    // If max price is 200, ignore it and only use min price
    const effectiveMaxPrice =
      options.maxPrice === 200 ? undefined : options.maxPrice;

    if (options.minPrice !== undefined && effectiveMaxPrice !== undefined) {
      priceFilter = `price:[${options.minPrice}..${effectiveMaxPrice}],priceCurrency:USD`;
    } else if (options.minPrice !== undefined) {
      priceFilter = `price:[${options.minPrice}..],priceCurrency:USD`;
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

  // Only cache successful responses with items
  if (
    response.data &&
    response.data.itemSummaries &&
    response.data.itemSummaries.length > 0
  ) {
    try {
      const cacheExpiry = 1800; // 30 minutes
      await redis.setex(cacheKey, cacheExpiry, JSON.stringify(response.data));
      console.log(`Cached results for key: ${cacheKey}`);
    } catch (cacheError) {
      console.error("Failed to cache results:", cacheError);
      // Continue without caching if Redis fails
    }
  }

  return response.data;
}

function generateCacheKey(
  query: string,
  options: SearchFilters,
  offset: number = 0
): string {
  const filterString = JSON.stringify({
    condition: options.condition || "none",
    category: options.category || "none",
    minPrice: options.minPrice || 0,
    maxPrice: options.maxPrice || 200,
    offset: offset,
  });

  return `ebay:search:${query}:${filterString}`;
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
