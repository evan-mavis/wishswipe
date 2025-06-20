import { ArrowDownToLine, Trash2 } from "lucide-react";
import { ListingCard } from "./components/listingCard/ListingCard";
import { Progress } from "../ui/progress";
import { useState, useEffect } from "react";
import type { Listing } from "../../types/listing";
import { AnimatePresence } from "framer-motion";
import { DemoListing } from "@/components/demoListing/DemoListing";
import { fetchListings } from "@/services/listingsService";

export function Listings() {
	const [listings, setListings] = useState<Listing[]>([]);
	const [progress, setProgress] = useState(50);

	const handleProgressChange = (progress: number) => {
		setProgress(progress);
	};

	useEffect(() => {
		fetchListings()
			.then((data) => {
				if (data && Array.isArray(data.listings)) {
					setListings(data.listings);
				} else {
					setListings([]);
				}
			})
			.catch((err) => {
				console.error(err);
				setListings([]);
			});
	}, []);

	return (
		<div className="flex h-full max-h-[calc(100vh-180px)] w-full flex-col">
			<div className="grid w-full flex-1 place-items-center overflow-hidden pb-2">
				{listings.length > 0 ? (
					<AnimatePresence>
						<ListingCard
							key={listings[0].id}
							id={listings[0].id}
							imageUrl={listings[0].imageUrl}
							details={listings[0].details}
							setListings={setListings}
							onProgressChange={handleProgressChange}
							index={0}
						/>
					</AnimatePresence>
				) : (
					<DemoListing text="Come back soon for more listings!" />
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
