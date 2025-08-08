import { WishlistItemService } from "../services/wishlistItemService.js";

export async function runExpiredItemsCheck() {
  const summary = await WishlistItemService.checkAllActiveItems();
  return summary;
}
