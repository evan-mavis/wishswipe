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
}

export interface ExplorePagination {
	currentPage: number;
	currentOffset: number;
	totalItemsSeen: number;
	searchSessionId: number;
	hasMoreItems: boolean;
}

export interface ExploreListingsResponse {
	listings: Listing[];
	pagination: ExplorePagination;
}
