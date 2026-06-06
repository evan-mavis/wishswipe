"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import {
  createWishlist,
  deleteWishlists,
  moveItemsToWishlist,
  removeItemsFromWishlist,
  reorderWishlistItems,
  reorderWishlists,
  updateWishlist,
} from "@/server/wishlists";

const createWishlistSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(500).optional(),
  isFavorite: z.boolean().optional(),
});

const updateWishlistSchema = createWishlistSchema.partial().extend({
  isFavorite: z.boolean().optional(),
});

function revalidateWishlistViews() {
  revalidatePath("/swipe");
  revalidatePath("/wishlists");
  revalidatePath("/insights");
}

export async function createWishlistAction(input: unknown) {
  const user = await requireUser();
  const data = createWishlistSchema.parse(input);
  const wishlist = await createWishlist(user.id, data);
  revalidateWishlistViews();
  return wishlist;
}

export async function updateWishlistAction(wishlistId: string, input: unknown) {
  const user = await requireUser();
  const data = updateWishlistSchema.parse(input);
  const wishlist = await updateWishlist(user.id, wishlistId, data);
  revalidateWishlistViews();
  return wishlist;
}

export async function deleteWishlistsAction(wishlistIds: string[]) {
  const user = await requireUser();
  const count = await deleteWishlists(user.id, wishlistIds);
  revalidateWishlistViews();
  return count;
}

export async function reorderWishlistsAction(wishlistIds: string[]) {
  const user = await requireUser();
  await reorderWishlists(user.id, wishlistIds);
  revalidateWishlistViews();
}

export async function reorderWishlistItemsAction(itemIds: string[]) {
  const user = await requireUser();
  await reorderWishlistItems(user.id, itemIds);
  revalidateWishlistViews();
}

export async function removeItemsFromWishlistAction(itemIds: string[]) {
  const user = await requireUser();
  const count = await removeItemsFromWishlist(user.id, itemIds);
  revalidateWishlistViews();
  return count;
}

export async function moveItemsToWishlistAction(
  itemIds: string[],
  targetWishlistId: string
) {
  const user = await requireUser();
  const count = await moveItemsToWishlist(user.id, itemIds, targetWishlistId);
  revalidateWishlistViews();
  return count;
}
