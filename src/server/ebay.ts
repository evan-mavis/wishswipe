import "server-only";

import axios from "axios";
import { cacheGet, cacheSetEx } from "@/lib/cache";
import type {
  EbayItemDetails,
  EbayItemResult,
  EbayItemSummary,
  EbaySearchResponse,
  SearchFilters,
} from "@/types/ebay";

export async function getEbayAccessToken() {
  const cachedToken = await cacheGet("ebay_access_token");
  if (cachedToken) return cachedToken;

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  const baseUrl = process.env.EBAY_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error("eBay environment variables are required");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("scope", "https://api.ebay.com/oauth/api_scope");

  const result = await axios.post(`${baseUrl}/identity/v1/oauth2/token`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
  });

  const token = result.data.access_token;
  const expiresIn = result.data.expires_in || 7200;
  await cacheSetEx("ebay_access_token", expiresIn - 60, token);

  return token;
}

export async function searchEbayItems(
  searchHash: string,
  searchFilters: SearchFilters = {},
  offset = 0
): Promise<EbaySearchResponse> {
  const cacheKey = `ebay:search:${searchHash}:${offset}`;
  const cachedResult = await cacheGet(cacheKey);
  if (cachedResult) return JSON.parse(cachedResult) as EbaySearchResponse;

  const accessToken = await getEbayAccessToken();
  const baseUrl = process.env.EBAY_BASE_URL;
  if (!baseUrl) throw new Error("EBAY_BASE_URL is required");

  const params = new URLSearchParams();
  params.append("q", searchFilters.query || "trending");
  params.append("limit", "200");
  params.append("offset", offset.toString());

  if (searchFilters.category && searchFilters.category !== "No Selection") {
    const categoryId = mapCategoryToId(searchFilters.category);
    if (categoryId) params.append("category_ids", categoryId);
  }

  const filters: string[] = [];

  if (searchFilters.condition) {
    const conditionIds = mapCondition(searchFilters.condition);
    if (conditionIds) filters.push(`conditionIds:{${conditionIds}}`);
  }

  if (searchFilters.minPrice || searchFilters.maxPrice) {
    let priceFilter = "";
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

  if (filters.length > 0) {
    params.append("filter", filters.join(","));
  }

  const response = await axios.get(
    `${baseUrl}/buy/browse/v1/item_summary/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data?.itemSummaries) {
    response.data.itemSummaries = response.data.itemSummaries.filter(
      (item: EbayItemSummary) => item.image?.imageUrl
    );
  }

  if (response.data?.itemSummaries?.length > 0) {
    await cacheSetEx(cacheKey, 2400, JSON.stringify(response.data));
  }

  return response.data;
}

export async function getItemDetails(itemId: string): Promise<EbayItemResult> {
  const accessToken = await getEbayAccessToken();
  const baseUrl = process.env.EBAY_BASE_URL;
  if (!baseUrl) throw new Error("EBAY_BASE_URL is required");

  try {
    const response = await axios.get(`${baseUrl}/buy/browse/v1/item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true, data: response.data as EbayItemDetails };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: `Item ${itemId} not found or no longer available`,
      };
    }

    throw error;
  }
}

function mapCondition(conditionId: string) {
  switch (conditionId) {
    case "New":
      return "1000|1500|1750";
    case "Used":
      return "2750|3000|4000|5000|6000";
    case "Refurbished":
      return "2000|2500";
    default:
      return "";
  }
}

function mapCategoryToId(categoryLabel: string) {
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
