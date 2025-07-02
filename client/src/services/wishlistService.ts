import axiosInstance from "../interceptors/axiosInstance";
import type { WishList } from "../types/wishlist";

export interface CreateWishlistRequest {
	name: string;
	description?: string;
	isFavorite?: boolean;
}

export interface UpdateWishlistRequest {
	name?: string;
	description?: string;
	isFavorite?: boolean;
}

export interface WishlistResponse {
	wishlists: WishList[];
}

export interface SingleWishlistResponse {
	wishlist: WishList;
}

export interface WishlistOption {
	id: string;
	name: string;
	isFavorite: boolean;
}

export interface WishlistOptionsResponse {
	wishlists: WishlistOption[];
}

export interface AddItemToWishlistRequest {
	wishlistId: string;
	ebayItemId: string;
	title?: string;
	imageUrl?: string;
	itemWebUrl?: string;
	price?: number;
	sellerFeedbackScore?: number;
}

export interface WishlistItemResponse {
	item: {
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
		createdAt: string;
		updatedAt: string;
	};
}

export async function fetchWishlists(): Promise<WishList[]> {
	const response = await axiosInstance.get<WishlistResponse>(
		"/wishswipe/wishlist"
	);
	return response.data.wishlists;
}

export async function createWishlist(
	data: CreateWishlistRequest
): Promise<WishList> {
	const response = await axiosInstance.post<SingleWishlistResponse>(
		"/wishswipe/wishlist",
		data
	);
	return response.data.wishlist;
}

export async function updateWishlist(
	wishlistId: string,
	data: UpdateWishlistRequest
): Promise<WishList> {
	const response = await axiosInstance.patch<SingleWishlistResponse>(
		`/wishswipe/wishlist/${wishlistId}`,
		data
	);
	return response.data.wishlist;
}

export async function deleteWishlists(wishlistIds: string[]): Promise<void> {
	await axiosInstance.delete("/wishswipe/wishlist", {
		data: { wishlistIds },
	});
}

export async function reorderWishlists(wishlistIds: string[]): Promise<void> {
	await axiosInstance.patch("/wishswipe/wishlist/reorder", {
		wishlistIds,
	});
}

export async function fetchWishlistOptions(): Promise<WishlistOption[]> {
	const response = await axiosInstance.get<WishlistOptionsResponse>(
		"/wishswipe/wishlist/options"
	);
	return response.data.wishlists;
}

export async function addItemToWishlist(
	data: AddItemToWishlistRequest
): Promise<WishlistItemResponse["item"]> {
	const response = await axiosInstance.post<WishlistItemResponse>(
		"/wishswipe/wishlist-items",
		data
	);
	return response.data.item;
}

export async function reorderWishlistItems(itemIds: string[]): Promise<void> {
	await axiosInstance.patch("/wishswipe/wishlist-items/reorder", {
		itemIds,
	});
}

export async function removeItemsFromWishlist(
	itemIds: string[]
): Promise<void> {
	await axiosInstance.delete("/wishswipe/wishlist-items", {
		data: { itemIds },
	});
}
