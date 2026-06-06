"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { deletePreferences, savePreferences } from "@/server/preferences";

const preferencesSchema = z.object({
  defaultSearchTerm: z.string(),
  defaultCondition: z.string(),
  defaultCategory: z.string(),
  defaultPriceRange: z.tuple([z.number(), z.number()]),
});

export async function savePreferencesAction(input: unknown) {
  const user = await requireUser();
  const preferences = preferencesSchema.parse(input);
  await savePreferences(user.id, preferences);
  revalidatePath("/settings");
  revalidatePath("/swipe");
}

export async function resetPreferencesAction() {
  const user = await requireUser();
  await deletePreferences(user.id);
  revalidatePath("/settings");
  revalidatePath("/swipe");
}
