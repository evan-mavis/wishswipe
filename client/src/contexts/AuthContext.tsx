import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { createContext, useState, useEffect, type ReactNode } from "react";
import { firebaseApp } from "@/auth/firebase";
import {
	refreshWishlistMaintenance,
	resetSearchSessions,
} from "@/services/maintenanceService";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	signInWithGoogle: () => Promise<void>;
	signOutUser: () => Promise<void>;
	clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const auth = getAuth(firebaseApp);

	// handle auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

	// on each login, trigger maintenance
	useEffect(() => {
		if (!user) return;

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
			setError(null);
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in with Google";
			setError(errorMessage);
			throw error;
		}
	};

	const signOutUser = async () => {
		try {
			setError(null);
			await signOut(auth);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to sign out";
			setError(errorMessage);
			throw error;
		}
	};

	const clearError = () => setError(null);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				error,
				signInWithGoogle,
				signOutUser,
				clearError,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
