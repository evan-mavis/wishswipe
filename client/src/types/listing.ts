export interface Listing {
	id: string;
	itemId: string;
	title: string;
	price: {
		value: string;
		currency: string;
	};
	condition: string;
	itemWebUrl: string;
	imageUrl?: string;
	sellerFeedbackScore: number;
}

export interface SearchFilters {
	query?: string;
	condition?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	limit?: number;
	offset?: number;
}
