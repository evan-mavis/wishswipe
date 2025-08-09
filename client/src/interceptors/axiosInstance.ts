import axios from "axios";
import { getAuth } from "firebase/auth";

const baseURL = import.meta.env?.VITE_API_BASE || window.location.origin;
const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(
	async (config) => {
		const auth = getAuth();
		const user = auth.currentUser;
		if (user) {
			const token = await user.getIdToken();
			if (config.headers && typeof config.headers.set === "function") {
				config.headers.set("Authorization", `Bearer ${token}`);
			} else if (config.headers) {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
