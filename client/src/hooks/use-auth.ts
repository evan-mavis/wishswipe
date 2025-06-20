import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseApp } from "@/auth/firebase";

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
				console.log("Auth Token for Postman:", token);
			} else {
				setToken(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

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
