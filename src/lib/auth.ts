import "server-only";

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/db";
import { ensureDefaultWishlist } from "@/server/wishlists";

export const auth = betterAuth({
  appName: "WishSwipe",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
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
