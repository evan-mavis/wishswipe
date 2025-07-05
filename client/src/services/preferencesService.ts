export interface Preferences {
	defaultSearchTerm: string;
	defaultCondition: string;
	defaultCategory: string;
	defaultPriceRange: [number, number];
}

const PREFERENCES_KEY = "wishswipe-preferences";

export const preferencesService = {
	loadPreferences: (): Preferences => {
		try {
			const saved = localStorage.getItem(PREFERENCES_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				return {
					defaultSearchTerm: parsed.defaultSearchTerm || "",
					defaultCondition: parsed.defaultCondition || "none",
					defaultCategory: parsed.defaultCategory || "none",
					defaultPriceRange: parsed.defaultPriceRange || [10, 75],
				};
			}
		} catch (error) {
			console.error("Error loading preferences:", error);
		}

		// Return default preferences
		return {
			defaultSearchTerm: "",
			defaultCondition: "none",
			defaultCategory: "none",
			defaultPriceRange: [10, 75],
		};
	},

	savePreferences: (preferences: Preferences): void => {
		try {
			localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
		} catch (error) {
			console.error("Error saving preferences:", error);
			throw error;
		}
	},

	// TODO: Add backend API integration when available
	// savePreferencesToBackend: async (preferences: Preferences): Promise<void> => {
	// 	await axiosInstance.post("/preferences", preferences);
	// },
};
