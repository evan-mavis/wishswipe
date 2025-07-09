import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { SavedListingCard } from "./SavedListingCard";
import type { WishlistItem } from "@/types/wishlist";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface ListingFormat {
	id: string;
	itemId: string;
	title: string;
	price: {
		value: string;
		currency: string;
	};
	condition: string;
	itemWebUrl: string;
	imageUrl?: string;
	sellerFeedbackScore: number;
}

interface WishlistItemsListProps {
	filteredItems: WishlistItem[];
	listingReorderMode: boolean;
	isMobile: boolean;
	onReorder: (newOrder: WishlistItem[]) => void;
	onDeleteItem: (itemId: string) => void;
	convertToListingFormat: (item: WishlistItem) => ListingFormat;
}

// Lightweight card component for reorder mode to improve performance
const ReorderCard = memo(
	({
		item,
		convertToListingFormat,
	}: {
		item: WishlistItem;
		convertToListingFormat: (item: WishlistItem) => ListingFormat;
	}) => {
		const listing = convertToListingFormat(item);

		return (
			<div className="group bg-card border-border relative w-[120px] overflow-hidden rounded-lg border">
				<div className="p-2">
					<div className="relative mb-2 aspect-square overflow-hidden rounded-md">
						<img
							src={listing.imageUrl}
							alt={listing.title}
							className="h-full w-full object-contain"
							draggable={false}
							loading="lazy"
						/>
					</div>
					<div className="space-y-1">
						<h3 className="line-clamp-2 text-xs leading-tight font-medium">
							{listing.title}
						</h3>
						<p className="text-muted-foreground text-xs font-semibold">
							${listing.price.value}
						</p>
					</div>
				</div>
				<div className="absolute top-1/2 -translate-x-3 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
					<GripVertical className="text-muted-foreground h-3 w-3 cursor-grab active:cursor-grabbing" />
				</div>
			</div>
		);
	}
);

ReorderCard.displayName = "ReorderCard";

export function WishlistItemsList({
	filteredItems,
	listingReorderMode,
	isMobile,
	onReorder,
	onDeleteItem,
	convertToListingFormat,
}: WishlistItemsListProps) {
	return (
		<Reorder.Group
			axis={isMobile ? "y" : "x"}
			values={filteredItems}
			onReorder={onReorder}
			className={cn(
				"overflow-auto scroll-smooth pb-4 pl-3",
				isMobile
					? "flex flex-col gap-4"
					: listingReorderMode
						? "flex gap-2" // Reduced gap for reorder mode
						: "flex snap-x snap-mandatory gap-4"
			)}
			style={{
				scrollBehavior: listingReorderMode ? "auto" : "smooth",
			}}
		>
			{filteredItems.map((listing) => (
				<Reorder.Item
					key={listing.id}
					value={listing}
					className={cn(
						"group/item",
						!isMobile && !listingReorderMode && "snap-center",
						listingReorderMode && "cursor-grab active:cursor-grabbing"
					)}
					drag={listingReorderMode}
				>
					<div
						className={cn(
							"group relative",
							listingReorderMode
								? "w-[120px] transition-none" // Even smaller in reorder mode
								: isMobile
									? "w-full transition-all duration-300 ease-in-out"
									: "w-[300px] transition-all duration-300 ease-in-out"
						)}
						onClick={(e) => e.stopPropagation()}
					>
						{listingReorderMode ? (
							<ReorderCard
								item={listing}
								convertToListingFormat={convertToListingFormat}
							/>
						) : (
							<SavedListingCard
								listing={convertToListingFormat(listing)}
								onDelete={() => onDeleteItem(listing.id)}
								isReorderMode={false}
							/>
						)}
					</div>
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
}
