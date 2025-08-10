import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import type { Listing } from "../../../../types/listing";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
} from "framer-motion";
import { getLargerImageUrl } from "@/lib/image";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingCardProps {
	listing: Listing;
	setListings: Dispatch<SetStateAction<Listing[]>>;
	onItemDismissed?: (
		dismissedItem: Listing,
		swipeDirection: "left" | "right"
	) => void;
	onProgressChange?: (progress: number) => void;
	index: number;
	selectedWishlistId?: string;
}

export function ListingCard({
	listing,
	setListings,
	onItemDismissed,
	onProgressChange,
	index,
}: ListingCardProps) {
	const isMobile = useIsMobile();
	const x = useMotionValue(0);
	const DRAG_THRESHOLD = isMobile ? 80 : 150;
	const [isDragCommitted, setIsDragCommitted] = useState(false);

	useEffect(() => {
		if (index === 0) {
			setIsDragCommitted(false);
		}
	}, [index]);

	useMotionValueEvent(x, "change", (latest) => {
		// Don't update progress if drag is already committed
		if (isDragCommitted) return;

		// Only update progress if the movement is significant enough
		// more sensitive on mobile - smaller movement threshold
		const movementThreshold = isMobile ? 5 : 10;
		if (Math.abs(latest) < movementThreshold) return;

		// Adjust calculation to reach 0/100 at threshold
		const progress = 50 + (latest / DRAG_THRESHOLD) * 50;
		onProgressChange?.(Math.min(Math.max(progress, 0), 100));
	});

	const rotate = useTransform(x, [-DRAG_THRESHOLD, DRAG_THRESHOLD], [-27, 27]);
	const opacity = useTransform(
		x,
		[-DRAG_THRESHOLD, 0, DRAG_THRESHOLD],
		[0.2, 1, 0.2]
	);

	const handleDragEnd = async () => {
		const currentX = x.get();
		if (Math.abs(currentX) > DRAG_THRESHOLD) {
			// Set flag to prevent further progress updates
			setIsDragCommitted(true);

			if (currentX > 0) {
				onProgressChange?.(100);
			} else {
				onProgressChange?.(0);
			}

			setTimeout(() => {
				onProgressChange?.(50);
			}, 200);

			// Determine swipe direction
			const swipeDirection = currentX > 0 ? "right" : "left";

			// Call onItemDismissed if provided, otherwise fallback to setListings
			if (onItemDismissed) {
				onItemDismissed(listing, swipeDirection);
			} else {
				// Fallback to old behavior for backward compatibility
				setListings((pv) => pv.filter((v) => v.itemId !== listing.itemId));
			}
		} else {
			onProgressChange?.(50);
		}
	};

	const displayImageUrl = getLargerImageUrl(listing.imageUrl);

	return (
		<AnimatePresence>
			{index === 0 && (
				<motion.div
					style={{
						x,
						rotate,
						opacity,
						contain: "layout style paint",
						willChange: "transform",
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={isMobile ? 0.8 : 0.7}
					className="relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
					onDragEnd={handleDragEnd}
				>
					<div className="pointer-events-none mx-auto flex w-full items-center justify-center px-4">
						<img
							src={displayImageUrl}
							alt="eBay product"
							className="pointer-events-none h-auto max-h-[60vh] w-auto max-w-full rounded-4xl object-contain"
							loading="lazy"
							draggable="false"
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
