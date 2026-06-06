export type AvailabilityStatus =
	| "NOT_FOUND"
	| "ENDED"
	| "OUT_OF_STOCK"
	| "LIMITED_STOCK"
	| "IN_STOCK"
	| "UNKNOWN_AVAILABILITY";

export interface WishlistItem {
	id: string;
	wishlistId: string;
	ebayItemId: string;
	title?: string;
	imageUrl?: string;
	itemWebUrl?: string;
	price?: number;
	sellerFeedbackScore?: number;
	orderIndex: number;
	availabilityStatus: AvailabilityStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface WishList {
	id: string;
	name: string;
	description?: string;
	isFavorite: boolean;
	orderIndex: number;
	items: WishlistItem[];
	itemCount?: number;
	createdAt: Date;
	updatedAt: Date;
}
