import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";

export function SwipeView() {
	const { user } = useAuth();

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
					<p className="mb-2 text-center">
						Welcome, {user?.displayName || "User"}! Swipe away.
					</p>
					<Listings />
				</div>
			</main>
		</SidebarInset>
	);
}
