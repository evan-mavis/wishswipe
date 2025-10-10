import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { loginOrCreateUser } from "@/services/loginService";
import { getAuth } from "firebase/auth";
import type { User } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

type LoginFormProps = React.HTMLAttributes<HTMLDivElement>;

export function LoginForm({ className, ...props }: LoginFormProps) {
	const { signInWithGoogle, clearError } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	async function handleGoogleLogin() {
		setIsLoading(true);
		clearError();

		try {
			await signInWithGoogle();

			const auth = getAuth();
			const user = await new Promise<User | null>((resolve) => {
				const unsubscribe = auth.onAuthStateChanged((user) => {
					unsubscribe();
					resolve(user);
				});
			});

			if (!user) {
				throw new Error("Authentication failed");
			}

			// sync with backend
			await loginOrCreateUser({
				firebase_uid: user.uid,
				email: user.email || "",
				display_name: user.displayName ?? null,
				photo_url: user.photoURL ?? null,
			});
		} catch (error) {
			console.error("Login failed:", error);

			// if backend sync fails, sign out from Firebase
			const auth = getAuth();
			if (auth.currentUser) {
				await auth.signOut();
			}

			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border-fuchsia-300">
				<CardHeader className="text-center">
					<CardTitle>
						Welcome to Wish<em className="text-fuchsia-300">Swipe</em>!
					</CardTitle>
					<CardDescription>
						Sign in with your Google account to continue.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<Button
							variant="outline"
							className="w-full"
							onClick={handleGoogleLogin}
							disabled={isLoading}
						>
							{isLoading ? "Signing in..." : "Login with Google"}
						</Button>
						<div className="mt-2 text-center text-sm">
							Don&apos;t have a Google account?
							<a
								href="https://accounts.google.com/signup"
								target="_blank"
								rel="noopener noreferrer"
								className="underline underline-offset-4"
							>
								Create one here
							</a>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
