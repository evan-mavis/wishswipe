import axiosInstance from "../interceptors/axiosInstance";

export async function fetchListings(query?: string) {
	const params = query ? { q: query } : {};
	const response = await axiosInstance.get("/wishswipe/explore/", { params });
	return response.data;
}
