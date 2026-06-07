import "server-only";

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getDb, schema } from "@/db";
import { ensureDefaultWishlist } from "@/server/wishlists";

function createAuth() {
  return betterAuth({
    appName: "WishSwipe",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema,
    }),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (createdUser) => {
            await ensureDefaultWishlist(createdUser.id);
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;

let auth: Auth | null = null;

export function getAuth() {
  if (!auth) {
    auth = createAuth();
  }

  return auth;
}
