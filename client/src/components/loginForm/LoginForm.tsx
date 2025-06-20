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
import { loginOrCreateUser } from "@/services/userService";
import { getAuth } from "firebase/auth";

type LoginFormProps = React.HTMLAttributes<HTMLDivElement>;

export function LoginForm({ className, ...props }: LoginFormProps) {
	const { signInWithGoogle } = useAuth();

	async function handleGoogleLogin() {
		const auth = getAuth();
		await signInWithGoogle();
		const user = auth.currentUser;
		if (!user) return;
		await loginOrCreateUser({
			firebase_uid: user.uid,
			email: user.email || "",
			display_name: user.displayName ?? null,
			photo_url: user.photoURL ?? null,
		});
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
						>
							Login with Google
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
