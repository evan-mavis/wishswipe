import { Reorder } from "framer-motion";
import { GripVertical, Check } from "lucide-react";
import { SavedListingCard } from "./SavedListingCard";
import { Badge } from "@/components/ui/badge";
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
	isActive?: boolean;
}

interface WishlistItemsListProps {
	filteredItems: WishlistItem[];
	listingReorderMode: boolean;
	moveMode?: boolean;
	selectedItems?: Set<string>;
	isMobile: boolean;
	onReorder: (newOrder: WishlistItem[]) => void;
	onDeleteItem: (itemId: string) => void;
	onItemSelection?: (itemId: string) => void;
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
			<div
				className={cn(
					"group bg-card border-border relative w-[120px] overflow-hidden rounded-lg border",
					!item.isActive && "border-red-200 bg-red-50/30 opacity-50"
				)}
			>
				<div className="p-2">
					<div className="relative mb-2 aspect-square overflow-hidden rounded-md">
						<img
							src={listing.imageUrl}
							alt={listing.title}
							className="h-full w-full object-contain"
							draggable={false}
							loading="lazy"
						/>
						{!item.isActive && (
							<div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
								<Badge variant="destructive" className="text-xs">
									Inactive
								</Badge>
							</div>
						)}
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

// Move mode card component with selection
const MoveCard = memo(
	({
		item,
		isSelected,
		onItemSelection,
		convertToListingFormat,
	}: {
		item: WishlistItem;
		isSelected: boolean;
		onItemSelection: (itemId: string) => void;
		convertToListingFormat: (item: WishlistItem) => ListingFormat;
	}) => {
		const listing = convertToListingFormat(item);

		return (
			<div
				className={cn(
					"group bg-card border-border relative w-[120px] cursor-pointer overflow-hidden rounded-lg border transition-all",
					isSelected
						? "border-fuchsia-500 bg-fuchsia-50"
						: "hover:border-fuchsia-300",
					!item.isActive && "border-red-200 bg-red-50/30 opacity-50"
				)}
				onClick={() => onItemSelection(item.id)}
			>
				<div className="p-2">
					<div className="relative mb-2 aspect-square overflow-hidden rounded-md">
						<img
							src={listing.imageUrl}
							alt={listing.title}
							className="h-full w-full object-contain"
							draggable={false}
							loading="lazy"
						/>
						{isSelected && (
							<div className="bg-opacity-20 absolute inset-0 flex items-center justify-center bg-fuchsia-500">
								<Check className="h-6 w-6 rounded-full bg-white p-1 text-fuchsia-600" />
							</div>
						)}
						{!item.isActive && (
							<div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
								<Badge variant="destructive" className="text-xs">
									Inactive
								</Badge>
							</div>
						)}
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
			</div>
		);
	}
);

MoveCard.displayName = "MoveCard";

export function WishlistItemsList({
	filteredItems,
	listingReorderMode,
	moveMode,
	selectedItems = new Set(),
	isMobile,
	onReorder,
	onDeleteItem,
	onItemSelection,
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
					: listingReorderMode || moveMode
						? "flex gap-2" // Reduced gap for reorder/move mode
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
						!isMobile && !listingReorderMode && !moveMode && "snap-center",
						listingReorderMode && "cursor-grab active:cursor-grabbing"
					)}
					drag={listingReorderMode}
				>
					<div
						className={cn(
							"group relative",
							listingReorderMode || moveMode
								? "w-[120px] transition-none" // Even smaller in reorder/move mode
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
						) : moveMode ? (
							<MoveCard
								item={listing}
								isSelected={selectedItems.has(listing.id)}
								onItemSelection={onItemSelection!}
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
