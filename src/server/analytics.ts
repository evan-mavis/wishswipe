import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { AnalyticsData } from "@/types/analytics";

function rows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  if (result && typeof result === "object" && "rows" in result) {
    return (result as { rows: T[] }).rows;
  }
  return [];
}

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
  const result = await db.execute(sql`
    select action, count(*)::int as count
    from user_item_history
    where user_id = ${userId}
    group by action
  `);

  const counts = { right: 0, left: 0 };
  for (const row of rows<{ action: string; count: number }>(result)) {
    if (row.action === "right") counts.right = Number(row.count);
    if (row.action === "left") counts.left = Number(row.count);
  }

  return counts;
}

async function getCategoryFilters(userId: string) {
  const result = await db.execute(sql`
    select category_filter as name, count(*)::int as value
    from user_item_history
    where user_id = ${userId}
      and category_filter is not null
      and category_filter != ''
    group by category_filter
    order by value desc
    limit 5
  `);

  return rows<{ name: string; value: number }>(result).map((row, index) => ({
    name: row.name,
    value: Number(row.value),
    color: `var(--chart-${(index % 5) + 1})`,
  }));
}

async function getConditionWishlist(userId: string) {
  const result = await db.execute(sql`
    select condition_filter as condition, count(*)::int as count
    from user_item_history
    where user_id = ${userId}
      and action = 'right'
      and condition_filter is not null
      and condition_filter != ''
    group by condition_filter
    order by count desc
  `);

  return rows<{ condition: string; count: number }>(result).map((row) => ({
    condition: row.condition,
    count: Number(row.count),
  }));
}

async function getSearchTerms(userId: string) {
  const result = await db.execute(sql`
    select search_query as term, count(*)::int as count
    from user_item_history
    where user_id = ${userId}
      and search_query is not null
      and search_query != ''
    group by search_query
    order by count desc
    limit 6
  `);

  return rows<{ term: string; count: number }>(result).map((row) => ({
    term: row.term,
    count: Number(row.count),
  }));
}

async function getPriceDistribution(userId: string) {
  const result = await db.execute(sql`
    select range, count::int
    from (
      select
        case
          when price <= 25 then '$0-25'
          when price <= 50 then '$26-50'
          when price <= 75 then '$51-75'
          when price <= 100 then '$76-100'
          when price <= 150 then '$101-150'
          else '$151+'
        end as range,
        count(*) as count
      from user_item_history
      where user_id = ${userId}
        and action = 'right'
      group by
        case
          when price <= 25 then '$0-25'
          when price <= 50 then '$26-50'
          when price <= 75 then '$51-75'
          when price <= 100 then '$76-100'
          when price <= 150 then '$101-150'
          else '$151+'
        end
    ) subquery
    order by
      case range
        when '$0-25' then 1
        when '$26-50' then 2
        when '$51-75' then 3
        when '$76-100' then 4
        when '$101-150' then 5
        when '$151+' then 6
      end
  `);

  return rows<{ range: string; count: number }>(result).map((row) => ({
    range: row.range,
    count: Number(row.count),
  }));
}

async function getWishlistStats(userId: string): Promise<AnalyticsData["wishlistStats"]> {
  const largestWishlistRows = rows<{ name: string; item_count: number }>(
    await db.execute(sql`
      select w.name, count(wi.id)::int as item_count
      from wishlists w
      left join wishlist_items wi on w.id = wi.wishlist_id
      where w.user_id = ${userId}
      group by w.id, w.name
      order by item_count desc
      limit 1
    `)
  );

  const priceStatsRows = rows<{
    min_price: string | null;
    max_price: string | null;
    avg_price: string | null;
  }>(
    await db.execute(sql`
      select min(wi.price) as min_price, max(wi.price) as max_price, avg(wi.price) as avg_price
      from wishlists w
      join wishlist_items wi on w.id = wi.wishlist_id
      where w.user_id = ${userId}
    `)
  );

  const totalItemsRows = rows<{ total_items: number }>(
    await db.execute(sql`
      select count(wi.id)::int as total_items
      from wishlists w
      join wishlist_items wi on w.id = wi.wishlist_id
      where w.user_id = ${userId}
    `)
  );

  const avgSwipesRows = rows<{ avg_swipes_per_session: string | null }>(
    await db.execute(sql`
      select avg(daily_swipes) as avg_swipes_per_session
      from (
        select date(created_at) as date, count(*) as daily_swipes
        from user_item_history
        where user_id = ${userId}
        group by date(created_at)
      ) daily_stats
    `)
  );

  const largestWishlist = largestWishlistRows[0] ?? {
    name: "No wishlists",
    item_count: 0,
  };
  const priceStats = priceStatsRows[0] ?? {
    min_price: "0",
    max_price: "0",
    avg_price: "0",
  };

  return {
    largestWishlist: {
      name: largestWishlist.name,
      itemCount: Number(largestWishlist.item_count),
    },
    priceStats: {
      min: Number.parseFloat(priceStats.min_price ?? "0") || 0,
      max: Number.parseFloat(priceStats.max_price ?? "0") || 0,
      average: Number.parseFloat(priceStats.avg_price ?? "0") || 0,
    },
    totalItemsSaved: Number(totalItemsRows[0]?.total_items ?? 0),
    avgSwipesPerSession: Math.round(
      Number.parseFloat(avgSwipesRows[0]?.avg_swipes_per_session ?? "0") || 0
    ),
  };
}
