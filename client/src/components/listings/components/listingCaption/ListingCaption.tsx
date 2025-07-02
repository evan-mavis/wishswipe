import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";
import type { Listing } from "@/types/listing";

interface ListingCaptionProps {
	isActive: boolean;
	listing: Listing;
}

export function ListingCaption({ isActive, listing }: ListingCaptionProps) {
	if (!listing) {
		return null;
	}

	return (
		<div className="mb-1 flex justify-center sm:mb-2">
			<div
				className={`relative mt-1 inline-block p-2 transition-all duration-300 sm:mt-2 sm:p-3 md:p-4 ${
					isActive ? "animate-bounce-in translate-x-0 opacity-100" : "opacity-0"
				} max-w-[280px] ease-out sm:max-w-full`}
			>
				<CornersFrame />
				<h3 className="truncate text-sm font-semibold sm:text-base md:text-lg">
					{listing.title}
				</h3>
				<p className="text-xs text-gray-500 sm:text-sm">
					Seller Score: {listing.sellerFeedbackScore}
				</p>
				<p className="text-base font-bold sm:text-lg md:text-xl">
					${listing.price.value}
				</p>
				<p className="text-xs sm:text-sm">Condition: {listing.condition}</p>
			</div>
		</div>
	);
}
