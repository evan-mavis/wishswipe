import { Scroll } from "lucide-react";

export function WishlistHeader() {
  return (
    <h1 className="hidden items-center text-3xl font-bold md:flex">
      <Scroll />
      <div className="ml-2">My Wishlists</div>
    </h1>
  );
}
