import { Card, CardContent } from "@/components/ui/card";
import type { Listing } from "@/types/listing";

interface SavedListingCardProps {
	listing: Listing;
}

export function SavedListingCard({ listing }: SavedListingCardProps) {
	if (!listing) return null;

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="flex gap-4 p-4">
					<div className="h-20 w-20 overflow-hidden rounded-md">
						<img
							src={listing.imageUrl}
							alt={listing.details.title}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="flex flex-col justify-center">
						<h3 className="font-medium">{listing.details.title}</h3>
						<p className="text-muted-foreground">
							${listing.details.price.toFixed(2)}
						</p>
						<p className="text-muted-foreground text-xs">
							{listing.details.condition}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
