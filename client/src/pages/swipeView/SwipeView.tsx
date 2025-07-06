import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";
import { useState, useEffect, useRef, useCallback } from "react";
import { ActionToolbar } from "@/components/actionToolbar/ActionToolbar";
import { PlaceholderListing } from "@/components/placeholderListing/PlaceholderListing";
import { ListingCaption } from "@/components/listings/components/listingCaption/ListingCaption";
import { Progress } from "@/components/ui/progress";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import type { Listing } from "@/types/listing";
import { Link } from "react-router-dom";
import { preferencesService } from "@/services/preferencesService";

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
	const [progress, setProgress] = useState(50);
	const [currentListing, setCurrentListing] = useState<Listing | null>(null);
	const [wishlistCount, setWishlistCount] = useState<number>(0);
	const [wishlistsLoading, setWishlistsLoading] = useState(true);

	// Create ref for undo functionality
	const undoRef = useRef<(() => void) | null>(null);
	// Create ref for undo count
	const undoCountRef = useRef<number>(0);

	// Load user preferences on mount
	useEffect(() => {
		const loadPreferences = async () => {
			try {
				const preferences = await preferencesService.loadPreferences();
				if (preferences.defaultSearchTerm) {
					setSearch(preferences.defaultSearchTerm);
				}

				// Only apply filters if they differ from defaults
				const defaultPriceRange = [10, 75];
				const hasCustomCondition =
					preferences.defaultCondition &&
					preferences.defaultCondition !== "none";
				const hasCustomCategory =
					preferences.defaultCategory && preferences.defaultCategory !== "none";
				const hasCustomPriceRange =
					preferences.defaultPriceRange[0] !== defaultPriceRange[0] ||
					preferences.defaultPriceRange[1] !== defaultPriceRange[1];

				if (hasCustomCondition || hasCustomCategory || hasCustomPriceRange) {
					setFilters({
						condition: hasCustomCondition
							? preferences.defaultCondition
							: undefined,
						category: hasCustomCategory
							? preferences.defaultCategory
							: undefined,
						minPrice: hasCustomPriceRange
							? preferences.defaultPriceRange[0]
							: undefined,
						maxPrice: hasCustomPriceRange
							? preferences.defaultPriceRange[1]
							: undefined,
					});
				}
			} catch (error) {
				console.error("Error loading preferences:", error);
			}
		};

		loadPreferences();
	}, []);

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

	const handleProgressChange = (progress: number) => {
		setProgress(progress);
	};

	const handleCurrentListingChange = (listing: Listing | null) => {
		setCurrentListing(listing);
	};

	const handleWishlistCountChange = useCallback((count: number) => {
		setWishlistCount(count);
	}, []);

	const handleWishlistsLoadingChange = useCallback((loading: boolean) => {
		setWishlistsLoading(loading);
	}, []);

	return (
		<div className="flex min-h-screen flex-col">
			{/* Header - compact height */}
			<div className="flex min-h-[60px] items-center justify-center px-4">
				<div className="relative">
					{showWelcome ? (
						<h1
							className={`animate-keyboard-wave bg-gradient-to-r from-fuchsia-300 via-white to-fuchsia-300 bg-[length:200%_auto] bg-clip-text text-center text-xl text-transparent transition-opacity duration-500 ${
								showWelcome ? "opacity-100" : "opacity-0"
							}`}
						>
							Welcome, {user?.displayName || "User"}! Swipe away.
						</h1>
					) : (
						<h1
							className={`animate-bounce-intransition-opacity duration-500 ${
								!showWelcome ? "opacity-100" : "opacity-0"
							}`}
						>
							<AppHeaderWithLogo
								fontSize="text-3xl"
								imageHeight="8"
								imageWidth="8"
								margin="0"
							/>
						</h1>
					)}
				</div>
			</div>

			{/* Action Toolbar - compact height */}
			<div className="flex min-h-[80px] items-center justify-center px-4 py-1">
				<ActionToolbar
					search={search}
					setSearch={handleSearchChange}
					filters={filters}
					setFilters={setFilters}
					selectedWishlist={selectedWishlist}
					onWishlistChange={setSelectedWishlist}
					onUndo={handleUndo}
					undoCount={undoCountRef.current}
					onWishlistCountChange={handleWishlistCountChange}
					onWishlistsLoadingChange={handleWishlistsLoadingChange}
				/>
			</div>

			{/* Image Area - flexible with max height */}
			<div className="mt-1 flex max-h-[60vh] flex-1 items-center justify-center px-4">
				{wishlistsLoading ? (
					<PlaceholderListing text="Loading wishlists..." />
				) : wishlistCount === 0 ? (
					<PlaceholderListing
						text="Create a wishlist to start swiping!"
						showArrows={false}
						actionButton={
							<Link
								to="/wishlist"
								className="inline-flex items-center rounded-lg bg-fuchsia-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-fuchsia-600"
							>
								My Wishlists
							</Link>
						}
					/>
				) : (
					<Listings
						searchQuery={search}
						filters={filters}
						selectedWishlistId={selectedWishlist}
						undoRef={undoRef}
						undoCountRef={undoCountRef}
						onProgressChange={handleProgressChange}
						onCurrentListingChange={handleCurrentListingChange}
					/>
				)}
			</div>

			{/* Caption Area - compact height */}
			{wishlistCount > 0 && (
				<div className="flex min-h-[40px] items-center justify-center px-4 py-1">
					{currentListing ? (
						<ListingCaption
							key={currentListing.itemId}
							isActive={true}
							listing={currentListing}
						/>
					) : (
						<div className="text-center text-gray-500">No listing selected</div>
					)}
				</div>
			)}

			{/* Progress Bar - compact height */}
			{wishlistCount > 0 && (
				<div className="flex min-h-[60px] items-center justify-center px-4 py-1">
					<div className="mx-auto flex w-full max-w-[600px] items-center justify-center">
						<Trash2
							size={28}
							className={`mr-4 transition-all duration-300 ${
								progress < 5 ? "scale-150 text-red-500" : ""
							}`}
						/>
						<div className="flex-1">
							<Progress
								value={progress}
								className="bg-gray-200 [&>div]:bg-fuchsia-400"
							/>
						</div>
						<ArrowDownToLine
							size={28}
							className={`ml-4 transition-all duration-300 ${
								progress > 95 ? "scale-150 text-green-500" : ""
							}`}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
