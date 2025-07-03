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
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLargerImageUrl } from "@/lib/image";

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
	const isMobile = useIsMobile();

	const displayImageUrl = getLargerImageUrl(listing.imageUrl);

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
							<div className="relative">
								<img
									src={displayImageUrl}
									alt={listing.title}
									className="h-full w-full rounded-md object-cover"
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
						<div className="aspect-video w-full overflow-hidden rounded-lg">
							<img
								src={displayImageUrl}
								alt={listing.title}
								className="h-full w-full object-contain"
							/>
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
