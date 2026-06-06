"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

type LoginFormProps = React.HTMLAttributes<HTMLDivElement> & {
	missingAuthEnv?: string[];
};

export function LoginForm({
	className,
	missingAuthEnv = [],
	...props
}: LoginFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const isAuthConfigured = missingAuthEnv.length === 0;

	async function handleGoogleLogin() {
		if (!isAuthConfigured) {
			toast.error("Local auth setup is incomplete.");
			return;
		}

		setIsLoading(true);

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/swipe",
			});
		} catch (error) {
			console.error("Login failed:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in. Please try again.";
			toast.error(errorMessage);
			setIsLoading(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border-fuchsia-300/70 shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>
						Welcome to Wish<em className="text-fuchsia-300">Swipe</em>
					</CardTitle>
					<CardDescription>
						Sign in with Google to discover and save eBay finds.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<Button
							variant="outline"
							className="w-full"
							onClick={handleGoogleLogin}
							disabled={isLoading || !isAuthConfigured}
						>
							{isLoading
								? "Opening Google..."
								: isAuthConfigured
									? "Continue with Google"
									: "Auth setup required"}
						</Button>
						{!isAuthConfigured ? (
							<div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-100">
								Missing local env: {missingAuthEnv.join(", ")}.
							</div>
						) : null}
						<div className="text-muted-foreground text-center text-sm">
							Your account is created automatically on first sign-in.
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
