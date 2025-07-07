import type { AnalyticsData } from "@/types/analytics";
import axiosInstance from "../interceptors/axiosInstance";

export const analyticsService = {
	async getAnalytics(): Promise<AnalyticsData> {
		try {
			const response = await axiosInstance.get("/wishswipe/analytics");
			return response.data;
		} catch (error) {
			console.error("Error fetching analytics:", error);
			throw new Error("Failed to fetch analytics data");
		}
	},
};
