import { NextResponse } from "next/server";
import { requireApiUser } from "@/server/auth";
import { refreshWishlistMaintenance } from "@/server/maintenance";

export async function POST() {
  try {
    const user = await requireApiUser();
    const staleHours = Number.parseInt(process.env.WISHLIST_STALE_HOURS || "24", 10);
    const maxItems = Number.parseInt(process.env.WISHLIST_REFRESH_LIMIT || "60", 10);
    const availabilitySummary = await refreshWishlistMaintenance(user.id, {
      maxItemsToCheck: maxItems,
      staleAfterHours: staleHours,
    });

    return NextResponse.json({ ok: true, availabilitySummary });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Maintenance refresh failed:", error);
    return NextResponse.json(
      { error: "Maintenance refresh failed" },
      { status: 500 }
    );
  }
}
