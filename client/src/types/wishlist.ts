import type { Listing } from "./listing";

export interface WishList {
	id: string;
	title: string;
	description: string;
	items: Listing[];
	createdAt: Date;
	updatedAt: Date;
}
