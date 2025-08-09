import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";
import type { Listing } from "@/types/listing";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingCaptionProps {
	isActive: boolean;
	listing: Listing;
}

export function ListingCaption({ isActive, listing }: ListingCaptionProps) {
	const isMobile = useIsMobile();

	if (!listing) {
		return null;
	}

	return (
		<div className="relative mb-1 flex justify-center sm:mb-2">
			<div
				className={`bg-card relative inline-block transition-all duration-300 ${
					isActive ? "animate-bounce-in translate-x-0 opacity-100" : "opacity-0"
				} ease-out ${
					isMobile
						? "mt-0 max-w-[240px] p-1"
						: "mt-1 max-w-[280px] p-2 sm:mt-2 sm:max-w-md sm:p-3 md:max-w-lg md:p-4 lg:max-w-xl"
				}`}
			>
				<div className={`absolute ${isMobile ? "-inset-4.5" : "-inset-4"}`}>
					<CornersFrame />
				</div>
				<h3
					className={`leading-tight font-semibold break-words ${
						isMobile ? "text-xs" : "md:text-md text-sm sm:text-base"
					}`}
				>
					{listing.title}
				</h3>
				<p
					className={`text-gray-500 ${
						isMobile ? "text-xs" : "text-xs sm:text-sm"
					}`}
				>
					Seller Score: {listing.sellerFeedbackScore}
				</p>
				<p
					className={`font-bold ${
						isMobile ? "text-sm" : "text-base sm:text-lg md:text-xl"
					}`}
				>
					${listing.price.value}
				</p>
				<p className={isMobile ? "text-xs" : "text-xs sm:text-sm"}>
					Condition: {listing.condition}
				</p>
			</div>
		</div>
	);
}
