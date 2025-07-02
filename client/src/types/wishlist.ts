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
	isActive: boolean;
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
