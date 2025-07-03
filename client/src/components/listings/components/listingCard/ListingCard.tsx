import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import type { Listing } from "../../../../types/listing";
import { ListingCaption } from "../listingCaption/ListingCaption";
import * as wishlistService from "../../../../services/wishlistService";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
} from "framer-motion";
import { getLargerImageUrl } from "@/lib/image";

interface ListingCardProps {
	listing: Listing;
	setListings: Dispatch<SetStateAction<Listing[]>>;
	onItemDismissed?: (dismissedItem: Listing) => void;
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
	selectedWishlistId,
}: ListingCardProps) {
	const x = useMotionValue(0);
	const DRAG_THRESHOLD = 150;
	const [isDragCommitted, setIsDragCommitted] = useState(false);

	// Reset drag committed state when this card becomes active (index === 0)
	useEffect(() => {
		if (index === 0) {
			setIsDragCommitted(false);
		}
	}, [index]);

	useMotionValueEvent(x, "change", (latest) => {
		// Don't update progress if drag is already committed
		if (isDragCommitted) return;

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

			// Swipe right (positive X) - add to wishlist
			if (currentX > 0 && selectedWishlistId) {
				try {
					await wishlistService.addItemToWishlist({
						wishlistId: selectedWishlistId,
						ebayItemId: listing.itemId,
						title: listing.title,
						imageUrl: listing.imageUrl,
						itemWebUrl: listing.itemWebUrl,
						price: listing.price ? parseFloat(listing.price.value) : undefined,
						sellerFeedbackScore: listing.sellerFeedbackScore,
					});
					console.log("Item added to wishlist successfully");
				} catch (error) {
					console.error("Error adding item to wishlist:", error);
					// Could show a toast notification here for better UX
				}
			}
			// Swipe left (negative X) - just dismiss (no action needed)

			// Call onItemDismissed if provided, otherwise fallback to setListings
			if (onItemDismissed) {
				onItemDismissed(listing);
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
							src={displayImageUrl}
							alt="eBay product"
							className="pointer-events-none h-auto max-h-full w-auto max-w-full rounded-4xl object-contain"
							loading="lazy"
							draggable="false"
						/>
					</div>
					<div className="mt-2 sm:mt-4">
						<ListingCaption isActive={true} listing={listing} />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
