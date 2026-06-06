import "server-only";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { wishlistItems, wishlists } from "@/db/schema";
import { createId } from "@/lib/ids";
import type { AvailabilityStatus, WishList, WishlistItem } from "@/types/wishlist";

export interface WishlistOption {
  id: string;
  name: string;
  isFavorite: boolean;
}

export interface CreateWishlistInput {
  name: string;
  description?: string | null;
  isFavorite?: boolean;
}

export interface UpdateWishlistInput {
  name?: string;
  description?: string | null;
  isFavorite?: boolean;
}

export interface AddWishlistItemInput {
  wishlistId: string;
  ebayItemId: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  price?: number;
  sellerFeedbackScore?: number;
}

function toNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toItem(row: typeof wishlistItems.$inferSelect): WishlistItem {
  return {
    id: row.id,
    wishlistId: row.wishlistId,
    ebayItemId: row.ebayItemId,
    title: row.title ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    itemWebUrl: row.itemWebUrl ?? undefined,
    price: toNumber(row.price),
    sellerFeedbackScore: row.sellerFeedbackScore ?? undefined,
    orderIndex: row.orderIndex,
    availabilityStatus: row.availabilityStatus as AvailabilityStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function ensureDefaultWishlist(userId: string) {
  const existing = await db
    .select({ id: wishlists.id })
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .limit(1);

  if (existing.length > 0) return;

  await createWishlist(userId, {
    name: "My Wishlist",
    description: "Your first list for saved finds.",
    isFavorite: true,
  });
}

export async function getWishlists(userId: string): Promise<WishList[]> {
  const rows = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .orderBy(asc(wishlists.orderIndex), desc(wishlists.createdAt));

  if (rows.length === 0) return [];

  const allItems = await db
    .select()
    .from(wishlistItems)
    .where(
      and(
        inArray(
          wishlistItems.wishlistId,
          rows.map((wishlist) => wishlist.id)
        ),
        inArray(wishlistItems.availabilityStatus, ["IN_STOCK", "LIMITED_STOCK"])
      )
    )
    .orderBy(asc(wishlistItems.orderIndex), desc(wishlistItems.createdAt));

  const itemsByWishlist = new Map<string, WishlistItem[]>();
  for (const item of allItems) {
    const current = itemsByWishlist.get(item.wishlistId) ?? [];
    current.push(toItem(item));
    itemsByWishlist.set(item.wishlistId, current);
  }

  return rows.map((wishlist) => {
    const items = itemsByWishlist.get(wishlist.id) ?? [];
    return {
      id: wishlist.id,
      name: wishlist.name,
      description: wishlist.description ?? undefined,
      isFavorite: wishlist.isFavorite,
      orderIndex: wishlist.orderIndex,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
      items,
      itemCount: items.length,
    };
  });
}

export async function getWishlistOptions(userId: string): Promise<WishlistOption[]> {
  const rows = await db
    .select({
      id: wishlists.id,
      name: wishlists.name,
      isFavorite: wishlists.isFavorite,
    })
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .orderBy(asc(wishlists.orderIndex), desc(wishlists.createdAt));

  return rows;
}

export async function getFavoriteWishlistId(userId: string) {
  const favorite = await db
    .select({ id: wishlists.id })
    .from(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.isFavorite, true)))
    .limit(1);

  if (favorite[0]?.id) return favorite[0].id;

  const first = await db
    .select({ id: wishlists.id })
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .orderBy(asc(wishlists.orderIndex), desc(wishlists.createdAt))
    .limit(1);

  return first[0]?.id ?? "";
}

export async function createWishlist(
  userId: string,
  input: CreateWishlistInput
): Promise<WishList> {
  const created = await db.transaction(async (tx) => {
    if (input.isFavorite) {
      await tx
        .update(wishlists)
        .set({ isFavorite: false, updatedAt: new Date() })
        .where(and(eq(wishlists.userId, userId), eq(wishlists.isFavorite, true)));
    }

    const [orderRow] = await tx
      .select({
        nextOrder: sql<number>`coalesce(max(${wishlists.orderIndex}), -1) + 1`,
      })
      .from(wishlists)
      .where(eq(wishlists.userId, userId));

    const [wishlist] = await tx
      .insert(wishlists)
      .values({
        id: createId(),
        userId,
        name: input.name,
        description: input.description || null,
        isFavorite: input.isFavorite ?? false,
        orderIndex: Number(orderRow?.nextOrder ?? 0),
      })
      .returning();

    return wishlist;
  });

  return {
    id: created.id,
    name: created.name,
    description: created.description ?? undefined,
    isFavorite: created.isFavorite,
    orderIndex: created.orderIndex,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
    items: [],
    itemCount: 0,
  };
}

