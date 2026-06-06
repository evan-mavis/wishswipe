import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { createId } from "@/lib/ids";

export interface Preferences {
  defaultSearchTerm: string;
  defaultCondition: string;
  defaultCategory: string;
  defaultPriceRange: [number, number];
}

export const defaultPreferences: Preferences = {
  defaultSearchTerm: "",
  defaultCondition: "none",
  defaultCategory: "none",
  defaultPriceRange: [10, 75],
};

export async function getPreferences(userId: string): Promise<Preferences> {
  const [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (!preferences) return defaultPreferences;

  return {
    defaultSearchTerm: preferences.defaultSearchTerm,
    defaultCondition: preferences.defaultCondition,
    defaultCategory: preferences.defaultCategory,
    defaultPriceRange: [preferences.defaultPriceMin, preferences.defaultPriceMax],
  };
}

export async function savePreferences(userId: string, preferences: Preferences) {
  await db
    .insert(userPreferences)
    .values({
      id: createId(),
      userId,
      defaultSearchTerm: preferences.defaultSearchTerm,
      defaultCondition: preferences.defaultCondition,
      defaultCategory: preferences.defaultCategory,
      defaultPriceMin: preferences.defaultPriceRange[0],
      defaultPriceMax: preferences.defaultPriceRange[1],
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: {
        defaultSearchTerm: preferences.defaultSearchTerm,
        defaultCondition: preferences.defaultCondition,
        defaultCategory: preferences.defaultCategory,
        defaultPriceMin: preferences.defaultPriceRange[0],
        defaultPriceMax: preferences.defaultPriceRange[1],
        updatedAt: new Date(),
      },
    });
}

export async function deletePreferences(userId: string) {
  await db.delete(userPreferences).where(eq(userPreferences.userId, userId));
}
