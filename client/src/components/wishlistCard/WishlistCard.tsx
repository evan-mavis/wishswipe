import { useState, useMemo, useCallback } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	moveMode?: boolean;
	isSelected: boolean;
	onSelect: () => void;
	onUpdateItems?: (id: string, items: WishlistItem[]) => void;
	onUpdate?: (
		id: string,
		data: { name: string; description: string; isFavorite: boolean }
	) => void;
	availableWishlists?: Array<{ id: string; name: string }>;
	onRefreshWishlists?: () => void;
}

export function WishlistCard({
	id,
	name,
	description,
	items: initialItems,
	deleteMode,
	reorderMode,
	moveMode,
	isSelected,
	onSelect,
	onUpdateItems,
	isFavorite,
	onUpdate,
	availableWishlists = [],
	onRefreshWishlists,
}: WishlistCardProps) {
	const isMobile = useIsMobile();
	const [isExpanded, setIsExpanded] = useState(false);
	const [items, setItems] = useState(initialItems || []);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);
	const [listingReorderMode, setListingReorderMode] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [targetWishlistId, setTargetWishlistId] = useState<string>("");
	const [showMoveDialog, setShowMoveDialog] = useState(false);
	const [listingMoveMode, setListingMoveMode] = useState(false);

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		if (!items || !searchQuery.trim()) return items || [];
		return items.filter((item) =>
			item.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
		);
	}, [items, searchQuery]);

	// Disable reorder mode when searching or on mobile
	const canReorder =
		!isMobile &&
		!searchQuery.trim() &&
		items &&
		filteredItems.length === items.length;

	// Filter out current wishlist from available wishlists
	const otherWishlists = useMemo(() => {
		return availableWishlists.filter((wishlist) => wishlist.id !== id);
	}, [availableWishlists, id]);

	const handleClick = () => {
		if (deleteMode || moveMode) {
			onSelect();
		}
	};

	const handleChevronClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!deleteMode && !reorderMode && !moveMode) {
			setIsExpanded(!isExpanded);
		}
	};

	// Convert WishlistItem to Listing format for SavedListingCard
	const convertToListingFormat = useCallback(
		(item: WishlistItem) => ({
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
		}),
		[]
	);

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

	const handleMoveItems = async () => {
		if (!targetWishlistId || selectedItems.size === 0) return;

		try {
			await wishlistService.moveItemsToWishlist({
				itemIds: Array.from(selectedItems),
				targetWishlistId,
			});

			// Remove moved items from current wishlist
			const remainingItems = items.filter(
				(item) => !selectedItems.has(item.id)
			);
			setItems(remainingItems);
			onUpdateItems?.(id, remainingItems);

			// Reset move mode state
			setSelectedItems(new Set());
			setTargetWishlistId("");
			setShowMoveDialog(false);
			setListingMoveMode(false);

			// Trigger refresh to update all wishlists
			onRefreshWishlists?.();
		} catch (error) {
			console.error("Error moving items:", error);
		}
	};

	const handleItemSelection = (itemId: string) => {
		setSelectedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(itemId)) {
				newSet.delete(itemId);
			} else {
				newSet.add(itemId);
			}
			return newSet;
		});
	};

	const handleSelectAll = () => {
		if (selectedItems.size === filteredItems.length) {
			setSelectedItems(new Set());
		} else {
			setSelectedItems(new Set(filteredItems.map((item) => item.id)));
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
			setItems(initialItems || []);
			setListingReorderMode(false);
		}
	};

	const handleListingReorderCancel = () => {
		setItems(initialItems || []);
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

	const handleMoveStart = (e: React.MouseEvent) => {
		e.stopPropagation();
		setListingMoveMode(true);
	};

	const handleMoveCancel = () => {
		setListingMoveMode(false);
		setSelectedItems(new Set());
	};

	// Add effect to collapse when entering modes
	React.useEffect(() => {
		if (deleteMode || reorderMode || moveMode) {
			setIsExpanded(false);
		}
	}, [deleteMode, reorderMode, moveMode]);

	// Disable reorder mode when search is active or on mobile
	React.useEffect(() => {
		if (!canReorder && listingReorderMode) {
			setListingReorderMode(false);
		}
	}, [canReorder, listingReorderMode]);

	// Reset selected items when move mode is disabled
	React.useEffect(() => {
		if (!moveMode && !listingMoveMode) {
			setSelectedItems(new Set());
		}
	}, [moveMode, listingMoveMode]);

	return (
		<>
			<motion.div
				layout={false} // Disable layout animations to prevent sidebar trigger movement
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
							deleteMode || reorderMode || moveMode
								? "cursor-default"
								: "cursor-pointer",
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
								moveMode={moveMode || listingMoveMode}
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
								onMoveStart={handleMoveStart}
							/>

							<WishlistCardContent
								isExpanded={isExpanded}
								deleteMode={deleteMode}
								reorderMode={reorderMode}
								moveMode={moveMode || listingMoveMode}
								items={items}
								filteredItems={filteredItems}
								searchQuery={searchQuery}
								listingReorderMode={listingReorderMode}
								isMobile={isMobile}
								selectedItems={selectedItems}
								onSearchChange={setSearchQuery}
								onClearSearch={() => setSearchQuery("")}
								onReorderItems={handleReorderItems}
								onDeleteItem={setItemToDelete}
								onItemSelection={handleItemSelection}
								onSelectAll={handleSelectAll}
								onMoveItems={() => setShowMoveDialog(true)}
								onMoveCancel={handleMoveCancel}
								convertToListingFormat={convertToListingFormat}
							/>
						</div>
					</Card>
				</div>
			</motion.div>

			{/* Move Items Dialog */}
			<AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Move Items</AlertDialogTitle>
						<AlertDialogDescription>
							Select a wishlist to move {selectedItems.size} selected item
							{selectedItems.size > 1 ? "s" : ""} to:
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="py-4">
						<Select
							value={targetWishlistId}
							onValueChange={setTargetWishlistId}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose a wishlist..." />
							</SelectTrigger>
							<SelectContent>
								{otherWishlists.map((wishlist) => (
									<SelectItem key={wishlist.id} value={wishlist.id}>
										{wishlist.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setShowMoveDialog(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={!targetWishlistId}
							onClick={handleMoveItems}
							className="bg-fuchsia-600 hover:bg-fuchsia-700"
						>
							Move Items
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

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
