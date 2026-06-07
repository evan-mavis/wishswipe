import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/server/auth";
import { recordInteraction } from "@/server/history";
import { updateSessionProgress } from "@/server/search-sessions";

const interactionSchema = z.object({
  itemId: z.string().min(1),
  action: z.enum(["left", "right"]),
  searchQuery: z.string().default("trending"),
  conditionFilter: z.string().optional(),
  categoryFilter: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  price: z.number(),
  wishlistId: z.string().optional(),
  title: z.string().optional(),
  imageUrl: z.string().optional(),
  itemWebUrl: z.string().optional(),
  sellerFeedbackScore: z.number().int().nonnegative().optional(),
});

const batchInteractionSchema = z.object({
  interactions: z.array(interactionSchema),
  searchSessionId: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const parseResult = batchInteractionSchema.safeParse(await request.json());

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { interactions, searchSessionId } = parseResult.data;

    if (searchSessionId) {
      try {
        const sessionId = Number.parseInt(searchSessionId, 10);
        if (Number.isInteger(sessionId)) {
          await updateSessionProgress(user.id, sessionId, interactions.length);
        }
      } catch (error) {
        console.error("Failed to update session progress:", error);
      }
    }

    for (const interaction of interactions) {
      await recordInteraction(user.id, interaction);
    }

    return NextResponse.json({
      message: `Successfully recorded ${interactions.length} interactions`,
      recordedCount: interactions.length,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Error recording batch interactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
