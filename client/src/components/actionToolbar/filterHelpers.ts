interface Filters {
	condition?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
}

export const getPriceDisplayName = (filters: Filters) => {
	// Treat maxPrice of 200 as "no upper limit"
	const effectiveMaxPrice =
		filters.maxPrice === 200 ? undefined : filters.maxPrice;

	if (filters.minPrice && effectiveMaxPrice) {
		return `$${filters.minPrice}-$${effectiveMaxPrice}`;
	} else if (filters.minPrice) {
		return `$${filters.minPrice}+`;
	} else if (effectiveMaxPrice) {
		return `Up to $${effectiveMaxPrice}`;
	}
	return "";
};
