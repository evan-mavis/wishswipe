import pool from "../db/index.js";
import { getItemDetails } from "./ebayBrowseService.js";
import { EbayItemResult } from "../types/ebay.js";
import logger from "../utils/logger.js";
import { EbayItemDetails } from "../types/ebay.js";

type AvailabilityCheckReason =
  | "NOT_FOUND"
  | "ENDED"
  | "OUT_OF_STOCK"
  | "LIMITED_STOCK"
  | "IN_STOCK"
  | "UNKNOWN_AVAILABILITY"
  | `API_ERROR: ${string}`;

interface AvailabilityCheckResult {
  available: boolean;
  reason: AvailabilityCheckReason;
}

type DbAvailabilityStatus =
  | "NOT_FOUND"
  | "ENDED"
  | "OUT_OF_STOCK"
  | "LIMITED_STOCK"
  | "IN_STOCK"
  | "UNKNOWN_AVAILABILITY";

function normalizeToDbStatus(
  reason: AvailabilityCheckReason
): DbAvailabilityStatus {
  if (reason.startsWith("API_ERROR")) {
    return "UNKNOWN_AVAILABILITY";
  }
  return reason as DbAvailabilityStatus;
}

export class WishlistItemService {
  static async getUserActiveWishlistItems(
    userId: string,
    options?: { maxItemsToCheck?: number; staleAfterHours?: number }
  ): Promise<
    Array<{
      id: string;
      ebayItemId: string;
      title: string;
    }>
  > {
    const client = await pool.connect();

    const maxItems = options?.maxItemsToCheck ?? 50;
    const staleHours = options?.staleAfterHours ?? 24;

    try {
      const result = await client.query(
        `SELECT wi.id, wi.ebay_item_id, wi.title
         FROM wishlist_items wi
         INNER JOIN wishlists w ON wi.wishlist_id = w.id
         WHERE w.user_id = $1
           AND wi.availability_status IN ('IN_STOCK','LIMITED_STOCK')
           AND wi.updated_at < NOW() - INTERVAL '${staleHours} hours'
         ORDER BY wi.updated_at ASC
         LIMIT $2`,
        [userId, maxItems]
      );

      return result.rows.map((row) => ({
        id: row.id,
        ebayItemId: row.ebay_item_id,
        title: row.title,
      }));
    } finally {
      client.release();
    }
  }

  static async checkActiveItemsForUser(
    userId: string,
    options?: { maxItemsToCheck?: number; staleAfterHours?: number }
  ): Promise<{
    totalChecked: number;
    availableCount: number;
    unavailableCount: number;
    deactivatedCount: number;
  }> {
    const items = await this.getUserActiveWishlistItems(userId, options);

    logger.info(
      `User ${userId}: checking availability for ${items.length} wishlist items...`
    );

    let availableCount = 0;
    let unavailableCount = 0;
    let deactivatedCount = 0;

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemNumber = index + 1;

      try {
        const availability = await this.checkAvailability(item.ebayItemId);

        const status = availability.available
          ? "Available"
          : `Unavailable (${availability.reason})`;
        const truncatedTitle =
          item.title && item.title.length > 28
            ? item.title.substring(0, 25) + "..."
            : item.title;
        logger.info(
          `User ${userId} [${itemNumber}/${items.length}] ${status}: ${truncatedTitle} (${item.ebayItemId})`
        );

        if (availability.available) {
          availableCount += 1;
          await this.updateItemAvailabilityStatus(
            item.id,
            normalizeToDbStatus(availability.reason)
          );
        } else {
          unavailableCount += 1;
          await this.updateItemAvailabilityStatus(
            item.id,
            normalizeToDbStatus(availability.reason)
          );
          deactivatedCount += 1;
        }
      } catch (error) {
        logger.error(
          `User ${userId} [${itemNumber}/${items.length}] Error checking item ${item.ebayItemId}: ${error}`
        );
      }
    }

    const summary = {
      totalChecked: items.length,
      availableCount,
      unavailableCount,
      deactivatedCount,
    };

    logger.info(
      `User ${userId} availability check summary: checked=${summary.totalChecked}, available=${summary.availableCount}, unavailable=${summary.unavailableCount}, deactivated=${summary.deactivatedCount}`
    );

