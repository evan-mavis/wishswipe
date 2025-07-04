import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { WishlistCardHeader } from "./components/WishlistCardHeader";
import { WishlistCardContent } from "./components/WishlistCardContent";
import { EditWishlistDialog } from "./components/EditWishlistDialog";
import * as wishlistService from "../../services/wishlistService";
import type { WishList, WishlistItem } from "@/types/wishlist";
import { cn } from "@/lib/utils";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WishlistCardProps extends WishList {
	deleteMode: boolean;
	reorderMode?: boolean;
	isSelected: boolean;
	onSelect: () => void;
	onUpdateItems?: (id: string, items: WishlistItem[]) => void;
	onUpdate?: (
		id: string,
		data: { name: string; description: string; isFavorite: boolean }
	) => void;
}

export function WishlistCard({
	id,
	name,
	description,
	items: initialItems,
	deleteMode,
	reorderMode,
	isSelected,
	onSelect,
	onUpdateItems,
	isFavorite,
	onUpdate,
}: WishlistCardProps) {
	const isMobile = useIsMobile();
	const [isExpanded, setIsExpanded] = useState(false);
	const [items, setItems] = useState(initialItems);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);
	const [listingReorderMode, setListingReorderMode] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return items;
		return items.filter((item) =>
			item.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
		);
	}, [items, searchQuery]);

	// Disable reorder mode when searching or on mobile
	const canReorder =
		!isMobile && !searchQuery.trim() && filteredItems.length === items.length;

	const handleClick = () => {
		if (deleteMode) {
			onSelect();
		}
	};

	const handleChevronClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!deleteMode && !reorderMode) {
			setIsExpanded(!isExpanded);
		}
	};

	// Convert WishlistItem to Listing format for SavedListingCard
	const convertToListingFormat = (item: WishlistItem) => ({
		id: item.ebayItemId,
		itemId: item.ebayItemId,
		title: item.title || "",
		price: {
			value: item.price?.toString() || "0",
			currency: "USD",
		},
		condition: "New", // You might want to add this to your backend data
		itemWebUrl: item.itemWebUrl || "",
		imageUrl: item.imageUrl,
		sellerFeedbackScore: item.sellerFeedbackScore || 0,
	});

	const handleDeleteItem = async (itemId: string) => {
		try {
			await wishlistService.removeItemsFromWishlist([itemId]);

			// Update local state after successful deletion
			const newItems = items.filter((item) => item.id !== itemId);
			setItems(newItems);
			onUpdateItems?.(id, newItems);
			setItemToDelete(null);
		} catch (error) {
			console.error("Error deleting item from wishlist:", error);
			// Close the dialog even if there's an error
			setItemToDelete(null);
		}
	};

	const handleListingReorderSave = async () => {
		try {
			// Only save if we're not in search mode (all items are visible)
			if (filteredItems.length !== items.length) {
				console.warn("Cannot reorder while search is active");
				setListingReorderMode(false);
				return;
			}

			const itemIds = items.map((item) => item.id);
			await wishlistService.reorderWishlistItems(itemIds);

			// Update the parent component with the new order
			onUpdateItems?.(id, items);
			setListingReorderMode(false);
		} catch (error) {
			console.error("Error reordering wishlist items:", error);
			// Revert to original order on error
			setItems(initialItems);
			setListingReorderMode(false);
		}
	};

	const handleListingReorderCancel = () => {
		setItems(initialItems);
		setListingReorderMode(false);
	};

	const handleEditSubmit = (data: {
		name: string;
		description: string;
		isFavorite: boolean;
	}) => {
		onUpdate?.(id, data);
	};

	const handleReorderItems = (newOrder: WishlistItem[]) => {
		if (listingReorderMode && filteredItems.length === items.length) {
			setItems(newOrder);
		}
	};

	// Add effect to collapse when entering modes
	React.useEffect(() => {
		if (deleteMode || reorderMode) {
			setIsExpanded(false);
		}
	}, [deleteMode, reorderMode]);

	// Disable reorder mode when search is active or on mobile
	React.useEffect(() => {
		if (!canReorder && listingReorderMode) {
			setListingReorderMode(false);
		}
	}, [canReorder, listingReorderMode]);

	return (
		<>
			<motion.div
				layout={!isMobile || !searchQuery} // Disable layout animation on mobile when searching
				animate={{
					width: isExpanded
						? isMobile
							? "100%"
							: "calc(100% - 2rem)"
						: isMobile
							? "100%" // Keep full width on mobile even when collapsed
							: "300px",
					position: isExpanded ? "relative" : "static",
					zIndex: isExpanded ? 50 : 0,
				}}
				transition={{
					duration: isMobile ? (searchQuery ? 0.1 : 0.2) : 0.5,
					ease: "easeInOut",
				}}
			>
				<div className="relative">
					{/* Favorite Icon - only shown when wishlist is favorite */}
					{isFavorite && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="bg-background ring-border absolute -top-3 -right-3 z-10 rounded-full p-1.5 text-amber-300 shadow-sm ring-1">
										<Star className="h-4 w-4" fill="currentColor" />
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Favorite wishlist</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}

					<Card
						className={cn(
							"transition-all duration-200",
							deleteMode || reorderMode ? "cursor-default" : "cursor-pointer",
							deleteMode
								? "hover:border-red-300"
								: reorderMode
									? "cursor-grab hover:border-green-400 active:cursor-grabbing"
									: "border-fuchsia-300 hover:shadow-md",
							isSelected && "border-2 border-red-500",
							isExpanded && "max-w-full"
						)}
						onClick={handleClick}
					>
						<div className="group/card relative">
							<WishlistCardHeader
								name={name}
								description={description || ""}
								isExpanded={isExpanded}
								deleteMode={deleteMode}
								reorderMode={reorderMode}
								listingReorderMode={listingReorderMode}
								canReorder={canReorder}
								isMobile={isMobile}
								onEdit={() => setShowEditDialog(true)}
								onChevronClick={handleChevronClick}
								onReorderStart={(e) => {
									e.stopPropagation();
									setListingReorderMode(true);
								}}
								onReorderCancel={(e) => {
									e.stopPropagation();
									handleListingReorderCancel();
								}}
								onReorderSave={(e) => {
									e.stopPropagation();
									handleListingReorderSave();
								}}
							/>

							<WishlistCardContent
								isExpanded={isExpanded}
								deleteMode={deleteMode}
								reorderMode={reorderMode}
								items={items}
								filteredItems={filteredItems}
								searchQuery={searchQuery}
								listingReorderMode={listingReorderMode}
								isMobile={isMobile}
								onSearchChange={setSearchQuery}
								onClearSearch={() => setSearchQuery("")}
								onReorderItems={handleReorderItems}
								onDeleteItem={setItemToDelete}
								convertToListingFormat={convertToListingFormat}
							/>
						</div>
					</Card>
				</div>
			</motion.div>

			<AlertDialog
				open={itemToDelete !== null}
				onOpenChange={() => setItemToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Item</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this item? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 hover:bg-red-600"
							onClick={() => itemToDelete && handleDeleteItem(itemToDelete)}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<EditWishlistDialog
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
				onSubmit={handleEditSubmit}
				initialName={name}
				initialDescription={description}
				initialIsFavorite={isFavorite}
			/>
		</>
	);
}
