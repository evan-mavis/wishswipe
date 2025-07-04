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
	items: WishlistItem[];
	filteredItems: WishlistItem[];
	searchQuery: string;
	listingReorderMode: boolean;
	isMobile: boolean;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
	onReorderItems: (newOrder: WishlistItem[]) => void;
	onDeleteItem: (itemId: string) => void;
	convertToListingFormat: (item: WishlistItem) => ListingFormat;
}

export function WishlistCardContent({
	isExpanded,
	deleteMode,
	reorderMode,
	items,
	filteredItems,
	searchQuery,
	listingReorderMode,
	isMobile,
	onSearchChange,
	onClearSearch,
	onReorderItems,
	onDeleteItem,
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
							isExpanded &&
							items &&
							items.length > 3 && (
								<WishlistSearchBar
									searchQuery={searchQuery}
									onSearchChange={onSearchChange}
									onClearSearch={onClearSearch}
								/>
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
									isMobile={isMobile}
									onReorder={onReorderItems}
									onDeleteItem={onDeleteItem}
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
