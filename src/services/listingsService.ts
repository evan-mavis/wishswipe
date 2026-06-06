import type { SearchFilters } from "@/types/listing";

export async function fetchListings(
  filters: SearchFilters = {},
  isBackgroundFetch = false
) {
  const params = new URLSearchParams();

  if (filters.query) params.append("query", filters.query);
  if (filters.condition) params.append("condition", filters.condition);
  if (filters.category) params.append("category", filters.category);
  if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (isBackgroundFetch) params.append("background", "true");

  const response = await fetch(`/api/explore?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}
