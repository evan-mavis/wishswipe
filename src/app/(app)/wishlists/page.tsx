import { requireUser } from "@/server/auth";
import { getWishlists } from "@/server/wishlists";
import { WishlistsClient } from "./wishlists-client";

export default async function WishlistsPage() {
  const user = await requireUser();
  const wishlists = await getWishlists(user.id);

  return <WishlistsClient initialWishlists={wishlists} />;
}
