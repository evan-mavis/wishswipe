import { NextResponse } from "next/server";
import { requireApiUser } from "@/server/auth";
import { getWishlistOptions } from "@/server/wishlists";

export async function GET() {
  try {
    const user = await requireApiUser();
    const wishlists = await getWishlistOptions(user.id);
    return NextResponse.json({ wishlists });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Error fetching wishlist options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
