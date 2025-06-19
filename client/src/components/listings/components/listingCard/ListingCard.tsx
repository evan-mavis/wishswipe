import type { Dispatch, SetStateAction } from "react";
import type { Listing, ListingDetails } from "../../../../types/listing";
import { ListingCaption } from "./components/listingCaption/ListingCaption";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
} from "framer-motion";

interface ListingCardProps {
	id: number;
	imageUrl: string;
	details: ListingDetails;
	setListings: Dispatch<SetStateAction<Listing[]>>;
	onProgressChange?: (progress: number) => void;
	index: number; // Add this new prop
}

export function ListingCard({
	id,
	imageUrl,
	details,
	setListings,
	onProgressChange,
	index, // Add this new prop
}: ListingCardProps) {
	const x = useMotionValue(0);
	const DRAG_THRESHOLD = 150;

	useMotionValueEvent(x, "change", (latest) => {
		// Adjust calculation to reach 0/100 at threshold
		const progress = 50 + (latest / DRAG_THRESHOLD) * 50;
		onProgressChange?.(Math.min(Math.max(progress, 0), 100));
	});

	const rotate = useTransform(x, [-DRAG_THRESHOLD, DRAG_THRESHOLD], [-15, 15]);
	const opacity = useTransform(
		x,
		[-DRAG_THRESHOLD, 0, DRAG_THRESHOLD],
		[0.2, 1, 0.2]
	);

	const handleDragEnd = () => {
		const currentX = x.get();
		if (Math.abs(currentX) > DRAG_THRESHOLD) {
			setListings((pv) => pv.filter((v) => v.id !== id));
			// Ensure progress reset happens after animation
			requestAnimationFrame(() => {
				onProgressChange?.(50);
			});
		} else {
			onProgressChange?.(50);
		}
	};

	return (
		<AnimatePresence>
			{index === 0 && (
				<motion.div
					style={{
						gridRow: 1,
						gridColumn: 1,
						x,
						rotate,
						opacity,
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.7}
					className="flex h-full flex-1 cursor-grab flex-col items-center justify-center active:cursor-grabbing"
					onDragEnd={handleDragEnd}
				>
					<div className="pointer-events-none mx-auto flex h-[35vh] w-[300px] items-center justify-center sm:h-[40vh] sm:w-[400px] md:h-[45vh] md:w-[500px] lg:h-[50vh] lg:w-[600px]">
						<img
							src={imageUrl}
							alt="eBay product"
							className="pointer-events-none h-auto max-h-full w-auto max-w-full rounded-4xl object-contain"
							loading="lazy"
							draggable="false"
						/>
					</div>
					<div className="mt-2 sm:mt-4">
						<ListingCaption isActive={true} details={details} />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
