import axiosInstance from "../interceptors/axiosInstance";

export async function fetchListings() {
	const response = await axiosInstance.get("/wishswipe/explore/");
	return response.data;
}
