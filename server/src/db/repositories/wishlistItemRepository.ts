import pool from "../index.js";
import {
  DbWishlistItem,
  AddItemToWishlistRequest,
} from "../../types/wishlist.js";

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
      seller_feedback_score,
      order_index,
      availability_status,
      created_at,
      updated_at
    FROM wishlist_items 
    WHERE wishlist_id = $1 AND availability_status IN ('IN_STOCK','LIMITED_STOCK')
    ORDER BY order_index ASC, created_at DESC`,
    [wishlistId]
  );

  return rows.map((row) => ({
    id: row.id,
    wishlistId: row.wishlist_id,
    ebayItemId: row.ebay_item_id,
    title: row.title,
    imageUrl: row.image_url,
    itemWebUrl: row.item_web_url,
    price: row.price ? parseFloat(row.price) : undefined,
    sellerFeedbackScore: row.seller_feedback_score,
    orderIndex: row.order_index || 0,
    availabilityStatus: row.availability_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function addItemToWishlist(
  data: AddItemToWishlistRequest
): Promise<DbWishlistItem> {
  const {
    wishlistId,
    ebayItemId,
    title,
    imageUrl,
    itemWebUrl,
    price,
    sellerFeedbackScore,
  } = data;

  // Use a transaction to ensure atomicity
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Shift all existing items down by 1 to make room at the beginning
    await client.query(
      `UPDATE wishlist_items 
       SET order_index = order_index + 1, updated_at = now()
       WHERE wishlist_id = $1 AND availability_status IN ('IN_STOCK','LIMITED_STOCK')`,
      [wishlistId]
    );

    // Insert the new item at position 0 (the beginning)
    const { rows } = await client.query(
      `INSERT INTO wishlist_items (id, wishlist_id, ebay_item_id, title, image_url, item_web_url, price, seller_feedback_score, order_index)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 0) RETURNING *;`,
      [
        wishlistId,
        ebayItemId,
        title || null,
        imageUrl || null,
        itemWebUrl || null,
        price || null,
        sellerFeedbackScore || null,
      ]
    );

    await client.query("COMMIT");

    return {
      id: rows[0].id,
      wishlistId: rows[0].wishlist_id,
      ebayItemId: rows[0].ebay_item_id,
      title: rows[0].title,
      imageUrl: rows[0].image_url,
      itemWebUrl: rows[0].item_web_url,
      price: rows[0].price ? parseFloat(rows[0].price) : undefined,
      sellerFeedbackScore: rows[0].seller_feedback_score,
      orderIndex: rows[0].order_index || 0,
      availabilityStatus: rows[0].availability_status,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function removeItemFromWishlist(
  itemId: string,
  userId: string
): Promise<boolean> {
  const { rowCount } = await pool.query(
    `UPDATE wishlist_items 
     SET availability_status = 'UNKNOWN_AVAILABILITY', updated_at = now()
     WHERE id = $1 
     AND wishlist_id IN (SELECT id FROM wishlists WHERE user_id = $2)`,
    [itemId, userId]
  );
  return (rowCount ?? 0) > 0;
}
