import pool from "../index.js";
import {
  DbWishlistItem,
  AddItemToWishlistRequest,
} from "../../types/wishlist.js";

// Transform database row (snake_case) to TypeScript interface (camelCase)
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

export async function removeItemFromWishlist(
  itemId: number,
  userId: string
): Promise<boolean> {
  const { rowCount } = await pool.query(
    `UPDATE wishlist_items 
     SET is_active = false, updated_at = now()
     WHERE id = $1 
     AND wishlist_id IN (SELECT id FROM wishlists WHERE user_id = $2)`,
    [itemId, userId]
  );
  return (rowCount ?? 0) > 0;
}
