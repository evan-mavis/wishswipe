import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";
import { useState, useEffect } from "react";
import { ActionToolbar } from "@/components/actionToolbar/ActionToolbar";

export function SwipeView() {
	const { user } = useAuth();
	const [showWelcome, setShowWelcome] = useState(true);
	const [search, setSearch] = useState("");
	const [selectedWishlist, setSelectedWishlist] = useState<string>("");
	const [filters, setFilters] = useState<{
		condition?: string;
		category?: string;
		minPrice?: number;
		maxPrice?: number;
	}>({});

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowWelcome(false);
		}, 4000);

		return () => clearTimeout(timer);
	}, []);

	const handleSearchChange = (value: string) => {
		setSearch(value);
	};

	return (
		<div className="flex min-h-screen">
			<div className="flex w-full flex-1 flex-col items-center justify-center p-0 md:py-4">
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

				<ActionToolbar
					search={search}
					setSearch={handleSearchChange}
					filters={filters}
					setFilters={setFilters}
					selectedWishlist={selectedWishlist}
					onWishlistChange={setSelectedWishlist}
				/>

				<Listings
					searchQuery={search}
					filters={filters}
					selectedWishlistId={selectedWishlist}
				/>
			</div>
		</div>
	);
}
