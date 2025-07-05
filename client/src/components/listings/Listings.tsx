import { ListingCard } from "./components/listingCard/ListingCard";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { Listing } from "../../types/listing";
import { AnimatePresence } from "framer-motion";
import { PlaceholderListing } from "@/components/placeholderListing/PlaceholderListing";
import { fetchListings } from "@/services/listingsService";
import { debounceSearch } from "@/lib/debounce";

interface ListingsProps {
	searchQuery?: string;
	filters?: {
		condition?: string;
		category?: string;
		minPrice?: number;
		maxPrice?: number;
	};
	selectedWishlistId?: string;
	undoRef?: { current: (() => void) | null }; // Use object with current property
	undoCountRef?: { current: number }; // Add ref for undo count
	onProgressChange?: (progress: number) => void;
	onCurrentListingChange?: (listing: Listing | null) => void;
}

export function Listings({
	searchQuery = "",
	filters = {},
	selectedWishlistId,
	undoRef,
	undoCountRef,
	onProgressChange,
	onCurrentListingChange,
}: ListingsProps) {
	const [listings, setListings] = useState<Listing[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [dismissedItems, setDismissedItems] = useState<Listing[]>([]);

	const handleProgressChange = (progress: number) => {
		onProgressChange?.(progress);
	};

	const handleItemDismissed = useCallback(
		(dismissedItem: Listing, swipeDirection: "left" | "right") => {
			// Only add to dismissed items array if it was a left swipe (dismissal)
			if (swipeDirection === "left") {
				setDismissedItems((prev) => {
					const newDismissed = [dismissedItem, ...prev];
					return newDismissed.slice(0, 10); // Keep only last 10 items
				});
			}

			// Remove from current listings
			setListings((prev) =>
				prev.filter((item) => item.itemId !== dismissedItem.itemId)
			);
		},
		[]
	);

	const handleUndo = useCallback(() => {
		if (dismissedItems.length === 0) return;

		const [lastDismissed, ...remainingDismissed] = dismissedItems;

		// Remove from dismissed items
		setDismissedItems(remainingDismissed);

		// Add back to the top of listings
		setListings((prev) => [lastDismissed, ...prev]);
	}, [dismissedItems]);

	// Expose undo function to parent via ref
	useEffect(() => {
		if (undoRef) {
			undoRef.current = handleUndo;
		}
	}, [undoRef, handleUndo]);

	// Expose undo count to parent via ref
	useEffect(() => {
		if (undoCountRef) {
			undoCountRef.current = dismissedItems.length;
		}
	}, [undoCountRef, dismissedItems.length]);

	// Update current listing when listings change
	useEffect(() => {
		if (listings.length > 0) {
			onCurrentListingChange?.(listings[0]);
		} else {
			onCurrentListingChange?.(null);
		}
	}, [listings, onCurrentListingChange]);

	const fetchListingsWithQuery = useCallback(
		async (query: string) => {
			setIsLoading(true);

			// Clear dismissed items when fetching new listings
			setDismissedItems([]);

			try {
				const data = await fetchListings({
					query,
					...filters,
				});
				if (data && Array.isArray(data.listings)) {
					setListings(data.listings);
				} else {
					setListings([]);
				}
			} catch (err) {
				console.error(err);
				setListings([]);
			} finally {
				setIsLoading(false);
			}
		},
		[filters]
	);

	// Create debounced search function with cleanup - memoized to prevent recreation
	const { debouncedFunc: debouncedSearch, cleanup } = useMemo(
		() => debounceSearch(fetchListingsWithQuery, 500),
		[fetchListingsWithQuery]
	);

	useEffect(() => {
		debouncedSearch(searchQuery);
	}, [searchQuery, debouncedSearch]);

	useEffect(() => {
		return cleanup;
	}, [cleanup]);

	return (
		<div className="flex h-full w-full flex-col">
			<div className="grid w-full flex-1 place-items-center">
				{isLoading ? (
					<PlaceholderListing text="Searching eBay..." />
				) : listings.length > 0 ? (
					<AnimatePresence mode="popLayout">
						{listings.map((listing, index) => (
							<ListingCard
								key={`${listing.itemId}-${index}`}
								listing={listing}
								setListings={setListings}
								onItemDismissed={handleItemDismissed}
								onProgressChange={handleProgressChange}
								index={index}
								selectedWishlistId={selectedWishlistId}
							/>
						))}
					</AnimatePresence>
				) : (
					<PlaceholderListing text="No listings found. Try a different search!" />
				)}
			</div>
		</div>
	);
}
