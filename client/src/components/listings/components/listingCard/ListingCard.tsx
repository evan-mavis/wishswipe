import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Listing } from "../../../../types/listing";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
	animate,
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
	const [isKeyboardAnimating, setIsKeyboardAnimating] = useState(false);
	// guard against rapid/held key swipes
	const lastKeySwipeAtRef = useRef<number>(0);
	const SWIPE_KEY_COOLDOWN_MS = 300;

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

	const commitSwipe = useCallback(
		(direction: "left" | "right") => {
			setIsDragCommitted(true);
			if (direction === "right") {
				onProgressChange?.(100);
			} else {
				onProgressChange?.(0);
			}
			setTimeout(() => {
				onProgressChange?.(50);
			}, 200);
			if (onItemDismissed) {
				onItemDismissed(listing, direction);
			} else {
				setListings((pv) => pv.filter((v) => v.itemId !== listing.itemId));
			}
		},
		[listing, onItemDismissed, onProgressChange, setListings]
	);

	const handleDragEnd = async () => {
		const currentX = x.get();
		if (Math.abs(currentX) > DRAG_THRESHOLD) {
			const swipeDirection = currentX > 0 ? "right" : "left";
			commitSwipe(swipeDirection);
		} else {
			onProgressChange?.(50);
		}
	};

	// desktop-only arrow key support for the top card
	useEffect(() => {
		if (isMobile || index !== 0) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			// ignore when typing in inputs or editable elements
			const target = event.target as HTMLElement | null;
			if (target) {
				const tag = target.tagName?.toLowerCase();
				const isInputLike =
					tag === "input" ||
					tag === "textarea" ||
					tag === "select" ||
					target.isContentEditable;
				if (isInputLike) return;
			}

			// block auto-repeat and rapid taps
			if (event.repeat) return;
			const now = Date.now();
			if (now - lastKeySwipeAtRef.current < SWIPE_KEY_COOLDOWN_MS) return;

			if (isDragCommitted || isKeyboardAnimating) return;
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				lastKeySwipeAtRef.current = now;
				// inline call to avoid dependency on triggerKeyboardSwipe
				const overshoot = 10;
				const targetX = -1 * (DRAG_THRESHOLD + overshoot);
				x.stop();
				setIsKeyboardAnimating(true);
				animate(x, targetX, { duration: 0.2, ease: "easeOut" }).then(() => {
					commitSwipe("left");
					setIsKeyboardAnimating(false);
				});
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				lastKeySwipeAtRef.current = now;
				const overshoot = 10;
				const targetX = 1 * (DRAG_THRESHOLD + overshoot);
				x.stop();
				setIsKeyboardAnimating(true);
				animate(x, targetX, { duration: 0.2, ease: "easeOut" }).then(() => {
					commitSwipe("right");
					setIsKeyboardAnimating(false);
				});
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [
		isMobile,
		index,
		isDragCommitted,
		isKeyboardAnimating,
		DRAG_THRESHOLD,
		x,
		commitSwipe,
	]);

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
