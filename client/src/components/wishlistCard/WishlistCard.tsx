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

interface WishlistCardProps extends WishList {
	deleteMode: boolean;
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
		} else {
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
						"cursor-pointer transition-all duration-200",
						deleteMode
							? "hover:border-red-300"
							: "border-fuchsia-300 hover:shadow-md",
						isSelected && "border-2 border-red-500",
						isExpanded && "max-w-full"
					)}
					onClick={handleClick}
				>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>{title}</CardTitle>
							<motion.div
								animate={{ rotate: isExpanded ? -90 : 90 }} // Change rotation to be horizontal
								transition={{ duration: 0.3 }}
								className="cursor-pointer"
							>
								<ChevronDown className="h-5 w-5" />
							</motion.div>
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
										className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
									>
										{items.map((listing) => (
											<Reorder.Item
												key={listing.id}
												value={listing}
												onPointerDown={handleReorderStart}
												className="snap-center"
											>
												<div
													className="group relative w-[300px]" // Fixed width for each item
													onClick={(e) => e.stopPropagation()}
												>
													<div className="absolute -top-2 -right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
														<Button
															variant="ghost"
															size="sm"
															className="bg-background h-8 w-8 rounded-full p-0 hover:bg-red-100 hover:text-red-500"
															onClick={(e) => {
																e.stopPropagation();
																setItemToDelete(listing.id);
															}}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
													<div className="absolute top-1/2 -left-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
														<GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
													</div>
													<SavedListingCard listing={listing} />
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
