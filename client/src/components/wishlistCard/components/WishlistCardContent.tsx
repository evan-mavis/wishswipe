import { motion, AnimatePresence } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { WishlistSearchBar } from "./WishlistSearchBar";
import { WishlistItemsContainer } from "./WishlistItemsContainer";
import { WishlistItemsList } from "./WishlistItemsList";
import type { WishlistItem } from "@/types/wishlist";

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

interface WishlistCardContentProps {
	isExpanded: boolean;
	deleteMode: boolean;
	reorderMode?: boolean;
	moveMode?: boolean;
	items: WishlistItem[];
	filteredItems: WishlistItem[];
	searchQuery: string;
	listingReorderMode: boolean;
	isMobile: boolean;
	selectedItems?: Set<string>;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
	onReorderItems: (newOrder: WishlistItem[]) => void;
	onDeleteItem: (itemId: string) => void;
	onItemSelection?: (itemId: string) => void;
	onSelectAll?: () => void;
	onMoveItems?: () => void;
	onMoveCancel?: () => void;
	convertToListingFormat: (item: WishlistItem) => ListingFormat;
}

export function WishlistCardContent({
	isExpanded,
	deleteMode,
	reorderMode,
	moveMode,
	items,
	filteredItems,
	searchQuery,
	listingReorderMode,
	isMobile,
	selectedItems = new Set(),
	onSearchChange,
	onClearSearch,
	onReorderItems,
	onDeleteItem,
	onItemSelection,
	onSelectAll,
	onMoveItems,
	onMoveCancel,
	convertToListingFormat,
}: WishlistCardContentProps) {
	return (
		<AnimatePresence>
			{isExpanded && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{
						duration: isMobile ? 0.2 : 0.4,
						ease: "easeInOut",
					}}
					className="overflow-hidden"
				>
					<CardContent>
						{/* Search Bar */}
						{!deleteMode &&
							!reorderMode &&
							!moveMode &&
							isExpanded &&
							items &&
							items.length > 3 && (
								<WishlistSearchBar
									searchQuery={searchQuery}
									onSearchChange={onSearchChange}
									onClearSearch={onClearSearch}
								/>
							)}

						{/* Move Mode Controls */}
						{moveMode && isExpanded && (
							<div className="mb-4 flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-sm">
										{selectedItems.size} item{selectedItems.size > 1 ? "s" : ""}{" "}
										selected
									</span>
									{selectedItems.size > 0 && (
										<button
											onClick={onSelectAll}
											className="text-xs text-fuchsia-600 hover:text-fuchsia-800"
										>
											{selectedItems.size === filteredItems.length
												? "Deselect All"
												: "Select All"}
										</button>
									)}
								</div>
								<div className="flex gap-2">
									{onMoveCancel && (
										<button
											onClick={onMoveCancel}
											className="rounded bg-gray-500 px-3 py-1 text-xs text-white hover:bg-gray-600"
										>
											Cancel
										</button>
									)}
									{selectedItems.size > 0 && onMoveItems && (
										<button
											onClick={onMoveItems}
											className="rounded bg-fuchsia-600 px-3 py-1 text-xs text-white hover:bg-fuchsia-700"
										>
											Move Items
										</button>
									)}
								</div>
							</div>
						)}

						{/* Items Container */}
						{!deleteMode && !reorderMode && isExpanded && (
							<WishlistItemsContainer
								filteredItems={filteredItems}
								totalItems={items ? items.length : 0}
								searchQuery={searchQuery}
							>
								<WishlistItemsList
									filteredItems={filteredItems}
									listingReorderMode={listingReorderMode}
									moveMode={moveMode}
									selectedItems={selectedItems}
									isMobile={isMobile}
									onReorder={onReorderItems}
									onDeleteItem={onDeleteItem}
									onItemSelection={onItemSelection}
									convertToListingFormat={convertToListingFormat}
								/>
							</WishlistItemsContainer>
						)}
					</CardContent>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
