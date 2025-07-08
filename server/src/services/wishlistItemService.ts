import pool from "../db/index.js";
import { getItemDetails } from "./ebayBrowseService.js";
import logger from "../utils/logger.js";

export class WishlistItemService {
  /**
   * check if a wishlist item is still available on ebay
   */
  static async checkItemAvailability(ebayItemId: string): Promise<boolean> {
    try {
      // use the ebay browse api to check if the item still exists
      const itemDetails = await getItemDetails(ebayItemId);

      // if we can get item details, it's still available
      return !!itemDetails;
    } catch (error) {
      // if the item doesn't exist or there's an error, it's not available
      logger.debug(`Item ${ebayItemId} is no longer available:`, error);
      return false;
    }
  }

  /**
   * get all active wishlist items that need to be checked
   */
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
         WHERE is_active = true`
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * update the active status of a wishlist item
   */
  static async updateItemActiveStatus(
    itemId: string,
    isActive: boolean
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `UPDATE wishlist_items 
         SET is_active = $1, updated_at = NOW() 
         WHERE id = $2`,
        [isActive, itemId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * check all active wishlist items and update their availability status
   */
  static async checkAllActiveItems(): Promise<{
    checked: number;
    deactivated: number;
    errors: number;
  }> {
    const items = await this.getActiveWishlistItems();
    let checked = 0;
    let deactivated = 0;
    let errors = 0;

    logger.info(
      `Checking availability for ${items.length} active wishlist items...`
    );

    // process items in batches to avoid overwhelming the ebay api
    const batchSize = 10;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      // process batch concurrently
      const promises = batch.map(async (item) => {
        try {
          const isAvailable = await this.checkItemAvailability(item.ebayItemId);

          if (!isAvailable) {
            await this.updateItemActiveStatus(item.id, false);
            logger.info(`Deactivated item: ${item.title} (${item.ebayItemId})`);
            deactivated++;
          }

          checked++;
        } catch (error) {
          logger.error(`Error checking item ${item.ebayItemId}:`, error);
          errors++;
        }
      });

      await Promise.all(promises);

      // add a small delay between batches to be respectful to ebay's api
      if (i + batchSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    logger.info(
      `Availability check complete: ${checked} checked, ${deactivated} deactivated, ${errors} errors`
    );

    return { checked, deactivated, errors };
  }

  /**
   * check availability of a specific wishlist item and update its status
   */
  static async checkSpecificItem(itemId: string): Promise<{
    wasActive: boolean;
    isNowActive: boolean;
    title: string;
  }> {
    const client = await pool.connect();

    try {
      // get the item details
      const result = await client.query(
        `SELECT ebay_item_id, title, is_active 
         FROM wishlist_items 
         WHERE id = $1`,
        [itemId]
      );

      if (result.rows.length === 0) {
        throw new Error(`Wishlist item ${itemId} not found`);
      }

      const item = result.rows[0];
      const wasActive = item.is_active;

      // check availability on ebay
      const isAvailable = await this.checkItemAvailability(item.ebay_item_id);

      // update the status if it changed
      if (wasActive !== isAvailable) {
        await this.updateItemActiveStatus(itemId, isAvailable);
      }

      return {
        wasActive,
        isNowActive: isAvailable,
        title: item.title,
      };
    } finally {
      client.release();
    }
  }
}
