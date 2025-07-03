import { ArrowDownToLine, Trash2 } from "lucide-react";
import { ListingCard } from "./components/listingCard/ListingCard";
import { Progress } from "../ui/progress";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { Listing } from "../../types/listing";
import { AnimatePresence } from "framer-motion";
import { DemoListing } from "@/components/demoListing/DemoListing";
import { fetchListings } from "@/services/listingsService";
import { debounceSearch } from "@/utils/debounce";

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
}

export function Listings({
	searchQuery = "",
	filters = {},
	selectedWishlistId,
	undoRef,
}: ListingsProps) {
	const [listings, setListings] = useState<Listing[]>([]);
	const [progress, setProgress] = useState(50);
	const [isLoading, setIsLoading] = useState(false);
	const [dismissedItems, setDismissedItems] = useState<Listing[]>([]);

	const handleProgressChange = (progress: number) => {
		setProgress(progress);
	};

	const handleItemDismissed = useCallback((dismissedItem: Listing) => {
		// Add to dismissed items array (keep only last 10)
		setDismissedItems(prev => {
			const newDismissed = [dismissedItem, ...prev];
			return newDismissed.slice(0, 10); // Keep only last 10 items
		});
		
		// Remove from current listings
		setListings(prev => prev.filter(item => item.itemId !== dismissedItem.itemId));
	}, []);

	const handleUndo = useCallback(() => {
		if (dismissedItems.length === 0) return;
		
		const [lastDismissed, ...remainingDismissed] = dismissedItems;
		
		// Remove from dismissed items
		setDismissedItems(remainingDismissed);
		
		// Add back to the top of listings
		setListings(prev => [lastDismissed, ...prev]);
	}, [dismissedItems]);

	// Expose undo function to parent via ref
	useEffect(() => {
		if (undoRef) {
			undoRef.current = handleUndo;
		}
	}, [undoRef, handleUndo]);

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
		<div className="flex h-full max-h-[calc(100vh-180px)] w-full flex-col">
			<div className="grid w-full flex-1 place-items-center overflow-hidden pb-2">
				{isLoading ? (
					<DemoListing text="Searching eBay..." />
				) : listings.length > 0 ? (
					<div className="relative h-full w-full">
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
					</div>
				) : (
					<DemoListing text="No listings found. Try a different search!" />
				)}
			</div>
			<div className="mx-auto flex w-full max-w-[600px] items-center justify-center px-4 py-4">
				<Trash2
					size={32}
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
					size={32}
					className={`ml-4 transition-all duration-300 ${
						progress > 95 ? "scale-150 text-green-500" : ""
					}`}
				/>
			</div>
		</div>
	);
}
