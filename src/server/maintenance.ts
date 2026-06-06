import "server-only";

import { and, asc, eq, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { wishlistItems, wishlists } from "@/db/schema";
import { getItemDetails } from "./ebay";
import type { AvailabilityStatus } from "@/types/wishlist";

type AvailabilityCheckReason =
  | "NOT_FOUND"
  | "ENDED"
  | "OUT_OF_STOCK"
  | "LIMITED_STOCK"
  | "IN_STOCK"
  | "UNKNOWN_AVAILABILITY"
  | `API_ERROR: ${string}`;

function normalizeToDbStatus(reason: AvailabilityCheckReason): AvailabilityStatus {
  if (reason.startsWith("API_ERROR")) return "UNKNOWN_AVAILABILITY";
  return reason as AvailabilityStatus;
}

async function checkAvailability(ebayItemId: string) {
  const result = await getItemDetails(ebayItemId);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return { available: false, reason: "NOT_FOUND" as const };
    }

    return {
      available: false,
      reason: `API_ERROR: ${result.message}` as const,
    };
  }

  if (result.data.itemEndDate) {
    const endDate = new Date(result.data.itemEndDate);
    if (endDate <= new Date()) {
      return { available: false, reason: "ENDED" as const };
    }
  }

  const availability = result.data.estimatedAvailabilities?.[0];

  if (availability?.estimatedAvailabilityStatus === "OUT_OF_STOCK") {
    return { available: false, reason: "OUT_OF_STOCK" as const };
  }

  if (availability?.estimatedAvailabilityStatus === "LIMITED_STOCK") {
    return { available: true, reason: "LIMITED_STOCK" as const };
  }

  if (availability?.estimatedAvailabilityStatus === "IN_STOCK") {
    return { available: true, reason: "IN_STOCK" as const };
  }

  return { available: true, reason: "UNKNOWN_AVAILABILITY" as const };
}

export async function refreshWishlistMaintenance(
  userId: string,
  options?: { maxItemsToCheck?: number; staleAfterHours?: number }
) {
  const maxItems = options?.maxItemsToCheck ?? 60;
  const staleHours = options?.staleAfterHours ?? 24;

  const items = await db
    .select({
      id: wishlistItems.id,
      ebayItemId: wishlistItems.ebayItemId,
      title: wishlistItems.title,
    })
    .from(wishlistItems)
    .innerJoin(wishlists, eq(wishlistItems.wishlistId, wishlists.id))
    .where(
      and(
        eq(wishlists.userId, userId),
        inArray(wishlistItems.availabilityStatus, ["IN_STOCK", "LIMITED_STOCK"]),
        lt(wishlistItems.updatedAt, sql`now() - (${staleHours} || ' hours')::interval`)
      )
    )
    .orderBy(asc(wishlistItems.updatedAt))
    .limit(maxItems);

  let availableCount = 0;
  let unavailableCount = 0;
  let deactivatedCount = 0;

  for (const item of items) {
    try {
      const availability = await checkAvailability(item.ebayItemId);
      const availabilityStatus = normalizeToDbStatus(availability.reason);

      if (availability.available) {
        availableCount += 1;
      } else {
        unavailableCount += 1;
        deactivatedCount += 1;
      }

      await db
        .update(wishlistItems)
        .set({ availabilityStatus, updatedAt: new Date() })
        .where(eq(wishlistItems.id, item.id));
    } catch (error) {
      console.error(`Error checking item ${item.ebayItemId}:`, error);
    }
  }

  return {
    totalChecked: items.length,
    availableCount,
    unavailableCount,
    deactivatedCount,
  };
}
