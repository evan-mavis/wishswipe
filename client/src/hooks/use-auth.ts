import {
	getAuth,
	signInWithPopup, // Changed from signInWithRedirect
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseApp } from "@/auth/firebase";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth(firebaseApp);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

	const signInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider); // Changed from signInWithRedirect
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

	return { user, loading, signInWithGoogle, signOutUser };
}
