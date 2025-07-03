import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, GripVertical, Pencil } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ListingReorderControls } from "./ListingReorderControls";
import { cn } from "@/lib/utils";

interface WishlistCardHeaderProps {
	name: string;
	description: string;
	isExpanded: boolean;
	deleteMode: boolean;
	reorderMode?: boolean;
	listingReorderMode: boolean;
	canReorder: boolean;
	isMobile: boolean;
	onEdit: () => void;
	onChevronClick: (e: React.MouseEvent) => void;
	onReorderStart: (e: React.MouseEvent) => void;
	onReorderCancel: (e: React.MouseEvent) => void;
	onReorderSave: (e: React.MouseEvent) => void;
}

export function WishlistCardHeader({
	name,
	description,
	isExpanded,
	deleteMode,
	reorderMode,
	listingReorderMode,
	canReorder,
	isMobile,
	onEdit,
	onChevronClick,
	onReorderStart,
	onReorderCancel,
	onReorderSave,
}: WishlistCardHeaderProps) {
	return (
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
											onEdit();
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
					{!deleteMode && !reorderMode && isExpanded && canReorder && (
						<>
							{listingReorderMode ? (
								<ListingReorderControls
									onCancel={onReorderCancel}
									onSave={onReorderSave}
								/>
							) : (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												onClick={onReorderStart}
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
							rotate: isExpanded ? (isMobile ? 0 : 90) : isMobile ? 180 : -90,
						}}
						transition={{ duration: 0.4 }}
						className="cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-800"
						onClick={onChevronClick}
					>
						<ChevronDown className="h-5 w-5" />
					</motion.div>
				</div>
			</div>
			<p className="text-muted-foreground mb-2 text-sm">{description}</p>
		</CardHeader>
	);
}
