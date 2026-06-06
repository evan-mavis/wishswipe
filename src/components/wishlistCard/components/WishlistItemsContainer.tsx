import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
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
	const isMobile = useIsMobile();

	return (
		<>
			{searchQuery && (
				<div className="text-muted-foreground mb-4 text-sm">
					Showing {filteredItems.length} of {totalItems} items
				</div>
			)}
			<div
				className={cn(
					isMobile ? "min-h-[300px]" : "min-h-[200px]", // Slightly larger min-height on mobile
					"w-full", // Ensure consistent width
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
