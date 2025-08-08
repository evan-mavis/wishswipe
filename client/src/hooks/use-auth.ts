import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseApp } from "@/auth/firebase";
import {
	refreshWishlistMaintenance,
	resetSearchSessions,
} from "@/services/maintenanceService";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);
	const auth = getAuth(firebaseApp);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setUser(user);
			if (user) {
				const token = await user.getIdToken(true);
				setToken(token);
			} else {
				setToken(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

	// on first login per browser session, force maintenance calls once
	useEffect(() => {
		if (!user) return;
		const sessionKey = `ws:initMaintenance:${user.uid}`;
		if (sessionStorage.getItem(sessionKey) === "1") return;
		sessionStorage.setItem(sessionKey, "1");

		// fire and forget; update debounce keys to avoid immediate re-runs
		const now = Date.now();
		resetSearchSessions().then((ok) => {
			if (ok) localStorage.setItem("ws:lastSearchSessionResetAt", String(now));
		});
		refreshWishlistMaintenance().then(() => {
			localStorage.setItem("ws:lastWishlistMaintenanceAt", String(now));
		});
	}, [user]);

	const signInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error("Error signing in with Google:", error);
		}
	};

	const signOutUser = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error signing out", error);
		}
	};

	return { user, loading, token, signInWithGoogle, signOutUser };
}
