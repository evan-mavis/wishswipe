import pool from "../db/index.js";

export class UserItemHistoryService {
  /**
   * Check if user has seen an item
   */
  static async hasUserSeenItem(
    userId: string,
    itemId: string
  ): Promise<boolean> {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT 1 FROM user_item_history 
         WHERE user_id = $1 AND item_id = $2 
         LIMIT 1`,
        [userId, itemId]
      );

      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Get items user hasn't seen yet from a result set
   */
  static async filterUnseenItems(userId: string, items: any[]): Promise<any[]> {
    if (items.length === 0) return [];

    const client = await pool.connect();

    try {
      const itemIds = items.map((item) => item.itemId);
      const placeholders = itemIds.map((_, i) => `$${i + 2}`).join(",");

      const result = await client.query(
        `SELECT item_id FROM user_item_history 
         WHERE user_id = $1 AND item_id IN (${placeholders})`,
        [userId, ...itemIds]
      );

      const seenItemIds = new Set(result.rows.map((row) => row.item_id));
      return items.filter((item) => !seenItemIds.has(item.itemId));
    } finally {
      client.release();
    }
  }

  /**
   * Record user interaction with an item
   */
  static async recordItemInteraction(
    userId: string,
    itemId: string,
    action: "left" | "right",
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

  /**
   * Get user's item interaction history
   */
  static async getUserHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT * FROM user_item_history 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Get user analytics (preferred conditions, categories, price ranges)
   */
  static async getUserAnalytics(userId: string): Promise<any> {
    const client = await pool.connect();

    try {
      // Get action counts
      const actionCounts = await client.query(
        `SELECT action, COUNT(*) as count 
         FROM user_item_history 
         WHERE user_id = $1 
         GROUP BY action`,
        [userId]
      );

      // Get preferred conditions
      const preferredConditions = await client.query(
        `SELECT condition_filter, COUNT(*) as count 
         FROM user_item_history 
         WHERE user_id = $1 AND condition_filter IS NOT NULL 
         GROUP BY condition_filter 
         ORDER BY count DESC 
         LIMIT 5`,
        [userId]
      );

      // Get preferred categories
      const preferredCategories = await client.query(
        `SELECT category_filter, COUNT(*) as count 
         FROM user_item_history 
         WHERE user_id = $1 AND category_filter IS NOT NULL 
         GROUP BY category_filter 
         ORDER BY count DESC 
         LIMIT 5`,
        [userId]
      );

      // Get price range preferences
      const priceRanges = await client.query(
        `SELECT 
           AVG(price) as avg_price,
           MIN(price) as min_price,
           MAX(price) as max_price,
           COUNT(*) as total_items
         FROM user_item_history 
         WHERE user_id = $1 AND price IS NOT NULL`,
        [userId]
      );

      return {
        actionCounts: actionCounts.rows,
        preferredConditions: preferredConditions.rows,
        preferredCategories: preferredCategories.rows,
        priceRanges: priceRanges.rows[0] || {},
      };
    } finally {
      client.release();
    }
  }
}
