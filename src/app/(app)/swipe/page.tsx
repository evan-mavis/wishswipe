import { getFavoriteWishlistId, getWishlistOptions } from "@/server/wishlists";
import { getPreferences } from "@/server/preferences";
import { requireUser } from "@/server/auth";
import { SwipeClient } from "./swipe-client";

export default async function SwipePage() {
  const user = await requireUser();
  const [preferences, wishlistOptions] = await Promise.all([
    getPreferences(user.id),
    getWishlistOptions(user.id),
  ]);
  const selectedWishlistId = await getFavoriteWishlistId(user.id);

  return (
    <SwipeClient
      userName={user.name || "User"}
      initialPreferences={preferences}
      initialWishlistCount={wishlistOptions.length}
      initialSelectedWishlistId={selectedWishlistId}
    />
  );
}
