import pool from "../index.js";
import {
  DbWishlist,
  DbWishlistItem,
  DbWishlistWithItems,
  CreateWishlistRequest,
  AddItemToWishlistRequest,
  ReorderWishlistsRequest,
} from "../../types/wishlist.js";

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

export async function findWishlistItemsByWishlistId(
  wishlistId: string
): Promise<DbWishlistItem[]> {
  const { rows } = await pool.query(
    `SELECT 
      id,
      wishlist_id,
      ebay_item_id,
      title,
      image_url,
      item_web_url,
      price,
      is_active,
      created_at,
      updated_at
    FROM wishlist_items 
    WHERE wishlist_id = $1 AND is_active = true
    ORDER BY created_at DESC`,
    [wishlistId]
  );
  return rows.map(transformDbRowToWishlistItem);
}

export async function findWishlistsWithItemsByUserId(
  userId: string
): Promise<DbWishlistWithItems[]> {
  const wishlists = await findWishlistsByUserId(userId);

  const wishlistsWithItems = await Promise.all(
    wishlists.map(async (wishlist) => {
      const items = await findWishlistItemsByWishlistId(wishlist.id);
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

export async function addItemToWishlist(
  data: AddItemToWishlistRequest
): Promise<DbWishlistItem> {
  const { wishlistId, ebayItemId, title, imageUrl, itemWebUrl, price } = data;
  const { rows } = await pool.query(
    `INSERT INTO wishlist_items (wishlist_id, ebay_item_id, title, image_url, item_web_url, price)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [
      wishlistId,
      ebayItemId,
      title || null,
      imageUrl || null,
      itemWebUrl || null,
      price || null,
    ]
  );
  return transformDbRowToWishlistItem(rows[0]);
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
