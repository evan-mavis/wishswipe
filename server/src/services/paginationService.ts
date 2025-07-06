import pool from "../db/index.js";
import { SearchFilters } from "../types/ebay.js";

interface SearchSession {
  id: number;
  user_id: string;
  search_query: string;
  condition_filter?: string;
  category_filter?: string;
  price_min?: number;
  price_max?: number;
  current_offset: number;
  total_items_seen: number;
  last_item_id?: string; // ID of the last item in the current batch
  last_activity: Date;
}

export class PaginationService {
  /**
   * Get or create a search session for a user
   */
  static async getOrCreateSession(
    userId: string,
    searchQuery: string,
    filters: SearchFilters
  ): Promise<SearchSession> {
    const client = await pool.connect();

    try {
      // Try to find existing session
      const existingSession = await client.query(
        `SELECT * FROM user_search_sessions 
         WHERE user_id = $1 
         AND search_query = $2 
         AND COALESCE(condition_filter, 'none') = COALESCE($3, 'none')
         AND COALESCE(category_filter, 'none') = COALESCE($4, 'none')
         AND COALESCE(price_min, 0) = COALESCE($5, 0)
         AND COALESCE(price_max, 200) = COALESCE($6, 200)`,
        [
          userId,
          searchQuery,
          filters.condition || "none",
          filters.category || "none",
          filters.minPrice || 0,
          filters.maxPrice || 200,
        ]
      );

      if (existingSession.rows.length > 0) {
        // Update last activity
        await client.query(
          `UPDATE user_search_sessions 
           SET last_activity = NOW() 
           WHERE id = $1`,
          [existingSession.rows[0].id]
        );
        return existingSession.rows[0];
      }

      // Create new session
      const newSession = await client.query(
        `INSERT INTO user_search_sessions 
         (user_id, search_query, condition_filter, category_filter, price_min, price_max, current_offset, total_items_seen)
         VALUES ($1, $2, $3, $4, $5, $6, 0, 0)
         RETURNING *`,
        [
          userId,
          searchQuery,
          filters.condition || null,
          filters.category || null,
          filters.minPrice || null,
          filters.maxPrice || null,
        ]
      );

      return newSession.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update session with new items seen
   * @param sessionId - The search session ID
   * @param itemsSeen - Number of items seen by the user
   * @param shouldIncrementOffset - Whether to increment the offset (only true when fetching new items from eBay)
   */
  static async updateSessionProgress(
    sessionId: number,
    itemsSeen: number,
    shouldIncrementOffset: boolean = false
  ): Promise<void> {
    const client = await pool.connect();

    try {
      const EBAY_LIMIT = 200;

      if (shouldIncrementOffset) {
        // Only increment offset when we're actually fetching new items from eBay
        await client.query(
          `UPDATE user_search_sessions 
           SET current_offset = current_offset + $1, 
               total_items_seen = total_items_seen + $2,
               last_activity = NOW()
           WHERE id = $3`,
          [EBAY_LIMIT, itemsSeen, sessionId]
        );
      } else {
        // Just update the total items seen and last activity
        await client.query(
          `UPDATE user_search_sessions 
           SET total_items_seen = total_items_seen + $1,
               last_activity = NOW()
           WHERE id = $2`,
          [itemsSeen, sessionId]
        );
      }
    } finally {
      client.release();
    }
  }

  /**
   * Get the current offset for a search session
   */
  static async getCurrentOffset(sessionId: number): Promise<number> {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT current_offset FROM user_search_sessions WHERE id = $1`,
        [sessionId]
      );

      return result.rows[0]?.current_offset || 0;
    } finally {
      client.release();
    }
  }

  /**
   * Check if we need to fetch more items and increment offset if needed
   * Returns the current offset after potential increment
   */
  static async getOffsetForNextFetch(sessionId: number): Promise<number> {
    const client = await pool.connect();

    try {
      // Get current session info
      const result = await client.query(
        `SELECT current_offset, last_item_id FROM user_search_sessions WHERE id = $1`,
        [sessionId]
      );

      if (result.rows.length === 0) {
        return 0;
      }

      const { current_offset, last_item_id } = result.rows[0];

      // If we have a last_item_id, check if the user has seen it
      if (last_item_id) {
        const hasSeenLastItem = await client.query(
          `SELECT EXISTS(
            SELECT 1 FROM user_item_history 
            WHERE user_id = (SELECT user_id FROM user_search_sessions WHERE id = $1)
            AND item_id = $2
          )`,
          [sessionId, last_item_id]
        );

        if (hasSeenLastItem.rows[0].exists) {
          // User has seen the last item, increment offset to get next batch
          const EBAY_LIMIT = 200;
          await client.query(
            `UPDATE user_search_sessions 
             SET current_offset = current_offset + $1,
                 last_item_id = NULL,
                 last_activity = NOW()
             WHERE id = $2`,
            [EBAY_LIMIT, sessionId]
          );
          return current_offset + EBAY_LIMIT;
        }
      }

      return current_offset;
    } finally {
      client.release();
    }
  }

  /**
   * Set the last item ID for a search session (called when fetching new items)
   */
  static async setLastItemId(
    sessionId: number,
    lastItemId: string
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `UPDATE user_search_sessions 
         SET last_item_id = $1,
             last_activity = NOW()
         WHERE id = $2`,
        [lastItemId, sessionId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Clean up old sessions (older than 24 hours)
   */
  static async cleanupOldSessions(): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `DELETE FROM user_search_sessions 
         WHERE last_activity < NOW() - INTERVAL '24 hours'`
      );
    } finally {
      client.release();
    }
  }
}
