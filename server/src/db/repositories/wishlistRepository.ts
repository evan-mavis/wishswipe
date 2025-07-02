import pool from "../index.js";
import {
  DbWishlist,
  DbWishlistWithItems,
  CreateWishlistRequest,
  ReorderWishlistsRequest,
  DbWishlistItem,
} from "../../types/wishlist.js";
import * as wishlistItemRepo from "./wishlistItemRepository.js";

function transformDbRowToWishlist(row: any): DbWishlist {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    isFavorite: row.is_favorite,
    orderIndex: row.order_index || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    itemCount: row.item_count ? parseInt(row.item_count) : undefined,
  };
}

function transformDbRowToWishlistItem(row: any): DbWishlistItem {
  return {
    id: row.id,
    wishlistId: row.wishlist_id,
    ebayItemId: row.ebay_item_id,
    title: row.title,
    imageUrl: row.image_url,
    itemWebUrl: row.item_web_url,
    price: row.price ? parseFloat(row.price) : undefined,
    sellerFeedbackScore: row.seller_feedback_score,
    orderIndex: row.order_index || 0,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findWishlistsByUserId(
  userId: string
): Promise<DbWishlist[]> {
  const { rows } = await pool.query(
    `SELECT 
      w.id,
      w.user_id,
      w.name,
      w.description,
      w.is_favorite,
      w.order_index,
      w.created_at,
      w.updated_at,
      COUNT(wi.id) as item_count
    FROM wishlists w
    LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id AND wi.is_active = true
    WHERE w.user_id = $1
    GROUP BY w.id, w.user_id, w.name, w.description, w.is_favorite, w.order_index, w.created_at, w.updated_at
    ORDER BY w.order_index ASC, w.created_at DESC`,
    [userId]
  );
  return rows.map(transformDbRowToWishlist);
}

export async function findWishlistsWithItemsByUserId(
  userId: string
): Promise<DbWishlistWithItems[]> {
  const wishlists = await findWishlistsByUserId(userId);

  const wishlistsWithItems = await Promise.all(
    wishlists.map(async (wishlist) => {
      const items = await wishlistItemRepo.findWishlistItemsByWishlistId(
        wishlist.id
      );
      return {
        ...wishlist,
        items,
      };
    })
  );

  return wishlistsWithItems;
}

export async function createWishlist(
  data: CreateWishlistRequest
): Promise<DbWishlist> {
  const { userId, name, description, isFavorite = false, orderIndex } = data;

  // If no orderIndex provided, get the next highest order
  let finalOrderIndex = orderIndex;
  if (finalOrderIndex === undefined) {
    const { rows } = await pool.query(
      `SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM wishlists WHERE user_id = $1`,
      [userId]
    );
    finalOrderIndex = rows[0].next_order;
  }

  const { rows } = await pool.query(
    `INSERT INTO wishlists (id, user_id, name, description, is_favorite, order_index)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *;`,
    [userId, name, description || null, isFavorite, finalOrderIndex]
  );
  return transformDbRowToWishlist(rows[0]);
}

export async function updateWishlist(
  wishlistId: string,
  userId: string,
  data: { name?: string; description?: string }
): Promise<DbWishlist | null> {
  const { name, description } = data;

  // Build dynamic query based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    values.push(description);
  }

  if (updates.length === 0) {
    return null;
  }

  updates.push(`updated_at = now()`);
  values.push(wishlistId, userId);

  const { rows } = await pool.query(
    `UPDATE wishlists 
     SET ${updates.join(", ")}
     WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
     RETURNING *`,
    values
  );

  return rows.length > 0 ? transformDbRowToWishlist(rows[0]) : null;
}

export async function deleteWishlist(
  wishlistId: string,
  userId: string
): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM wishlists WHERE id = $1 AND user_id = $2`,
    [wishlistId, userId]
  );
  return (rowCount ?? 0) > 0;
}

export async function deleteWishlists(
  wishlistIds: string[],
  userId: string
): Promise<number> {
  const { rowCount } = await pool.query(
    `DELETE FROM wishlists WHERE id = ANY($1) AND user_id = $2`,
    [wishlistIds, userId]
  );
  return rowCount ?? 0;
}

export async function reorderWishlists(
  userId: string,
  wishlistIds: string[]
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let i = 0; i < wishlistIds.length; i++) {
      await client.query(
        `UPDATE wishlists SET order_index = $1, updated_at = now() 
         WHERE id = $2 AND user_id = $3`,
        [i, wishlistIds[i], userId]
      );
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getWishlistItems(
  wishlistId: string,
  userId: string
): Promise<DbWishlistItem[]> {
  const { rows } = await pool.query(
    `SELECT 
      wi.id,
      wi.wishlist_id,
      wi.ebay_item_id,
      wi.title,
      wi.image_url,
      wi.item_web_url,
      wi.price,
      wi.seller_feedback_score,
      wi.order_index,
      wi.is_active,
      wi.created_at,
      wi.updated_at
    FROM wishlist_items wi
    JOIN wishlists w ON wi.wishlist_id = w.id
    WHERE wi.wishlist_id = $1 AND w.user_id = $2 AND wi.is_active = true
    ORDER BY wi.order_index ASC, wi.created_at DESC`,
    [wishlistId, userId]
  );
  return rows.map(transformDbRowToWishlistItem);
}

export async function removeItemsFromWishlist(
  itemIds: string[],
  userId: string
): Promise<number> {
  const { rowCount } = await pool.query(
    `UPDATE wishlist_items 
     SET is_active = false, updated_at = now()
     WHERE id = ANY($1) 
     AND wishlist_id IN (SELECT id FROM wishlists WHERE user_id = $2)`,
    [itemIds, userId]
  );
  return rowCount ?? 0;
}

export async function reorderWishlistItems(
  userId: string,
  itemIds: string[]
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let i = 0; i < itemIds.length; i++) {
      await client.query(
        `UPDATE wishlist_items 
         SET order_index = $1, updated_at = now() 
         WHERE id = $2 
         AND wishlist_id IN (SELECT id FROM wishlists WHERE user_id = $3)`,
        [i, itemIds[i], userId]
      );
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
