import axiosInstance from "@/interceptors/axiosInstance";

export interface Preferences {
	defaultSearchTerm: string;
	defaultCondition: string;
	defaultCategory: string;
	defaultPriceRange: [number, number];
}

export const preferencesService = {
	loadPreferences: async (): Promise<Preferences> => {
		try {
			const response = await axiosInstance.get("/wishswipe/preferences");
			return response.data;
		} catch (error) {
			console.error("Error loading preferences:", error);
			return {
				defaultSearchTerm: "",
				defaultCondition: "none",
				defaultCategory: "none",
				defaultPriceRange: [10, 75],
			};
		}
	},

	savePreferences: async (preferences: Preferences): Promise<void> => {
		try {
			await axiosInstance.patch("/wishswipe/preferences", preferences);
		} catch (error) {
			console.error("Error saving preferences:", error);
			throw error;
		}
	},

	deletePreferences: async (): Promise<void> => {
		try {
			await axiosInstance.delete("/wishswipe/preferences");
		} catch (error) {
			console.error("Error deleting preferences:", error);
			throw error;
		}
	},
};
