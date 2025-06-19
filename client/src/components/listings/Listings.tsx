import { ArrowDownToLine, Trash2 } from "lucide-react";
import { ListingCard } from "./components/listingCard/ListingCard";
import { Progress } from "../ui/progress";
import { useState } from "react";
import type { Listing } from "../../types/listing";
import { AnimatePresence } from "framer-motion";
import { DemoListing } from "@/components/demoListing/DemoListing";

const initialListings: Listing[] = [
	{
		id: 1,
		imageUrl: "/test-image-1.jpg",
		details: {
			title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
			seller: "TechDeals_USA",
			price: 1999.99,
			condition: "New",
		},
	},
	{
		id: 2,
		imageUrl: "/test-image-2.jpg",
		details: {
			title: "PS5 Digital Edition with DualSense Controller",
			seller: "GameStop_Official",
			price: 499.99,
			condition: "New",
		},
	},
	{
		id: 3,
		imageUrl: "/test-image-3.jpg",
		details: {
			title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
			seller: "ElectronicsHub",
			price: 1299.99,
			condition: "New",
		},
	},
	{
		id: 4,
		imageUrl: "/test-image-1.jpg",
		details: {
			title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
			seller: "TechDeals_USA",
			price: 1999.99,
			condition: "New",
		},
	},
	{
		id: 5,
		imageUrl: "/test-image-2.jpg",
		details: {
			title: "PS5 Digital Edition with DualSense Controller",
			seller: "GameStop_Official",
			price: 499.99,
			condition: "New",
		},
	},
	{
		id: 6,
		imageUrl: "/test-image-3.jpg",
		details: {
			title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
			seller: "ElectronicsHub",
			price: 1299.99,
			condition: "New",
		},
	},
	{
		id: 7,
		imageUrl: "/test-image-1.jpg",
		details: {
			title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
			seller: "TechDeals_USA",
			price: 1999.99,
			condition: "New",
		},
	},
	{
		id: 8,
		imageUrl: "/test-image-2.jpg",
		details: {
			title: "PS5 Digital Edition with DualSense Controller",
			seller: "GameStop_Official",
			price: 499.99,
			condition: "New",
		},
	},
	{
		id: 9,
		imageUrl: "/test-image-3.jpg",
		details: {
			title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
			seller: "ElectronicsHub",
			price: 1299.99,
			condition: "New",
		},
	},
];

export function Listings() {
	const [listings, setListings] = useState(initialListings);
	const [progress, setProgress] = useState(50);

	const handleProgressChange = (progress: number) => {
		setProgress(progress);
	};

	return (
		<div className="flex h-full max-h-[calc(100vh-180px)] w-full flex-col">
			<div className="grid w-full flex-1 place-items-center overflow-hidden pb-2">
				{listings.length > 0 ? (
					<AnimatePresence>
						{/* Only show the first listing */}
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
