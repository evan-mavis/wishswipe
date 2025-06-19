import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
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
import type { WishList, Listing } from "@/types/listing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";

interface WishlistCardProps extends WishList {
	deleteMode: boolean;
	reorderMode?: boolean; // Add reorderMode prop
	isSelected: boolean;
	onSelect: () => void;
	onUpdateItems?: (id: string, items: Listing[]) => void;
}

export function WishlistCard({
	id,
	title,
	description,
	items: initialItems,
	deleteMode,
	reorderMode,
	isSelected,
	onSelect,
	onUpdateItems,
}: WishlistCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [items, setItems] = useState(initialItems);
	const [itemToDelete, setItemToDelete] = useState<number | null>(null);

	const handleClick = () => {
		if (deleteMode) {
			onSelect();
		} else if (!reorderMode) {
			// Only allow expansion if not in reorder mode
			setIsExpanded(!isExpanded);
		}
	};

	const handleDeleteItem = (itemId: number) => {
		const newItems = items.filter((item) => item.id !== itemId);
		setItems(newItems);
		onUpdateItems?.(id, newItems);
		setItemToDelete(null);
	};

	const handleReorder = (newOrder: Listing[]) => {
		setItems(newOrder);
		onUpdateItems?.(id, newOrder);
	};

	const handleReorderStart = (event: React.PointerEvent) => {
		event.stopPropagation();
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
					width: isExpanded ? "calc(100% - 2rem)" : "300px",
					position: isExpanded ? "relative" : "static",
					zIndex: isExpanded ? 50 : 0,
				}}
				transition={{ duration: 0.3 }}
			>
				<Card
					className={cn(
						"transition-all duration-200",
						deleteMode || reorderMode ? "cursor-default" : "cursor-pointer",
						deleteMode
							? "hover:border-red-300"
							: reorderMode
								? "hover:border-green-400"
								: "border-fuchsia-300 hover:shadow-md",
						isSelected && "border-2 border-red-500",
						isExpanded && "max-w-full"
					)}
					onClick={handleClick}
				>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>{title}</CardTitle>
							{!deleteMode && !reorderMode && (
								<motion.div
									animate={{ rotate: isExpanded ? -90 : 90 }}
									transition={{ duration: 0.3 }}
									className="cursor-pointer"
								>
									<ChevronDown className="h-5 w-5" />
								</motion.div>
							)}
						</div>
						<p className="text-muted-foreground text-sm">{description}</p>
					</CardHeader>
					<AnimatePresence>
						{isExpanded && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<CardContent>
									<Reorder.Group
										axis="x"
										values={items}
										onReorder={handleReorder}
										className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-3" // Added pl-3 for left padding
									>
										{items.map((listing) => (
											<Reorder.Item
												key={listing.id}
												value={listing}
												onPointerDown={handleReorderStart}
												className="group/item snap-center"
											>
												<div
													className="group relative w-[300px]"
													onClick={(e) => e.stopPropagation()}
												>
													<SavedListingCard
														listing={listing}
														onDelete={() => setItemToDelete(listing.id)}
													/>
													<div className="absolute top-1/2 -translate-x-4 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
														<GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
													</div>
												</div>
											</Reorder.Item>
										))}
									</Reorder.Group>
								</CardContent>
							</motion.div>
						)}
					</AnimatePresence>
				</Card>
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
		</>
	);
}
