import db from "../db/index.js";
import { AnalyticsData } from "../types/analytics.js";
import { SWIPE_ACTIONS } from "../constants/swipe.js";

export async function getAnalyticsData(userId: string): Promise<AnalyticsData> {
  const [
    swipeCounts,
    categoryFilters,
    conditionWishlist,
    searchTerms,
    priceDistribution,
    wishlistStats,
  ] = await Promise.all([
    getSwipeCounts(userId),
    getCategoryFilters(userId),
    getConditionWishlist(userId),
    getSearchTerms(userId),
    getPriceDistribution(userId),
    getWishlistStats(userId),
  ]);

  return {
    swipeCounts,
    categoryFilters,
    conditionWishlist,
    searchTerms,
    priceDistribution,
    wishlistStats,
  };
}

async function getSwipeCounts(userId: string) {
  const result = await db.query(
    `SELECT 
      action,
      COUNT(*) as count
    FROM user_item_history 
    WHERE user_id = $1 
    GROUP BY action`,
    [userId]
  );

  const counts = { right: 0, left: 0 };
  result.rows.forEach((row) => {
    if (row.action === SWIPE_ACTIONS.RIGHT) {
      counts.right = parseInt(row.count);
    } else if (row.action === SWIPE_ACTIONS.LEFT) {
      counts.left = parseInt(row.count);
    }
  });

  return counts;
}

async function getCategoryFilters(userId: string) {
  const result = await db.query(
    `SELECT 
      category_filter as name,
      COUNT(*) as value
    FROM user_item_history 
    WHERE user_id = $1 
      AND category_filter IS NOT NULL 
      AND category_filter != ''
    GROUP BY category_filter 
    ORDER BY value DESC 
    LIMIT 5`,
    [userId]
  );

  const colors = ["#a855f7", "#8b5cf6", "#3b82f6", "#6366f1", "#7c3aed"];

  return result.rows.map((row, index) => ({
    name: row.name,
    value: parseInt(row.value),
    color: colors[index] || "#a855f7",
  }));
}

async function getConditionWishlist(userId: string) {
  const result = await db.query(
    `SELECT 
      condition_filter as condition,
      COUNT(*) as count
    FROM user_item_history 
    WHERE user_id = $1 
      AND action = $2
      AND condition_filter IS NOT NULL 
      AND condition_filter != ''
    GROUP BY condition_filter 
    ORDER BY count DESC`,
    [userId, SWIPE_ACTIONS.RIGHT]
  );

  return result.rows.map((row) => ({
    condition: row.condition,
    count: parseInt(row.count),
  }));
}

async function getSearchTerms(userId: string) {
  const result = await db.query(
    `SELECT 
      search_query as term,
      COUNT(*) as count
    FROM user_item_history 
    WHERE user_id = $1 
      AND search_query IS NOT NULL 
      AND search_query != ''
    GROUP BY search_query 
    ORDER BY count DESC 
    LIMIT 6`,
    [userId]
  );

  return result.rows.map((row) => ({
    term: row.term,
    count: parseInt(row.count),
  }));
}

async function getPriceDistribution(userId: string) {
  const result = await db.query(
    `SELECT 
      range,
      count
    FROM (
      SELECT 
        CASE 
          WHEN price <= 25 THEN '$0-25'
          WHEN price <= 50 THEN '$26-50'
          WHEN price <= 75 THEN '$51-75'
          WHEN price <= 100 THEN '$76-100'
          WHEN price <= 150 THEN '$101-150'
          ELSE '$151+'
        END as range,
        COUNT(*) as count
      FROM user_item_history 
      WHERE user_id = $1 
        AND action = $2
      GROUP BY 
        CASE 
          WHEN price <= 25 THEN '$0-25'
          WHEN price <= 50 THEN '$26-50'
          WHEN price <= 75 THEN '$51-75'
          WHEN price <= 100 THEN '$76-100'
          WHEN price <= 150 THEN '$101-150'
          ELSE '$151+'
        END
    ) subquery
    ORDER BY 
      CASE range
        WHEN '$0-25' THEN 1
        WHEN '$26-50' THEN 2
        WHEN '$51-75' THEN 3
        WHEN '$76-100' THEN 4
        WHEN '$101-150' THEN 5
        WHEN '$151+' THEN 6
      END`,
    [userId, SWIPE_ACTIONS.RIGHT]
  );

  return result.rows.map((row) => ({
    range: row.range,
    count: parseInt(row.count),
  }));
}

async function getWishlistStats(userId: string) {
  // Get largest wishlist
  const largestWishlistResult = await db.query(
    `SELECT 
      w.name,
      COUNT(wi.id) as item_count
    FROM wishlists w
    LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id 
    WHERE w.user_id = $1
    GROUP BY w.id, w.name
    ORDER BY item_count DESC
    LIMIT 1`,
    [userId]
  );

  // Get price stats from wishlist items
  const priceStatsResult = await db.query(
    `SELECT 
      MIN(wi.price) as min_price,
      MAX(wi.price) as max_price,
      AVG(wi.price) as avg_price
    FROM wishlists w
    JOIN wishlist_items wi ON w.id = wi.wishlist_id
    WHERE w.user_id = $1`,
    [userId]
  );

  // Get total items saved
  const totalItemsResult = await db.query(
    `SELECT COUNT(wi.id) as total_items
    FROM wishlists w
    JOIN wishlist_items wi ON w.id = wi.wishlist_id
    WHERE w.user_id = $1`,
    [userId]
  );

  // Get average swipes per session (approximated by daily averages)
  const avgSwipesResult = await db.query(
    `SELECT 
      AVG(daily_swipes) as avg_swipes_per_session
    FROM (
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as daily_swipes
      FROM user_item_history 
      WHERE user_id = $1
      GROUP BY DATE(created_at)
    ) daily_stats`,
    [userId]
  );

  const largestWishlist = largestWishlistResult.rows[0] || {
    name: "No wishlists",
    item_count: 0,
  };
  const priceStats = priceStatsResult.rows[0] || {
    min_price: 0,
    max_price: 0,
    avg_price: 0,
  };
  const totalItems = totalItemsResult.rows[0]?.total_items || 0;
  const avgSwipes = avgSwipesResult.rows[0]?.avg_swipes_per_session || 0;

  return {
    largestWishlist: {
      name: largestWishlist.name,
      itemCount: parseInt(largestWishlist.item_count),
    },
    priceStats: {
      min: parseFloat(priceStats.min_price) || 0,
      max: parseFloat(priceStats.max_price) || 0,
      average: parseFloat(priceStats.avg_price) || 0,
    },
    totalItemsSaved: parseInt(totalItems),
    avgSwipesPerSession: Math.round(parseFloat(avgSwipes) || 0),
  };
}