    return summary;
  }

  static async checkAvailability(
    ebayItemId: string
  ): Promise<AvailabilityCheckResult> {
    const result: EbayItemResult = await getItemDetails(ebayItemId);

    if (!result.success) {
      if (result.error === "NOT_FOUND") {
        return { available: false, reason: "NOT_FOUND" };
      }

      // return API error as reason instead of throwing, to keep batch checks resilient
      return { available: false, reason: `API_ERROR: ${result.message}` };
    }

    const itemDetails: EbayItemDetails = result.data;

    // check if the item has ended
    if (itemDetails.itemEndDate) {
      const endDate = new Date(itemDetails.itemEndDate);
      const now = new Date();
      if (endDate <= now) {
        return { available: false, reason: "ENDED" };
      }
    }

    // check availability status
    if (
      itemDetails.estimatedAvailabilities &&
      itemDetails.estimatedAvailabilities.length > 0
    ) {
      const availability = itemDetails.estimatedAvailabilities[0];

      if (availability.estimatedAvailabilityStatus === "OUT_OF_STOCK") {
        return { available: false, reason: "OUT_OF_STOCK" };
      }

      if (availability.estimatedAvailabilityStatus === "LIMITED_STOCK") {
        return { available: true, reason: "LIMITED_STOCK" };
      }

      return { available: true, reason: "IN_STOCK" };
    }

    return { available: true, reason: "UNKNOWN_AVAILABILITY" };
  }

  static async getActiveWishlistItems(): Promise<
    Array<{
      id: string;
      ebayItemId: string;
      title: string;
    }>
  > {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT id, ebay_item_id, title 
         FROM wishlist_items 
         WHERE availability_status IN ('IN_STOCK','LIMITED_STOCK')
         ORDER BY id ASC`
      );

      return result.rows.map((row) => ({
        id: row.id,
        ebayItemId: row.ebay_item_id,
        title: row.title,
      }));
    } finally {
      client.release();
    }
  }

  static async updateItemAvailabilityStatus(
    itemId: string,
    availabilityStatus:
      | "NOT_FOUND"
      | "ENDED"
      | "OUT_OF_STOCK"
      | "LIMITED_STOCK"
      | "IN_STOCK"
      | "UNKNOWN_AVAILABILITY"
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `UPDATE wishlist_items 
         SET availability_status = $1, updated_at = NOW() 
         WHERE id = $2`,
        [availabilityStatus, itemId]
      );
    } finally {
      client.release();
    }
  }

  static async checkAllActiveItems(): Promise<{
    totalChecked: number;
    availableCount: number;
    unavailableCount: number;
    deactivatedCount: number;
  }> {
    const items = await this.getActiveWishlistItems();

    logger.info(
      `Checking availability for ${items.length} active wishlist items...`
    );

    let availableCount = 0;
    let unavailableCount = 0;
    let deactivatedCount = 0;

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemNumber = index + 1;

      try {
        const availability = await this.checkAvailability(item.ebayItemId);

        const status = availability.available
          ? "Available"
          : `Unavailable (${availability.reason})`;
        const truncatedTitle =
          item.title.length > 28
            ? item.title.substring(0, 25) + "..."
            : item.title;
        logger.info(
          `[${itemNumber}/${items.length}] ${status}: ${truncatedTitle} (${item.ebayItemId})`
        );

        if (availability.available) {
          availableCount += 1;
          await this.updateItemAvailabilityStatus(
            item.id,
            normalizeToDbStatus(availability.reason)
          );
        } else {
          unavailableCount += 1;
          await this.updateItemAvailabilityStatus(
            item.id,
            normalizeToDbStatus(availability.reason)
          );
          deactivatedCount += 1;
        }
      } catch (error) {
        logger.error(
          `[${itemNumber}/${items.length}] Error checking item ${item.ebayItemId}: ${error}`
        );
      }
    }

    const summary = {
      totalChecked: items.length,
      availableCount,
      unavailableCount,
      deactivatedCount,
    };

    logger.info(
      `Availability check summary: checked=${summary.totalChecked}, available=${summary.availableCount}, unavailable=${summary.unavailableCount}, deactivated=${summary.deactivatedCount}`
    );

    return summary;
  }
}
