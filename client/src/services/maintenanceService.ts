import axios from "@/interceptors/axiosInstance";

export async function refreshWishlistMaintenance(): Promise<void> {
	try {
		await axios.post("/wishswipe/maintenance/refresh");
	} catch {
		// ignore failures; do not block UI
	}
}

export async function refreshWishlistMaintenanceDebounced(
	minutes: number = 10
): Promise<void> {
	try {
		const KEY = "ws:lastWishlistMaintenanceAt";
		const now = Date.now();
		const last = localStorage.getItem(KEY);
		let shouldRun = true;

		if (last) {
			const lastMs = parseInt(last, 10);
			const diffMin = (now - lastMs) / (1000 * 60);
			shouldRun = diffMin >= minutes;
		}

		if (!shouldRun) return;

		await refreshWishlistMaintenance();
		localStorage.setItem(KEY, String(now));
	} catch {
		// ignore
	}
}

export async function resetSearchSessions(): Promise<boolean> {
	try {
		await axios.post("/wishswipe/maintenance/reset-sessions");
		return true;
	} catch {
		return false;
	}
}

export async function resetSearchSessionsDebounced(
	minutes: number = 60
): Promise<void> {
	try {
		const KEY = "ws:lastSearchSessionResetAt";
		const now = Date.now();
		const last = localStorage.getItem(KEY);
		let shouldReset = true;

		if (last) {
			const lastMs = parseInt(last, 10);
			const diffMin = (now - lastMs) / (1000 * 60);
			shouldReset = diffMin >= minutes;
		}

		if (!shouldReset) return;

		const ok = await resetSearchSessions();
		if (ok) localStorage.setItem(KEY, String(now));
	} catch {
		// ignore errors
	}
}
