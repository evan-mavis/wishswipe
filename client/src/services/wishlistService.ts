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
