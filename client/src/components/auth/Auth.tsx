import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
import { Button } from "../ui/button";

function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [auth]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return user ? (
    <div className="mb-4">
      <p>Welcome, {user.displayName}!</p>
      <Button onClick={signOutUser}>Sign Out</Button>
    </div>
  ) : (
    <div className="mb-4">
      <Button onClick={signInWithGoogle}>Sign in to get started!</Button>
    </div>
  );
}

export default Auth;
