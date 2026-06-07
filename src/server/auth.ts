import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { ensureDefaultWishlist } from "./wishlists";

export async function getCurrentUser() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  await ensureDefaultWishlist(session.user.id);
  return session.user;
}

export async function requireUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return currentUser;
}

export async function requireApiUser() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  await ensureDefaultWishlist(session.user.id);
  return session.user;
}
