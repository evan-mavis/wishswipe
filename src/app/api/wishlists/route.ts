import { NextResponse } from "next/server";
import { requireApiUser } from "@/server/auth";
import { getWishlists } from "@/server/wishlists";

export async function GET() {
  try {
    const user = await requireApiUser();
    const wishlists = await getWishlists(user.id);
    return NextResponse.json({ wishlists });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Error fetching wishlists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
