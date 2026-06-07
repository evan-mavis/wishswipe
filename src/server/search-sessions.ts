import "server-only";

import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { userSearchSessions } from "@/db/schema";
import type { SearchFilters } from "@/types/listing";

export async function resetOldSessionsForUser(userId: string) {
  await db
    .update(userSearchSessions)
    .set({
      pageNumber: 1,
      totalItemsSeen: 0,
      lastActivity: new Date(),
    })
    .where(
      and(
        eq(userSearchSessions.userId, userId),
        lt(userSearchSessions.createdAt, sql`now() - interval '7 days'`)
      )
    );
}

export async function getOrCreateSearchSession(
  userId: string,
  searchHash: string,
  searchFilters: SearchFilters
) {
  const [existing] = await db
    .select()
    .from(userSearchSessions)
    .where(
      and(
        eq(userSearchSessions.userId, userId),
        eq(userSearchSessions.searchHash, searchHash)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(userSearchSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSearchSessions.id, existing.id));
    return existing;
  }

  const [created] = await db
    .insert(userSearchSessions)
    .values({
      userId,
      searchHash,
      searchQuery: searchFilters.query || "trending",
      conditionFilter: searchFilters.condition || null,
      categoryFilter: searchFilters.category || null,
      priceMin:
        searchFilters.minPrice === undefined ? null : String(searchFilters.minPrice),
      priceMax:
        searchFilters.maxPrice === undefined ? null : String(searchFilters.maxPrice),
    })
    .returning();

  return created;
}

export async function setNextPage(sessionId: number, pageNumber: number) {
  await db
    .update(userSearchSessions)
    .set({ pageNumber, lastActivity: new Date() })
    .where(eq(userSearchSessions.id, sessionId));
}

export async function updateSessionProgress(
  userId: string,
  sessionId: number,
  itemsSeen: number
) {
  await db
    .update(userSearchSessions)
    .set({
      totalItemsSeen: sql`${userSearchSessions.totalItemsSeen} + ${itemsSeen}`,
      lastActivity: new Date(),
    })
    .where(
      and(
        eq(userSearchSessions.userId, userId),
        eq(userSearchSessions.id, sessionId)
      )
    );
}
