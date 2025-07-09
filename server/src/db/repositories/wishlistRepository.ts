import pool from "../index.js";
import {
  DbWishlist,
  DbWishlistWithItems,
  CreateWishlistRequest,
  UpdateWishlistRequest,
  DbWishlistItem,
} from "../../types/wishlist.js";
import * as wishlistItemRepo from "./wishlistItemRepository.js";

export async function findWishlistsByUserId(
  userId: string
): Promise<DbWishlist[]> {
  const { rows } = await pool.query(
    `SELECT 
      w.id,
      w.name,
      w.description,
      w.is_favorite,
      w.order_index,
      w.created_at,
      w.updated_at,
      COUNT(wi.id) as item_count
    FROM wishlists w
    LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
    WHERE w.user_id = $1
    GROUP BY w.id, w.name, w.description, w.is_favorite, w.order_index, w.created_at, w.updated_at
    ORDER BY w.order_index ASC, w.created_at DESC`,
    [userId]
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    isFavorite: row.is_favorite,
    orderIndex: row.order_index || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    itemCount: row.item_count ? parseInt(row.item_count) : undefined,
  }));
}

export async function findWishlistsWithItemsByUserId(
  userId: string
): Promise<DbWishlistWithItems[]> {
  const { rows } = await pool.query(
    `SELECT 
      w.id as wishlist_id,
      w.name as wishlist_name,
      w.description as wishlist_description,
      w.is_favorite,
      w.order_index as wishlist_order_index,
      w.created_at as wishlist_created_at,
      w.updated_at as wishlist_updated_at,
      wi.id as item_id,
      wi.wishlist_id as item_wishlist_id,
      wi.ebay_item_id,
      wi.title as item_title,
      wi.image_url,
      wi.item_web_url,
      wi.price,
      wi.seller_feedback_score,
      wi.order_index as item_order_index,
      wi.is_active,
      wi.created_at as item_created_at,
      wi.updated_at as item_updated_at
    FROM wishlists w
    LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
    WHERE w.user_id = $1
    ORDER BY w.order_index ASC, w.created_at DESC, wi.order_index ASC, wi.created_at DESC`,
    [userId]
  );

  // group the results by wishlist
  const wishlistsMap = new Map<string, DbWishlistWithItems>();

  rows.forEach((row) => {
    const wishlistId = row.wishlist_id;

    // if we haven't seen this wishlist yet, create it
    if (!wishlistsMap.has(wishlistId)) {
      wishlistsMap.set(wishlistId, {
        id: row.wishlist_id,
        name: row.wishlist_name,
        description: row.wishlist_description,
        isFavorite: row.is_favorite,
        orderIndex: row.wishlist_order_index || 0,
        createdAt: row.wishlist_created_at,
        updatedAt: row.wishlist_updated_at,
        items: [],
      });
    }

    // if there's an item for this wishlist, add it
    if (row.item_id) {
      const wishlist = wishlistsMap.get(wishlistId)!;
      wishlist.items.push({
        id: row.item_id,
        wishlistId: row.item_wishlist_id,
        ebayItemId: row.ebay_item_id,
        title: row.item_title,
        imageUrl: row.image_url,
        itemWebUrl: row.item_web_url,
        price: row.price ? parseFloat(row.price) : undefined,
        sellerFeedbackScore: row.seller_feedback_score,
        orderIndex: row.item_order_index || 0,
        isActive: row.is_active,
        createdAt: row.item_created_at,
        updatedAt: row.item_updated_at,
      });
    }
  });

  // convert map to array and add item counts
  return Array.from(wishlistsMap.values()).map((wishlist) => ({
    ...wishlist,
    itemCount: wishlist.items.length,
  }));
}

export async function createWishlist(
  data: CreateWishlistRequest
): Promise<DbWishlist> {
  const { userId, name, description, isFavorite = false, orderIndex } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // if setting as favorite, clear any existing favorites
    if (isFavorite) {
      await client.query(
        `UPDATE wishlists SET is_favorite = false WHERE user_id = $1 AND is_favorite = true`,
        [userId]
      );
    }

    // if no orderIndex provided, get the next highest order
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const { rows } = await client.query(
        `SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM wishlists WHERE user_id = $1`,
        [userId]
      );
      finalOrderIndex = rows[0].next_order;
    }

    const { rows } = await client.query(
      `INSERT INTO wishlists (id, user_id, name, description, is_favorite, order_index)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *;`,
      [userId, name, description || null, isFavorite, finalOrderIndex]
    );

    await client.query("COMMIT");

    return {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      isFavorite: rows[0].is_favorite,
      orderIndex: rows[0].order_index || 0,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
      itemCount: 0,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateWishlist(
  wishlistId: string,
  userId: string,
  data: UpdateWishlistRequest
): Promise<DbWishlist | null> {
  const { name, description, isFavorite } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // if setting as favorite, clear any existing favorites
    if (isFavorite === true) {
      await client.query(
        `UPDATE wishlists SET is_favorite = false WHERE user_id = $1 AND is_favorite = true AND id != $2`,
        [userId, wishlistId]
      );
    }

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

    if (isFavorite !== undefined) {
      updates.push(`is_favorite = $${paramIndex++}`);
      values.push(isFavorite);
    }

    if (updates.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    updates.push(`updated_at = now()`);
    values.push(wishlistId, userId);

    const { rows } = await client.query(
      `UPDATE wishlists 
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );

    await client.query("COMMIT");

    return rows.length > 0
      ? {
          id: rows[0].id,
          name: rows[0].name,
          description: rows[0].description,
          isFavorite: rows[0].is_favorite,
          orderIndex: rows[0].order_index || 0,
          createdAt: rows[0].created_at,
          updatedAt: rows[0].updated_at,
        }
      : null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

export async function removeItemsFromWishlist(
  itemIds: string[],
  userId: string
): Promise<number> {
  const { rowCount } = await pool.query(
    `DELETE FROM wishlist_items 
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

export async function moveItemsToWishlist(
  itemIds: string[],
  targetWishlistId: string,
  userId: string
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify target wishlist belongs to user
    const { rows: targetWishlist } = await client.query(
      `SELECT id FROM wishlists WHERE id = $1 AND user_id = $2`,
      [targetWishlistId, userId]
    );

    if (targetWishlist.length === 0) {
      await client.query("ROLLBACK");
      return 0;
    }

    // Get the next order index for the target wishlist
    const { rows: maxOrder } = await client.query(
      `SELECT COALESCE(MAX(order_index), 0) + 1 as next_order 
       FROM wishlist_items WHERE wishlist_id = $1`,
      [targetWishlistId]
    );

    let nextOrderIndex = maxOrder[0].next_order;

    // First, update the wishlist_id for all items
    const { rowCount } = await client.query(
      `UPDATE wishlist_items 
       SET wishlist_id = $1, updated_at = now()
       WHERE id = ANY($2) 
       AND wishlist_id IN (SELECT id FROM wishlists WHERE user_id = $3)`,
      [targetWishlistId, itemIds, userId]
    );

    if (rowCount && rowCount > 0) {
      // Then update the order indices for the moved items
      for (let i = 0; i < itemIds.length; i++) {
        await client.query(
          `UPDATE wishlist_items 
           SET order_index = $1, updated_at = now()
           WHERE id = $2 AND wishlist_id = $3`,
          [nextOrderIndex + i, itemIds[i], targetWishlistId]
        );
      }
    }

    await client.query("COMMIT");
    return rowCount ?? 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
