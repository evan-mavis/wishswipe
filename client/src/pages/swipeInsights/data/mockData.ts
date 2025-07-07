// Mock data - replace with actual data from your backend
export const mockData = {
	swipeCounts: {
		right: 247,
		left: 189,
	},
	categoryFilters: [
		{ name: "Electronics", value: 45, color: "#a855f7" },
		{ name: "Clothing", value: 32, color: "#8b5cf6" },
		{ name: "Home & Garden", value: 28, color: "#3b82f6" },
		{ name: "Sports", value: 18, color: "#6366f1" },
		{ name: "Books", value: 12, color: "#7c3aed" },
	],
	conditionWishlist: [
		{ condition: "New", count: 23 },
		{ condition: "Used", count: 18 },
		{ condition: "Refurbished", count: 15 },
	],
	searchTerms: [
		{ term: "iPhone", count: 15 },
		{ term: "vintage camera", count: 12 },
		{ term: "guitar", count: 10 },
		{ term: "sneakers", count: 8 },
		{ term: "laptop", count: 7 },
		{ term: "watch", count: 6 },
	],
	priceDistribution: [
		{ range: "$0-25", avgPrice: 12.5 },
		{ range: "$26-50", avgPrice: 37.8 },
		{ range: "$51-75", avgPrice: 62.3 },
		{ range: "$76-100", avgPrice: 87.2 },
		{ range: "$101-150", avgPrice: 125.4 },
		{ range: "$151+", avgPrice: 189.7 },
	],
	wishlistStats: {
		largestWishlist: {
			name: "Electronics Collection",
			itemCount: 23,
		},
		priceStats: {
			average: 67.5,
			max: 299.99,
			min: 12.99,
		},
		totalItemsSaved: 156,
		avgSwipesPerSession: 42,
	},
};

// Chart configurations
export const categoryConfig = {
	Electronics: { color: "#a855f7" },
	Clothing: { color: "#8b5cf6" },
	"Home & Garden": { color: "#3b82f6" },
	Sports: { color: "#6366f1" },
	Books: { color: "#7c3aed" },
};

export const conditionConfig = {
	New: { color: "#a855f7" },
	Used: { color: "#c084fc" },
	Refurbished: { color: "#d8b4fe" },
};

export const searchConfig = {
	iPhone: { color: "#a855f7" },
	"vintage camera": { color: "#c084fc" },
	guitar: { color: "#d8b4fe" },
	sneakers: { color: "#e9d5ff" },
	laptop: { color: "#f3e8ff" },
	watch: { color: "#a855f7" },
};

export const priceConfig = {
	avgPrice: { color: "#a855f7" },
};
