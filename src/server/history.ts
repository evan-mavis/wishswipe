import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { userItemHistory } from "@/db/schema";
import { addItemToWishlist } from "./wishlists";
import type { EbayItemSummary } from "@/types/ebay";

export type SwipeAction = "left" | "right";

export interface UserInteractionInput {
  itemId: string;
  action: SwipeAction;
  searchQuery: string;
  conditionFilter?: string;
  categoryFilter?: string;
  priceMin?: number;
  priceMax?: number;
  price: number;
  wishlistId?: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  sellerFeedbackScore?: number;
}

export async function filterUnseenItems(userId: string, items: EbayItemSummary[]) {
  if (items.length === 0) return [];

  const rows = await db
    .select({ itemId: userItemHistory.itemId })
    .from(userItemHistory)
    .where(
      and(
        eq(userItemHistory.userId, userId),
        inArray(
          userItemHistory.itemId,
          items.map((item) => item.itemId)
        ),
        sql`${userItemHistory.createdAt} >= now() - interval '14 days'`
      )
    );

  const seenItemIds = new Set(rows.map((row) => row.itemId));
  return items.filter((item) => !seenItemIds.has(item.itemId));
}

export async function recordInteraction(
  userId: string,
  interaction: UserInteractionInput
) {
  await db.insert(userItemHistory).values({
    userId,
    itemId: interaction.itemId,
    action: interaction.action,
    searchQuery: interaction.searchQuery || null,
    conditionFilter: interaction.conditionFilter || null,
    categoryFilter: interaction.categoryFilter || null,
    priceMin: interaction.priceMin === undefined ? null : String(interaction.priceMin),
    priceMax: interaction.priceMax === undefined ? null : String(interaction.priceMax),
    price: String(interaction.price),
  });

  if (interaction.action === "right" && interaction.wishlistId) {
    await addItemToWishlist(userId, {
      wishlistId: interaction.wishlistId,
      ebayItemId: interaction.itemId,
      title: interaction.title,
      imageUrl: interaction.imageUrl,
      itemWebUrl: interaction.itemWebUrl,
      price: interaction.price,
      sellerFeedbackScore: interaction.sellerFeedbackScore,
    });
  }
}