export async function updateWishlist(
  userId: string,
  wishlistId: string,
  input: UpdateWishlistInput
) {
  const updated = await db.transaction(async (tx) => {
    if (input.isFavorite === true) {
      await tx
        .update(wishlists)
        .set({ isFavorite: false, updatedAt: new Date() })
        .where(
          and(
            eq(wishlists.userId, userId),
            eq(wishlists.isFavorite, true),
            sql`${wishlists.id} <> ${wishlistId}`
          )
        );
    }

    const [wishlist] = await tx
      .update(wishlists)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined
          ? { description: input.description || null }
          : {}),
        ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(wishlists.id, wishlistId), eq(wishlists.userId, userId)))
      .returning();

    return wishlist;
  });

  return updated ?? null;
}

export async function deleteWishlists(userId: string, wishlistIds: string[]) {
  if (wishlistIds.length === 0) return 0;

  const deleted = await db
    .delete(wishlists)
    .where(and(eq(wishlists.userId, userId), inArray(wishlists.id, wishlistIds)))
    .returning({ id: wishlists.id });

  await ensureDefaultWishlist(userId);
  return deleted.length;
}

export async function reorderWishlists(userId: string, wishlistIds: string[]) {
  await db.transaction(async (tx) => {
    for (let index = 0; index < wishlistIds.length; index += 1) {
      await tx
        .update(wishlists)
        .set({ orderIndex: index, updatedAt: new Date() })
        .where(and(eq(wishlists.id, wishlistIds[index]), eq(wishlists.userId, userId)));
    }
  });
}

export async function addItemToWishlist(
  userId: string,
  input: AddWishlistItemInput
): Promise<WishlistItem | null> {
  return db.transaction(async (tx) => {
    const [target] = await tx
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(and(eq(wishlists.id, input.wishlistId), eq(wishlists.userId, userId)))
      .limit(1);

    if (!target) return null;

    await tx
      .update(wishlistItems)
      .set({
        orderIndex: sql`${wishlistItems.orderIndex} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(wishlistItems.wishlistId, input.wishlistId),
          inArray(wishlistItems.availabilityStatus, ["IN_STOCK", "LIMITED_STOCK"])
        )
      );

    const [item] = await tx
      .insert(wishlistItems)
      .values({
        id: createId(),
        wishlistId: input.wishlistId,
        ebayItemId: input.ebayItemId,
        title: input.title ?? null,
        imageUrl: input.imageUrl ?? null,
        itemWebUrl: input.itemWebUrl ?? null,
        price: input.price === undefined ? null : String(input.price),
        sellerFeedbackScore: input.sellerFeedbackScore ?? null,
        orderIndex: 0,
      })
      .returning();

    return toItem(item);
  });
}

export async function removeItemsFromWishlist(userId: string, itemIds: string[]) {
  if (itemIds.length === 0) return 0;

  const removed = await db
    .update(wishlistItems)
    .set({ availabilityStatus: "UNKNOWN_AVAILABILITY", updatedAt: new Date() })
    .where(
      and(
        inArray(wishlistItems.id, itemIds),
        inArray(
          wishlistItems.wishlistId,
          db
            .select({ id: wishlists.id })
            .from(wishlists)
            .where(eq(wishlists.userId, userId))
        )
      )
    )
    .returning({ id: wishlistItems.id });

  return removed.length;
}

export async function reorderWishlistItems(userId: string, itemIds: string[]) {
  await db.transaction(async (tx) => {
    for (let index = 0; index < itemIds.length; index += 1) {
      await tx
        .update(wishlistItems)
        .set({ orderIndex: index, updatedAt: new Date() })
        .where(
          and(
            eq(wishlistItems.id, itemIds[index]),
            inArray(
              wishlistItems.wishlistId,
              tx
                .select({ id: wishlists.id })
                .from(wishlists)
                .where(eq(wishlists.userId, userId))
            )
          )
        );
    }
  });
}

export async function moveItemsToWishlist(
  userId: string,
  itemIds: string[],
  targetWishlistId: string
) {
  if (itemIds.length === 0) return 0;

  return db.transaction(async (tx) => {
    const [target] = await tx
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(and(eq(wishlists.id, targetWishlistId), eq(wishlists.userId, userId)))
      .limit(1);

    if (!target) return 0;

    const [orderRow] = await tx
      .select({
        nextOrder: sql<number>`coalesce(max(${wishlistItems.orderIndex}), -1) + 1`,
      })
      .from(wishlistItems)
      .where(eq(wishlistItems.wishlistId, targetWishlistId));

    const moved = await tx
      .update(wishlistItems)
      .set({ wishlistId: targetWishlistId, updatedAt: new Date() })
      .where(
        and(
          inArray(wishlistItems.id, itemIds),
          inArray(
            wishlistItems.wishlistId,
            tx
              .select({ id: wishlists.id })
              .from(wishlists)
              .where(eq(wishlists.userId, userId))
          )
        )
      )
      .returning({ id: wishlistItems.id });

    for (let index = 0; index < moved.length; index += 1) {
      await tx
        .update(wishlistItems)
        .set({
          orderIndex: Number(orderRow?.nextOrder ?? 0) + index,
          updatedAt: new Date(),
        })
        .where(
          and(eq(wishlistItems.id, moved[index].id), eq(wishlistItems.wishlistId, targetWishlistId))
        );
    }

    return moved.length;
  });
}
