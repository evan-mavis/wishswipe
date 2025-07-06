import { ListingCard } from "./components/listingCard/ListingCard";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { Listing } from "../../types/listing";
import { AnimatePresence } from "framer-motion";
import { PlaceholderListing } from "@/components/placeholderListing/PlaceholderListing";
import { fetchListings } from "@/services/listingsService";
import { debounceSearch } from "@/lib/debounce";
import { userInteractionService } from "@/services/userInteractionService";

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
	const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
	const [dismissedItems, setDismissedItems] = useState<Listing[]>([]);
	const [currentSearchSessionId, setCurrentSearchSessionId] = useState<
		string | null
	>(null);
	const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);

	const handleProgressChange = (progress: number) => {
		onProgressChange?.(progress);
	};

	const fetchMoreListings = useCallback(async () => {
		if (
			isLoading ||
			!hasMoreItems ||
			!currentSearchSessionId ||
			isBackgroundLoading
		)
			return;

		setIsBackgroundLoading(true);
		try {
			const data = await fetchListings(
				{
					query: searchQuery,
					...filters,
				},
				true
			);

			if (data && Array.isArray(data.listings)) {
				// Filter out items that are already in the current listings
				const existingItemIds = new Set(
					listings.map((item: Listing) => item.itemId)
				);
				const newItems = data.listings.filter(
					(item: Listing) => !existingItemIds.has(item.itemId)
				);

				// Append new items to existing listings
				setListings((prev) => [...prev, ...newItems]);
			}
		} catch (err) {
			console.error("Failed to fetch more listings:", err);
		} finally {
			setIsBackgroundLoading(false);
		}
	}, [
		isLoading,
		hasMoreItems,
		currentSearchSessionId,
		searchQuery,
		filters,
		listings,
		isBackgroundLoading,
	]);

	const handleItemDismissed = useCallback(
		(dismissedItem: Listing, swipeDirection: "left" | "right") => {
			// Only add to dismissed items array if it was a left swipe (dismissal)
			if (swipeDirection === "left") {
				setDismissedItems((prev) => {
					const newDismissed = [dismissedItem, ...prev];
					return newDismissed.slice(0, 10); // Keep only last 10 items
				});
			}

			// Record interaction for batch processing
			userInteractionService.addInteraction({
				itemId: dismissedItem.itemId,
				action: swipeDirection,
				searchQuery: searchQuery,
				conditionFilter: filters.condition,
				categoryFilter: filters.category,
				priceMin: filters.minPrice,
				priceMax: filters.maxPrice,
				itemPrice: parseFloat(dismissedItem.price.value),
				searchSessionId: currentSearchSessionId || undefined,
				// Include wishlist data for right swipes
				...(swipeDirection === "right" &&
					selectedWishlistId && {
						wishlistId: selectedWishlistId,
						title: dismissedItem.title,
						imageUrl: dismissedItem.imageUrl,
						itemWebUrl: dismissedItem.itemWebUrl,
						sellerFeedbackScore: dismissedItem.sellerFeedbackScore,
					}),
			});

			// Remove from current listings
			setListings((prev) => {
				const updatedListings = prev.filter(
					(item) => item.itemId !== dismissedItem.itemId
				);

				// Check if we need to fetch more items (5 or fewer remaining)
				if (
					updatedListings.length <= 5 &&
					hasMoreItems &&
					!isLoading &&
					!isBackgroundLoading
				) {
					fetchMoreListings();
				}

				return updatedListings;
			});
		},
		[
			searchQuery,
			filters,
			currentSearchSessionId,
			selectedWishlistId,
			hasMoreItems,
			isLoading,
			isBackgroundLoading,
			fetchMoreListings,
		]
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
			// Flush interaction queue before starting new search
			await userInteractionService.forceFlush();

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
					// Store the session ID and pagination info
					if (data.pagination?.searchSessionId) {
						setCurrentSearchSessionId(
							data.pagination.searchSessionId.toString()
						);
					}
					setHasMoreItems(data.pagination?.hasMoreItems || false);
				} else {
					setListings([]);
					setCurrentSearchSessionId(null);
					setHasMoreItems(false);
				}
			} catch (err) {
				console.error(err);
				setListings([]);
				setCurrentSearchSessionId(null);
				setHasMoreItems(false);
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
