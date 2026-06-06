import { NextResponse } from "next/server";
import { requireApiUser } from "@/server/auth";
import { resetOldSessionsForUser } from "@/server/search-sessions";

export async function POST() {
  try {
    const user = await requireApiUser();
    await resetOldSessionsForUser(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Reset sessions failed:", error);
    return NextResponse.json({ error: "Reset sessions failed" }, { status: 500 });
  }
}
