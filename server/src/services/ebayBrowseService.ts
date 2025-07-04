import axios from "axios";
import { getEbayAccessToken } from "./ebayTokenService.js";
import { SearchFilters, EbaySearchResponse } from "../types/ebay.js";

export async function searchEbayItems(
  query: string,
  options: SearchFilters = {}
): Promise<EbaySearchResponse> {
  const accessToken = await getEbayAccessToken();

  const params = new URLSearchParams();
  params.append("q", query);
  params.append("limit", "50");
  params.append("offset", "0");

  if (options.category) params.append("category_ids", options.category);

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

  // Log the request URL for debugging
  console.log(
    `eBay API Request: ${
      process.env.EBAY_BASE_URL
    }/buy/browse/v1/item_summary/search?${params.toString()}`
  );

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
  }

  if (response.data && response.data.warnings) {
    console.warn(
      "eBay API warnings:",
      JSON.stringify(response.data.warnings, null, 2)
    );
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
