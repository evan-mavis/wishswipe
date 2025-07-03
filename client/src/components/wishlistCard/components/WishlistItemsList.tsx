import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { SavedListingCard } from "./SavedListingCard";
import type { WishlistItem } from "@/types/wishlist";
import { cn } from "@/lib/utils";

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
						<SavedListingCard
							listing={convertToListingFormat(listing)}
							onDelete={
								!listingReorderMode ? () => onDeleteItem(listing.id) : undefined
							}
							isReorderMode={listingReorderMode}
						/>
						{listingReorderMode && (
							<div className="absolute top-1/2 -translate-x-3 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
								<GripVertical className="text-muted-foreground h-3 w-3 cursor-grab active:cursor-grabbing" />
							</div>
						)}
					</div>
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
}
