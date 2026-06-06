"use client";

import {
  createWishlistAction,
  deleteWishlistsAction,
  moveItemsToWishlistAction,
  removeItemsFromWishlistAction,
  reorderWishlistItemsAction,
  reorderWishlistsAction,
  updateWishlistAction,
} from "@/app/actions/wishlists";
import type { AvailabilityStatus, WishList } from "@/types/wishlist";

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

export interface WishlistOption {
  id: string;
  name: string;
  isFavorite: boolean;
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
    availabilityStatus: AvailabilityStatus;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MoveItemsRequest {
  itemIds: string[];
  targetWishlistId: string;
}

export async function fetchWishlists(): Promise<WishList[]> {
  const response = await fetch("/api/wishlists", {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch wishlists");
  const data = (await response.json()) as { wishlists: WishList[] };
  return data.wishlists;
}

export async function fetchWishlistOptions(): Promise<WishlistOption[]> {
  const response = await fetch("/api/wishlists/options", {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch wishlist options");
  const data = (await response.json()) as { wishlists: WishlistOption[] };
  return data.wishlists;
}

export async function createWishlist(data: CreateWishlistRequest): Promise<WishList> {
  return createWishlistAction(data);
}

export async function updateWishlist(
  wishlistId: string,
  data: UpdateWishlistRequest
): Promise<WishList> {
  const wishlist = await updateWishlistAction(wishlistId, data);
  if (!wishlist) throw new Error("Wishlist not found");
  return {
    ...wishlist,
    description: wishlist.description ?? undefined,
    items: [],
    itemCount: 0,
  };
}

export async function deleteWishlists(wishlistIds: string[]) {
  await deleteWishlistsAction(wishlistIds);
}

export async function reorderWishlists(wishlistIds: string[]) {
  await reorderWishlistsAction(wishlistIds);
}

export async function reorderWishlistItems(itemIds: string[]) {
  await reorderWishlistItemsAction(itemIds);
}

export async function removeItemsFromWishlist(itemIds: string[]) {
  await removeItemsFromWishlistAction(itemIds);
}

export async function moveItemsToWishlist(data: MoveItemsRequest) {
  const movedCount = await moveItemsToWishlistAction(
    data.itemIds,
    data.targetWishlistId
  );
  return { message: `${movedCount} item(s) moved successfully`, movedCount };
}
