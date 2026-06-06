import { createHash } from "crypto";
import type { SearchFilters } from "@/types/listing";

export function generateSearchHash(filters: SearchFilters) {
  const normalizedFilters = {
    query: filters.query || "trending",
    condition: filters.condition || "",
    category: filters.category || "",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
  };

  return createHash("sha256")
    .update(JSON.stringify(normalizedFilters))
    .digest("hex");
}
