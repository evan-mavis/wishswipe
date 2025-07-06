import pool from "../db/index.js";
import { SearchFilters } from "../types/ebay.js";
import crypto from "crypto";
import { SearchSession } from "../types/searchSession.js";

export class PaginationService {
  /**
   * Generate a hash from search query and filters
   */
  private static generateSearchHash(
    searchQuery: string,
    filters: SearchFilters
  ): string {
    const searchData = {
      query: searchQuery,
      condition: filters.condition || null,
      category: filters.category || null,
      minPrice: filters.minPrice || null,
      maxPrice: filters.maxPrice || null,
    };

    const searchString = JSON.stringify(searchData);
    return crypto.createHash("sha256").update(searchString).digest("hex");
  }

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
      const searchHash = this.generateSearchHash(searchQuery, filters);

      // Try to find existing session using hash
      const existingSession = await client.query(
        `SELECT * FROM user_search_sessions 
         WHERE user_id = $1 
         AND search_hash = $2`,
        [userId, searchHash]
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
         (user_id, search_query, condition_filter, category_filter, price_min, price_max, current_offset, total_items_seen, search_hash)
         VALUES ($1, $2, $3, $4, $5, $6, 0, 0, $7)
         RETURNING *`,
        [
          userId,
          searchQuery,
          filters.condition || null,
          filters.category || null,
          filters.minPrice || null,
          filters.maxPrice || null,
          searchHash,
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
