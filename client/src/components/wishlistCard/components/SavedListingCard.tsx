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

interface SavedListingCardProps {
	listing: Listing;
	onDelete?: () => void;
}

export function SavedListingCard({ listing, onDelete }: SavedListingCardProps) {
	const [showDetails, setShowDetails] = useState(false);

	if (!listing) return null;

	return (
		<>
			<Card className="group/item relative overflow-hidden">
				<CardContent className="p-0">
					{onDelete && (
						<Button
							variant="ghost"
							size="sm"
							className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 opacity-0 transition-opacity group-hover/item:opacity-100"
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
					<div className="flex gap-4 p-4">
						<div className="h-20 w-20 overflow-hidden rounded-md">
							<img
								src={listing.imageUrl}
								alt={listing.details.title}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="flex flex-1 flex-col justify-center">
							<h3 className="font-medium">{listing.details.title}</h3>
							<p className="text-muted-foreground">
								${listing.details.price.toFixed(2)}
							</p>
							<p className="text-muted-foreground text-xs">
								{listing.details.condition}
							</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-2 bottom-2 h-8 w-8 rounded-full p-0 opacity-0 transition-opacity group-hover/item:opacity-100"
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
						<DialogTitle>{listing.details.title}</DialogTitle>
					</DialogHeader>
					<div className="grid gap-6">
						<div className="aspect-video w-full overflow-hidden rounded-lg">
							<img
								src={listing.imageUrl}
								alt={listing.details.title}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Price:</span>
								<span className="font-medium">
									${listing.details.price.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Condition:</span>
								<span className="font-medium">{listing.details.condition}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Seller:</span>
								<span className="font-medium">{listing.details.seller}</span>
							</div>
							<Button
								className="mt-4 bg-fuchsia-300 hover:bg-fuchsia-400"
								onClick={() => window.open("https://ebay.com", "_blank")}
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
