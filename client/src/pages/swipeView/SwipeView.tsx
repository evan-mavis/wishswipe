import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";
import { useState, useEffect, useRef } from "react";
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

	// Create ref for undo functionality
	const undoRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowWelcome(false);
		}, 4000);

		return () => clearTimeout(timer);
	}, []);

	const handleSearchChange = (value: string) => {
		setSearch(value);
	};

	const handleUndo = () => {
		if (undoRef.current) {
			undoRef.current();
		}
	};

	return (
		<div className="flex min-h-screen">
			<div className="flex w-full flex-1 flex-col items-center justify-center p-0 md:py-4">
				<div className="relative mb-2">
					{showWelcome ? (
						<h1
							className={`animate-keyboard-wave bg-gradient-to-r from-fuchsia-300 via-white to-fuchsia-300 bg-[length:200%_auto] bg-clip-text text-center text-2xl text-transparent transition-opacity duration-500 ${
								showWelcome ? "opacity-100" : "opacity-0"
							}`}
						>
							Welcome, {user?.displayName || "User"}! Swipe away.
						</h1>
					) : (
						<h1
							className={`animate-bounce-in transition-opacity duration-500 ${
								!showWelcome ? "opacity-100" : "opacity-0"
							}`}
						>
							<AppHeaderWithLogo
								fontSize="text-4xl"
								imageHeight="10"
								imageWidth="10"
								margin="2"
							/>
						</h1>
					)}
				</div>

				<ActionToolbar
					search={search}
					setSearch={handleSearchChange}
					filters={filters}
					setFilters={setFilters}
					selectedWishlist={selectedWishlist}
					onWishlistChange={setSelectedWishlist}
					onUndo={handleUndo}
				/>

				<Listings
					searchQuery={search}
					filters={filters}
					selectedWishlistId={selectedWishlist}
					undoRef={undoRef}
				/>
			</div>
		</div>
	);
}
