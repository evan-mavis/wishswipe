import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";
import { useState, useEffect } from "react";

export function SwipeView() {
	const { user } = useAuth();
	const [showWelcome, setShowWelcome] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowWelcome(false);
		}, 4000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<SidebarInset>
			<main className="flex min-h-screen">
				<div className="flex flex-1 flex-col items-center justify-center py-4">
					<h1 className="mb-2">
						<AppHeaderWithLogo
							fontSize="text-4xl"
							imageHeight="10"
							imageWidth="10"
							margin="2"
						/>
					</h1>
					<p
						className={`animate-keyboard-wave mb-2 bg-gradient-to-r from-fuchsia-300 via-white to-fuchsia-300 bg-[length:200%_auto] bg-clip-text text-center text-transparent transition-opacity duration-500 ${
							showWelcome ? "opacity-100" : "opacity-0"
						}`}
					>
						Welcome, {user?.displayName || "User"}! Swipe away.
					</p>
					<Listings />
				</div>
			</main>
		</SidebarInset>
	);
}
