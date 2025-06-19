export interface Listing {
	id: number;
	imageUrl: string;
	details: ListingDetails;
}

export interface ListingDetails {
	title: string;
	seller: string;
	price: number;
	condition: string;
}

export interface WishList {
	id: string;
	title: string;
	description: string;
	items: Listing[];
	createdAt: Date;
	updatedAt: Date;
}
