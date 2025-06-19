import { Scroll } from "lucide-react";

export function WishlistHeader() {
  return (
    <h1 className="flex items-center text-3xl font-bold">
      <Scroll />
      <div className="ml-2 text-fuchsia-300">My Wishlists</div>
    </h1>
  );
}
