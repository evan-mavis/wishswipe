import {
	getAuth,
	signInWithRedirect,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseApp } from "@/auth/firebase";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const auth = getAuth(firebaseApp);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
		});
		return unsubscribe;
	}, [auth]);

	const signInWithGoogle = async () => {
		try {
			await signInWithRedirect(auth, new GoogleAuthProvider());
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

	return { user, signInWithGoogle, signOutUser };
}
