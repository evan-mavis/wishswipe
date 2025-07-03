import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import type { Listing } from "@/types/listing";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLargerImageUrl } from "@/lib/image";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedListingCardProps {
	listing: Listing;
	onDelete?: () => void;
	isReorderMode?: boolean; // Add this prop
}

export function SavedListingCard({
	listing,
	onDelete,
	isReorderMode,
}: SavedListingCardProps) {
	const [showDetails, setShowDetails] = useState(false);
	const [highResImageLoaded, setHighResImageLoaded] = useState(false);
	const isMobile = useIsMobile();

	const highResImageUrl = getLargerImageUrl(listing.imageUrl, 800);

	// Preload the high-resolution image when component mounts
	useEffect(() => {
		const img = new Image();
		img.onload = () => setHighResImageLoaded(true);
		img.src = highResImageUrl;
	}, [highResImageUrl]);

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
					{onDelete && (
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
						<div className="space-y-3">
							<div className="relative aspect-square overflow-hidden rounded-md">
								<img
									src={getLargerImageUrl(listing.imageUrl, 450)}
									alt={listing.title}
									className="h-full w-full object-contain"
								/>
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
					</div>
				</CardContent>
			</Card>

			<Dialog open={showDetails} onOpenChange={setShowDetails}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>{listing.title}</DialogTitle>
					</DialogHeader>
					<div className="grid gap-6">
						<div className="rounded-lg">
							{!highResImageLoaded ? (
								<div className="flex items-center justify-center">
									<Skeleton className="h-80 w-full rounded-lg" />
								</div>
							) : (
								<img
									src={highResImageUrl}
									alt={listing.title}
									className="max-h-[60vh] w-full object-contain"
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
								className="mt-4 bg-fuchsia-300 hover:bg-fuchsia-400"
								onClick={() => window.open(listing.itemWebUrl, "_blank")}
							>
								View on eBay
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
