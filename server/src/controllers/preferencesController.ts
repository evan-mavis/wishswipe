import { Request, Response } from "express";
import { z } from "zod";
import { preferencesRepository } from "../db/repositories/preferencesRepository.js";

// zod schema for upserting user preferences
const upsertPreferencesSchema = z.object({
  defaultSearchTerm: z.string().optional(),
  defaultCondition: z.string().optional(),
  defaultCategory: z.string().optional(),
  defaultPriceRange: z.array(z.number().min(0).max(200)).length(2).optional(),
});

export const getUserPreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const preferences = await preferencesRepository.getUserPreferences(
      req.dbUser.id
    );

    if (!preferences) {
      // Return default preferences if none exist
      res.json({
        defaultSearchTerm: "",
        defaultCondition: "none",
        defaultCategory: "none",
        defaultPriceRange: [10, 75],
      });
      return;
    }

    // Transform database format to frontend format
    const transformedPreferences = {
      defaultSearchTerm: preferences.default_search_term,
      defaultCondition: preferences.default_condition,
      defaultCategory: preferences.default_category,
      defaultPriceRange: [
        preferences.default_price_min,
        preferences.default_price_max,
      ],
    };

    res.json(transformedPreferences);
  } catch (error) {
    console.error("Error getting user preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const upsertUserPreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = upsertPreferencesSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "invalid request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const {
      defaultSearchTerm,
      defaultCondition,
      defaultCategory,
      defaultPriceRange,
    } = parseResult.data;

    // Transform frontend format to database format
    const preferences = {
      default_search_term: defaultSearchTerm,
      default_condition: defaultCondition,
      default_category: defaultCategory,
      default_price_min: defaultPriceRange?.[0],
      default_price_max: defaultPriceRange?.[1],
    };

    const updatedPreferences =
      await preferencesRepository.upsertUserPreferences(
        req.dbUser.id,
        preferences
      );

    // Transform back to frontend format
    const response = {
      defaultSearchTerm: updatedPreferences.default_search_term,
      defaultCondition: updatedPreferences.default_condition,
      defaultCategory: updatedPreferences.default_category,
      defaultPriceRange: [
        updatedPreferences.default_price_min,
        updatedPreferences.default_price_max,
      ],
    };

    res.json(response);
  } catch (error) {
    console.error("Error upserting user preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
