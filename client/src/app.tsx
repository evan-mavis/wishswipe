import { useState, useEffect } from "react";
import "./app.css";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { app } from "./auth/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
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

  return (
    <>
      <div>
        <h1>🛍️WishSwipe🛍️</h1>

        {user ? (
          <div>
            <p>Welcome, {user.displayName}!</p>
            <button onClick={signOutUser}>Sign Out</button>
          </div>
        ) : (
          <button onClick={signInWithGoogle}>Sign In with Google</button>
        )}
      </div>
    </>
  );
}

export default App;
