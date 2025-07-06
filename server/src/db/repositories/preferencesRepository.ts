import pool from "../index.js";
import type {
  UserPreferences,
  UpdateUserPreferences,
} from "../../types/preferences.js";

export const preferencesRepository = {
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const result = await pool.query(
      `SELECT * FROM user_preferences WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  async upsertUserPreferences(
    userId: string,
    preferences: UpdateUserPreferences
  ): Promise<UserPreferences> {
    // First, try to get existing preferences
    const existing = await this.getUserPreferences(userId);

    if (existing) {
      // Update existing preferences
      const result = await pool.query(
        `UPDATE user_preferences 
				 SET default_search_term = COALESCE($1, default_search_term),
				     default_condition = COALESCE($2, default_condition),
				     default_category = COALESCE($3, default_category),
				     default_price_min = COALESCE($4, default_price_min),
				     default_price_max = COALESCE($5, default_price_max),
				     updated_at = current_timestamp
				 WHERE user_id = $6
				 RETURNING *`,
        [
          preferences.default_search_term,
          preferences.default_condition,
          preferences.default_category,
          preferences.default_price_min,
          preferences.default_price_max,
          userId,
        ]
      );
      return result.rows[0];
    } else {
      // Create new preferences
      const result = await pool.query(
        `INSERT INTO user_preferences 
				 (user_id, default_search_term, default_condition, default_category, default_price_min, default_price_max)
				 VALUES ($1, $2, $3, $4, $5, $6)
				 RETURNING *`,
        [
          userId,
          preferences.default_search_term || "",
          preferences.default_condition || "none",
          preferences.default_category || "none",
          preferences.default_price_min || 10,
          preferences.default_price_max || 75,
        ]
      );
      return result.rows[0];
    }
  },

  async deleteUserPreferences(userId: string): Promise<void> {
    await pool.query(`DELETE FROM user_preferences WHERE user_id = $1`, [
      userId,
    ]);
  },
};
