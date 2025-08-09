import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";
import { useState, useEffect, useRef, useCallback } from "react";
import { ActionToolbar } from "@/components/actionToolbar/actionToolbar";
import { PlaceholderListing } from "@/components/placeholderListing/PlaceholderListing";
import { ListingCaption } from "@/components/listings/components/listingCaption/ListingCaption";
import { Progress } from "@/components/ui/progress";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import type { Listing } from "@/types/listing";
import { Link } from "react-router-dom";
import { preferencesService } from "@/services/preferencesService";
import { resetSearchSessionsDebounced } from "@/services/maintenanceService";
import { userInteractionService } from "@/services/userInteractionService";
import { useNavigationFlush } from "@/hooks/use-navigation-flush";
import { useIsMobile } from "@/hooks/use-mobile";

export function SwipeView() {
	const { user } = useAuth();
	const isMobile = useIsMobile();
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

	// Use navigation flush hook to ensure interactions are saved when switching UIs
	useNavigationFlush();

	// Load user preferences on mount
	useEffect(() => {
		const loadPreferences = async () => {
			try {
				resetSearchSessionsDebounced(60);

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

	// Handle page visibility changes and cleanup
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				// Page is hidden, flush any pending interactions
				userInteractionService.forceFlush();
			}
		};

		const handleBeforeUnload = () => {
			// Page is being unloaded, flush any pending interactions
			userInteractionService.forceFlush();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
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

	const handleInteractionAdded = useCallback(() => {
		// When an interaction is added, we don't need to do anything immediately
		// The userInteractionService will handle batching and flushing
	}, []);

	return (
		<div className="flex min-h-screen flex-col">
			<div
				className={`flex items-center justify-center px-4 ${isMobile ? "min-h-[40px]" : "min-h-[60px]"}`}
			>
				<div className="relative">
					{showWelcome ? (
						<h1
							className={`animate-keyboard-wave bg-gradient-to-r from-fuchsia-300 via-white to-fuchsia-300 bg-[length:200%_auto] bg-clip-text text-center text-transparent transition-opacity duration-500 ${
								showWelcome ? "opacity-100" : "opacity-0"
							} ${isMobile ? "text-sm" : "text-xl"}`}
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
								fontSize={isMobile ? "text-lg" : "text-3xl"}
								imageHeight={isMobile ? "5" : "8"}
								imageWidth={isMobile ? "5" : "8"}
								margin="0"
							/>
						</h1>
					)}
				</div>
			</div>

			<div
				className={`flex items-center justify-center px-4 ${isMobile ? "min-h-[60px] py-0" : "min-h-[80px] py-1"}`}
			>
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
			<div
				className={`flex items-center justify-center px-4 ${isMobile ? "mt-1 h-[50vh]" : "mt-1 max-h-[75vh] flex-1"}`}
			>
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
						onInteractionAdded={handleInteractionAdded}
					/>
				)}
			</div>

			{wishlistCount > 0 && (
				<div
					className={`flex items-center justify-center px-4 ${isMobile ? "mt-1 min-h-[30px] py-0" : "min-h-[40px] py-1"}`}
				>
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

			{wishlistCount > 0 && (
				<div
					className={`flex items-center justify-center px-4 ${isMobile ? "mt-1 min-h-[40px] py-0" : "min-h-[60px] py-1"}`}
				>
					<div className="mx-auto flex w-full max-w-[600px] items-center justify-center">
						<Trash2
							size={isMobile ? 24 : 28}
							className={`mr-4 transition-transform duration-300 ${
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
							size={isMobile ? 24 : 28}
							className={`ml-4 transition-transform duration-300 ${
								progress > 95 ? "scale-150 text-green-500" : ""
							}`}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
