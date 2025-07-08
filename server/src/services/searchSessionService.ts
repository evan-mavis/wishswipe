import pool from "../db/index.js";
import { SearchFilters } from "../types/ebay.js";
import { SearchSession } from "../types/searchSession.js";

export class SearchSessionService {
  static async getOrCreateSession(
    userId: string,
    searchHash: string,
    searchFilters: SearchFilters
  ): Promise<SearchSession> {
    const client = await pool.connect();

    try {
      // try to find existing session using hash
      const existingSession = await client.query(
        `SELECT * FROM user_search_sessions 
         WHERE user_id = $1 
         AND search_hash = $2`,
        [userId, searchHash]
      );

      if (existingSession.rows.length > 0) {
        // update last activity
        await client.query(
          `UPDATE user_search_sessions 
           SET last_activity = NOW() 
           WHERE id = $1`,
          [existingSession.rows[0].id]
        );
        return existingSession.rows[0];
      }

      // create new session
      const newSession = await client.query(
        `INSERT INTO user_search_sessions 
         (user_id, search_query, condition_filter, category_filter, price_min, price_max, page_number, total_items_seen, search_hash)
         VALUES ($1, $2, $3, $4, $5, $6, 1, 0, $7)
         RETURNING *`,
        [
          userId,
          searchFilters.query || null,
          searchFilters.condition || null,
          searchFilters.category || null,
          searchFilters.minPrice || null,
          searchFilters.maxPrice || null,
          searchHash,
        ]
      );

      return newSession.rows[0];
    } finally {
      client.release();
    }
  }

  static async setNextPage(
    sessionId: number,
    pageNumber: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `UPDATE user_search_sessions 
         SET page_number = $1,
             last_activity = NOW()
         WHERE id = $2`,
        [pageNumber, sessionId]
      );
    } finally {
      client.release();
    }
  }

  static async updateSessionProgress(
    sessionId: number,
    itemsSeen: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `UPDATE user_search_sessions 
         SET total_items_seen = total_items_seen + $1,
             last_activity = NOW()
         WHERE id = $2`,
        [itemsSeen, sessionId]
      );
    } finally {
      client.release();
    }
  }

  static async resetOldSessions(): Promise<void> {
    const client = await pool.connect();

    try {
      // Reset sessions older than 1 week back to page 1
      await client.query(
        `UPDATE user_search_sessions 
         SET page_number = 1,
             total_items_seen = 0,
             last_activity = NOW()
         WHERE created_at < NOW() - INTERVAL '7 days'`
      );
    } finally {
      client.release();
    }
  }
}
