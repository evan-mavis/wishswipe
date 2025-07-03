import { cn } from "@/lib/utils";
import type { WishlistItem } from "@/types/wishlist";

interface WishlistItemsContainerProps {
	filteredItems: WishlistItem[];
	totalItems: number;
	searchQuery: string;
	children: React.ReactNode;
}

export function WishlistItemsContainer({
	filteredItems,
	totalItems,
	searchQuery,
	children,
}: WishlistItemsContainerProps) {
	return (
		<>
			{searchQuery && (
				<div className="text-muted-foreground mb-4 text-sm">
					Showing {filteredItems.length} of {totalItems} items
				</div>
			)}
			<div
				className={cn(
					"min-h-[200px]", // Minimum height to prevent dramatic resizing
					filteredItems.length === 0 &&
						searchQuery &&
						"flex items-center justify-center"
				)}
			>
				{filteredItems.length === 0 && searchQuery ? (
					<div className="text-muted-foreground py-8 text-center">
						<div className="mb-2 text-lg">No items found</div>
						<div className="text-sm">
							Try a different search term or clear the search
						</div>
					</div>
				) : (
					children
				)}
			</div>
		</>
	);
}
