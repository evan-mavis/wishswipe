import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ChevronDown, GripVertical, Star, Pencil } from "lucide-react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SavedListingCard } from "./components/SavedListingCard";
import { ListingReorderControls } from "./components/ListingReorderControls";
import { EditWishlistDialog } from "./components/EditWishlistDialog";
import * as wishlistService from "../../services/wishlistService";
import type { WishList, WishlistItem } from "@/types/wishlist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface WishlistCardProps extends WishList {
	deleteMode: boolean;
	reorderMode?: boolean;
	isSelected: boolean;
	onSelect: () => void;
	onUpdateItems?: (id: string, items: WishlistItem[]) => void;
	onFavorite?: () => void;
	onUpdate?: (id: string, data: { name: string; description: string }) => void;
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
	onFavorite,
	onUpdate,
}: WishlistCardProps) {
	const isMobile = useIsMobile();
	const [isExpanded, setIsExpanded] = useState(false);
	const [items, setItems] = useState(initialItems);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);
	const [listingReorderMode, setListingReorderMode] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);

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

	const handleEditSubmit = (data: { name: string; description: string }) => {
		onUpdate?.(id, data);
	};

	// Add effect to collapse when entering modes
	React.useEffect(() => {
		if (deleteMode || reorderMode) {
			setIsExpanded(false);
		}
	}, [deleteMode, reorderMode]);

	return (
		<>
			<motion.div
				layout
				animate={{
					width: isExpanded
						? isMobile
							? "100%"
							: "calc(100% - 2rem)"
						: "300px",
					position: isExpanded ? "relative" : "static",
					zIndex: isExpanded ? 50 : 0,
				}}
				transition={{ duration: 0.5, ease: "easeInOut" }}
			>
				<div className="relative">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									onClick={(e) => {
										e.stopPropagation();
										onFavorite?.();
									}}
									className={cn(
										"bg-background ring-border absolute -top-3 -right-3 z-10 rounded-full p-1.5 shadow-sm ring-1 transition-all hover:scale-110",
										!isFavorite &&
											"opacity-0 group-hover/card:opacity-60 hover:opacity-100",
										isFavorite && "text-amber-300"
									)}
								>
									<Star
										className="h-4 w-4"
										fill={isFavorite ? "currentColor" : "none"}
									/>
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{isFavorite
										? "Remove as favorite list"
										: "Set as favorite list"}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
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
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CardTitle>{name}</CardTitle>
										{!deleteMode && !reorderMode && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															onClick={(e) => {
																e.stopPropagation();
																setShowEditDialog(true);
															}}
															className={cn(
																"text-muted-foreground hover:text-foreground rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-slate-100 hover:opacity-100 dark:hover:bg-slate-800",
																isMobile || isExpanded
																	? "opacity-60"
																	: "opacity-0 group-hover/card:opacity-60"
															)}
														>
															<Pencil className="h-4 w-4" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Edit wishlist</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
									<div className="flex items-center gap-2">
										{!deleteMode && !reorderMode && isExpanded && (
											<>
												{listingReorderMode ? (
													<ListingReorderControls
														onCancel={(e) => {
															e.stopPropagation();
															handleListingReorderCancel();
														}}
														onSave={(e) => {
															e.stopPropagation();
															handleListingReorderSave();
														}}
													/>
												) : (
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setListingReorderMode(true);
																	}}
																	className="transition-all duration-200 hover:scale-110 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300"
																>
																	<GripVertical className="h-4 w-4" />
																</Button>
															</TooltipTrigger>
															<TooltipContent>
																<p>Reorder wishlist items</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
											</>
										)}
										<motion.div
											animate={{
												rotate: isExpanded
													? isMobile
														? 0
														: 90
													: isMobile
														? 180
														: -90,
											}}
											transition={{ duration: 0.4 }}
											className="cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-800"
											onClick={handleChevronClick}
										>
											<ChevronDown className="h-5 w-5" />
										</motion.div>
									</div>
								</div>
								<p className="text-muted-foreground mb-2 text-sm">
									{description}
								</p>
							</CardHeader>
							<AnimatePresence>
								{isExpanded && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.4, ease: "easeInOut" }}
										className="overflow-hidden"
									>
										<CardContent>
											<Reorder.Group
												axis={isMobile ? "y" : "x"}
												values={items}
												onReorder={(newOrder: WishlistItem[]) => {
													if (listingReorderMode) {
														setItems(newOrder);
													}
												}}
												className={cn(
													"overflow-auto scroll-smooth pb-4 pl-3",
													isMobile
														? "flex flex-col gap-4"
														: listingReorderMode
															? "flex gap-4"
															: "flex snap-x snap-mandatory gap-4"
												)}
												style={{
													scrollBehavior: listingReorderMode
														? "auto"
														: "smooth",
												}}
											>
												{items.map((listing) => (
													<Reorder.Item
														key={listing.id}
														value={listing}
														className={cn(
															"group/item",
															!isMobile && !listingReorderMode && "snap-center",
															listingReorderMode &&
																"cursor-grab active:cursor-grabbing"
														)}
														drag={listingReorderMode}
													>
														<div
															className={cn(
																"group relative",
																listingReorderMode
																	? isMobile
																		? "w-full transition-none"
																		: "w-[150px] transition-none"
																	: isMobile
																		? "w-full transition-all duration-300 ease-in-out"
																		: "w-[300px] transition-all duration-300 ease-in-out"
															)}
															onClick={(e) => e.stopPropagation()}
														>
															<SavedListingCard
																listing={convertToListingFormat(listing)}
																onDelete={
																	!listingReorderMode
																		? () => setItemToDelete(listing.id)
																		: undefined
																}
																isReorderMode={listingReorderMode}
															/>
															{listingReorderMode && (
																<div className="absolute top-1/2 -translate-x-4 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
																	<GripVertical className="text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing" />
																</div>
															)}
														</div>
													</Reorder.Item>
												))}
											</Reorder.Group>
										</CardContent>
									</motion.div>
								)}
							</AnimatePresence>
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
			/>
		</>
	);
}
