import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand } from "lucide-react";
import type { Listing } from "@/types/listing";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, memo } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLargerImageUrl } from "@/lib/image";
import { Skeleton } from "@/components/ui/skeleton";
import type { AvailabilityStatus } from "@/types/wishlist";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SavedListingCardProps {
	listing: Listing & {
		availabilityStatus?: AvailabilityStatus;
	};
	onDelete?: () => void;
	isReorderMode?: boolean;
}

export const SavedListingCard = memo(function SavedListingCard({
	listing,
	onDelete,
	isReorderMode,
}: SavedListingCardProps) {
	const [showDetails, setShowDetails] = useState(false);
	const [highResImageLoaded, setHighResImageLoaded] = useState(false);
	const isMobile = useIsMobile();

	const highResImageUrl = getLargerImageUrl(listing.imageUrl, 800);

	// Only preload high-res image if not in reorder mode and details dialog is opened
	useEffect(() => {
		if (!isReorderMode && showDetails) {
			const img = new Image();
			img.onload = () => setHighResImageLoaded(true);
			img.src = highResImageUrl;
		}
	}, [highResImageUrl, showDetails, isReorderMode]);

	if (!listing) return null;

	return (
		<>
			<Card
				className={cn(
					"group/item relative overflow-hidden transition-colors",
					isReorderMode && "hover:border-green-400",
					isMobile && "w-full"
				)}
			>
				<CardContent className="p-0">
					{onDelete && !isReorderMode && (
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"absolute top-2 right-2 h-8 w-8 rounded-full p-0 transition-opacity",
								!isMobile && "opacity-0 group-hover/item:opacity-100",
								isMobile && "opacity-100"
							)}
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
					<div className={cn("p-4", isMobile && "w-full")}>
						{/* Status badge above image */}
						{listing.availabilityStatus &&
							!["IN_STOCK", "LIMITED_STOCK"].includes(
								listing.availabilityStatus
							) && (
								<div className="mb-2 flex justify-center">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Badge variant="destructive" className="text-xs">
													{`Status Update: ${
														listing.availabilityStatus === "NOT_FOUND"
															? "Not Found"
															: listing.availabilityStatus === "ENDED"
																? "Listing Ended"
																: listing.availabilityStatus === "OUT_OF_STOCK"
																	? "Out of Stock"
																	: "Unknown Status"
													}`}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-[220px] text-xs">
													{listing.availabilityStatus === "NOT_FOUND" &&
														"We could no longer find the listing."}
													{listing.availabilityStatus === "ENDED" &&
														"The listing has likely ended."}
													{listing.availabilityStatus === "OUT_OF_STOCK" &&
														"This item is likely out of stock."}
													{listing.availabilityStatus ===
														"UNKNOWN_AVAILABILITY" &&
														"We can't determine this listing's availability right now."}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							)}
						<div className="space-y-3">
							<div className="relative aspect-square overflow-hidden rounded-md">
								<img
									src={getLargerImageUrl(listing.imageUrl, 450)}
									alt={listing.title}
									className="h-full w-full object-contain"
									draggable={false}
									loading={isReorderMode ? "lazy" : "eager"}
								/>
								{/* Image is not dimmed; card border conveys status */}
							</div>
							<div className="space-y-1">
								<h3 className="line-clamp-2 text-sm font-medium">
									{listing.title}
								</h3>
								<p className="text-muted-foreground font-semibold">
									${listing.price.value.toString()}
								</p>
							</div>
						</div>
						{!isReorderMode && (
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									"absolute right-2 bottom-2 h-8 w-8 rounded-full p-0 transition-opacity",
									!isMobile && "opacity-0 group-hover/item:opacity-100",
									isMobile && "opacity-100"
								)}
								onClick={(e) => {
									e.stopPropagation();
									setShowDetails(true);
								}}
							>
								<Expand className="h-4 w-4" />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{!isReorderMode && (
				<Dialog open={showDetails} onOpenChange={setShowDetails}>
					<DialogContent
						className={cn(
							"sm:max-w-[600px]",
							isMobile && "max-h-[90vh] overflow-y-auto p-4"
						)}
					>
						<DialogHeader>
							<DialogTitle className="line-clamp-2">
								{listing.title}
							</DialogTitle>
						</DialogHeader>
						<div className="grid gap-6">
							<div className="rounded-lg">
								{!highResImageLoaded ? (
									<div className="flex items-center justify-center">
										<Skeleton
											className={cn(
												"w-full rounded-lg",
												isMobile ? "h-48" : "h-80"
											)}
										/>
									</div>
								) : (
									<img
										src={highResImageUrl}
										alt={listing.title}
										className={cn(
											"w-full object-contain",
											isMobile ? "max-h-[40vh]" : "max-h-[60vh]"
										)}
										draggable={false}
									/>
								)}
							</div>
							<div className="grid gap-2">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Price:</span>
									<span className="font-medium">
										${listing.price.value.toString()}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Condition:</span>
									<span className="font-medium">{listing.condition}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										Seller Feedback Score:
									</span>
									<span className="font-medium">
										{listing.sellerFeedbackScore}
									</span>
								</div>
								<Button
									className={cn(
										"bg-fuchsia-300 hover:bg-fuchsia-400",
										isMobile ? "mt-3" : "mt-4"
									)}
									onClick={() => window.open(listing.itemWebUrl, "_blank")}
								>
									View on eBay
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
});
