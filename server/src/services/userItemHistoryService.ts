import { SWIPE_ACTIONS } from "../constants/swipe.js";
import pool from "../db/index.js";
import { EbayItemSummary } from "../types/ebay.js";

export class UserItemHistoryService {
  static async filterUnseenItems(
    userId: string,
    items: EbayItemSummary[]
  ): Promise<any[]> {
    if (items.length === 0) return [];

    const client = await pool.connect();

    try {
      const itemIds = items.map((item) => item.itemId);
      const placeholders = items.map((_, i) => `$${i + 2}`).join(",");

      const result = await client.query(
        `SELECT item_id FROM user_item_history 
         WHERE user_id = $1 
         AND item_id IN (${placeholders})
         AND created_at >= NOW() - INTERVAL '14 days'`,
        [userId, ...itemIds]
      );

      const seenItemIds = new Set(result.rows.map((row) => row.item_id));
      return items.filter((item) => !seenItemIds.has(item.itemId));
    } finally {
      client.release();
    }
  }

  static async recordItemInteraction(
    userId: string,
    itemId: string,
    action: SWIPE_ACTIONS,
    searchQuery?: string,
    conditionFilter?: string,
    categoryFilter?: string,
    priceMin?: number,
    priceMax?: number,
    itemPrice?: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `INSERT INTO user_item_history 
         (user_id, item_id, action, search_query, condition_filter, category_filter, price_min, price_max, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          userId,
          itemId,
          action,
          searchQuery || null,
          conditionFilter || null,
          categoryFilter || null,
          priceMin || null,
          priceMax || null,
          itemPrice || null,
        ]
      );
    } finally {
      client.release();
    }
  }
}
