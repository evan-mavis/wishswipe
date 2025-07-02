import axiosInstance from "../interceptors/axiosInstance";
import type { SearchFilters } from "../types/listing";

export async function fetchListings(filters: SearchFilters = {}) {
	const params = new URLSearchParams();

	if (filters.query) params.append("query", filters.query);
	if (filters.condition) params.append("condition", filters.condition);
	if (filters.category) params.append("category", filters.category);
	if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
	if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

	const response = await axiosInstance.get(
		`/wishswipe/explore?${params.toString()}`
	);

	return response.data;
}
