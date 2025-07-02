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
}

export function Listings({ searchQuery = "", filters = {} }: ListingsProps) {
	const [listings, setListings] = useState<Listing[]>([]);
	const [progress, setProgress] = useState(50);
	const [isLoading, setIsLoading] = useState(false);

	const handleProgressChange = (progress: number) => {
		setProgress(progress);
	};

	const fetchListingsWithQuery = useCallback(
		async (query: string) => {
			setIsLoading(true);

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
					<AnimatePresence>
						<ListingCard
							key={listings[0].id}
							listing={listings[0]}
							setListings={setListings}
							onProgressChange={handleProgressChange}
							index={0}
						/>
					</AnimatePresence>
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
