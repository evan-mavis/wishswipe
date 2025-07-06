import { SearchFilters } from "../types/ebay.js";
import crypto from "crypto";

export function generateSearchHash(searchFilters: SearchFilters): string {
  const filterString = JSON.stringify({
    query: searchFilters.query,
    condition: searchFilters.condition || "none",
    category: searchFilters.category || "none",
    minPrice: searchFilters.minPrice || 0,
    maxPrice: searchFilters.maxPrice || 200,
  });

  return `ebay:search:${crypto
    .createHash("sha256")
    .update(filterString)
    .digest("hex")}`;
}
