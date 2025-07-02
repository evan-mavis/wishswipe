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

  if (options.limit) params.append("limit", options.limit.toString());
  if (options.offset) params.append("offset", options.offset.toString());
  if (options.category) params.append("category_ids", options.category);
  if (options.condition)
    params.append("filter", `conditionIds:{${options.condition}}`);

  if (options.minPrice || options.maxPrice) {
    let priceFilter = "";
    if (options.minPrice !== undefined && options.maxPrice !== undefined) {
      priceFilter = `price:[${options.minPrice}..${options.maxPrice}]`;
    } else if (options.minPrice !== undefined) {
      priceFilter = `price:[${options.minPrice}..]`;
    } else if (options.maxPrice !== undefined) {
      priceFilter = `price:[..${options.maxPrice}]`;
    }
    if (priceFilter) params.append("filter", priceFilter);
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

  return response.data;
}
