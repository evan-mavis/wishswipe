import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
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

	const handleClick = () => {
		if (deleteMode) {
			onSelect();
		} else {
			setIsExpanded(!isExpanded);
		}
	};

	const handleDeleteItem = (e: React.MouseEvent, itemId: number) => {
		e.stopPropagation(); // Prevent click from bubbling to card
		const newItems = items.filter((item) => item.id !== itemId);
		setItems(newItems);
		onUpdateItems?.(id, newItems);
	};

	const handleReorder = (newOrder: Listing[]) => {
		setItems(newOrder);
		onUpdateItems?.(id, newOrder);
	};

	return (
		<motion.div
			layout
			animate={{ width: isExpanded ? "100%" : "300px" }}
			transition={{ duration: 0.3 }}
		>
			<Card
				className={cn(
					"cursor-pointer transition-all duration-200",
					deleteMode
						? "hover:border-red-300"
						: "border-fuchsia-300 hover:shadow-md",
					isSelected && "border-2 border-red-500"
				)}
				onClick={handleClick}
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>{title}</CardTitle>
						<motion.div
							animate={{ rotate: isExpanded ? 180 : 0 }}
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
							initial={{ height: 0 }}
							animate={{ height: "auto" }}
							exit={{ height: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden"
						>
							<CardContent>
								<Reorder.Group
									axis="y"
									values={items}
									onReorder={handleReorder}
									className="grid gap-4"
								>
									{items.map((listing) => (
										<Reorder.Item key={listing.id} value={listing}>
											<div className="group relative">
												<div className="absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
													<GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
												</div>
												<div className="absolute top-1/2 right-0 translate-x-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
													<Button
														variant="ghost"
														size="sm"
														className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
														onClick={(e) => handleDeleteItem(e, listing.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
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
	);
}
